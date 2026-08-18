-- NOIRFRAME production schema
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year int not null,
  type text not null,
  roles text not null default '',
  description text not null default '',
  story text,
  poster_url text,
  hero_video_url text,
  trailer_url text,
  accent text default '#7f5b4d',
  credits jsonb default '{}'::jsonb,
  awards jsonb default '[]'::jsonb,
  featured boolean not null default true,
  published boolean not null default false,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  slug text unique not null,
  title text not null,
  genre text not null default '',
  duration text,
  audio_url text,
  artwork_url text,
  featured boolean not null default true,
  published boolean not null default true,
  sort_order int not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings(key,value) values ('portfolio', '{
  "artist_name":"NOIRFRAME",
  "eyebrow":"FILMMAKER · FILM COMPOSER · SCORE ENGINEER · MUSIC PRODUCER",
  "hero_line_1":"I tell stories",
  "hero_line_2":"in picture and sound.",
  "bio":"I create cinematic experiences across directing, composition, score engineering and music production. My work begins with emotion and ends with a world the audience can inhabit.",
  "email":"hello@example.com",
  "imdb_url":"#",
  "vimeo_url":"#",
  "spotify_url":"#",
  "instagram_url":"#"
}'::jsonb) on conflict (key) do nothing;

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.tracks enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

-- Public can only read published portfolio content.
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select using (published = true or public.is_admin());
drop policy if exists "public read published tracks" on public.tracks;
create policy "public read published tracks" on public.tracks for select using (published = true or public.is_admin());
drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings for select using (true);

-- Only admins can mutate content.
drop policy if exists "admins manage projects" on public.projects;
create policy "admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage tracks" on public.tracks;
create policy "admins manage tracks" on public.tracks for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins for select using (user_id = auth.uid() or public.is_admin());

-- Public bucket for portfolio media. RLS still prevents non-admin uploads/deletes.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('portfolio','portfolio',true,524288000,array['image/jpeg','image/png','image/webp','image/avif','audio/mpeg','audio/wav','audio/mp4','audio/x-m4a','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public=true;

drop policy if exists "public portfolio media read" on storage.objects;
create policy "public portfolio media read" on storage.objects for select using (bucket_id='portfolio');
drop policy if exists "admin portfolio media insert" on storage.objects;
create policy "admin portfolio media insert" on storage.objects for insert with check (bucket_id='portfolio' and public.is_admin());
drop policy if exists "admin portfolio media update" on storage.objects;
create policy "admin portfolio media update" on storage.objects for update using (bucket_id='portfolio' and public.is_admin());
drop policy if exists "admin portfolio media delete" on storage.objects;
create policy "admin portfolio media delete" on storage.objects for delete using (bucket_id='portfolio' and public.is_admin());

-- After creating the first Auth user, make them an admin with:
-- insert into public.admins(user_id) select id from auth.users where email='you@example.com';
