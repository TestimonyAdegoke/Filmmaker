# NOIRFRAME — Production Portfolio

A production-ready cinematic portfolio for a filmmaker, film composer, score engineer and music producer.

## Included

- Next.js 16 App Router + TypeScript
- Cinematic single-page public experience with Framer Motion
- Full-screen hero and scroll choreography
- Dynamic project pages at `/work/[slug]`
- Persistent in-session audio player
- Filmography and credits presentation
- Responsive/mobile choreography
- `prefers-reduced-motion` accessibility support
- Supabase Auth protected `/admin` studio
- Supabase Postgres content model for projects, tracks and site settings
- Supabase Storage media uploads with RLS policies
- Production SQL migration
- Fallback demo content so the site previews before Supabase is configured
- Vercel-ready environment setup

## 1. Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Connect Supabase

Create a Supabase project, then:

1. Copy `.env.example` to `.env.local`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Run `supabase/migrations/001_initial.sql` in the Supabase SQL Editor.
4. Create the portfolio owner in Supabase Authentication using email/password.
5. Promote that user to admin:

```sql
insert into public.admins(user_id)
select id from auth.users where email='YOUR_EMAIL';
```

6. Open `/admin/login` and sign in.

## 3. Content Studio

The authenticated studio supports:

- Film/score/music/commercial/documentary projects
- Poster/artwork upload
- Hero video upload
- Audio track upload
- Roles, descriptions and case-study copy
- Featured/published controls
- Score genre, duration and artwork
- Delete controls

Uploaded assets are stored in the `portfolio` Supabase Storage bucket. The SQL migration enables public reads while restricting mutations to users in `public.admins`.

## 4. Production media guidance

The included Storage uploader is appropriate for ordinary images, audio and moderate video assets. For large masters, long-form 4K footage, adaptive streaming or heavy traffic, use a dedicated video pipeline such as Mux or Cloudinary and store the resulting playback URL in the project record. The database already exposes URL fields for that architecture.

## 5. Deploy to Vercel

Push the project to GitHub, import it into Vercel, and configure the same environment variables in the Vercel project. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

Then run:

```bash
npm run build
```

before deployment to catch type/build errors.

## Customize the identity

Default visual identity is `NOIRFRAME`. Replace the `portfolio` row in `site_settings`, or update `data/fallback.ts` while working without Supabase. Replace the sample Unsplash imagery with the artist's own stills, BTS images and portrait before launch.

## Project structure

```text
app/
  admin/                Authenticated content studio
  work/[slug]/          Cinematic project case study
  globals.css           Full visual system
  layout.tsx
  page.tsx
components/
  portfolio-shell.tsx   Public interactive SPA experience
data/
  fallback.ts           Demo content / no-backend fallback
lib/
  content.ts            Data access layer
  types.ts
  supabase/             SSR + browser clients
supabase/migrations/
  001_initial.sql       Database, RLS and Storage setup
proxy.ts                Supabase session refresh for Next.js 16
```
