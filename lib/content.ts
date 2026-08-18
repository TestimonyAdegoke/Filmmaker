import { fallbackProjects, fallbackSettings, fallbackTracks } from '@/data/fallback';
import { createClient } from '@/lib/supabase/server';
import type { Project, SiteSettings, Track } from '@/lib/types';

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackProjects;
  const { data, error } = await supabase.from('projects').select('*').eq('published', true).order('sort_order').order('year', { ascending: false });
  return error || !data?.length ? fallbackProjects : data as Project[];
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  if (!supabase) return fallbackProjects.find((p) => p.slug === slug) ?? null;
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  return (data as Project | null) ?? fallbackProjects.find((p) => p.slug === slug) ?? null;
}

export async function getTracks(): Promise<Track[]> {
  const supabase = await createClient();
  if (!supabase) return fallbackTracks;
  const { data, error } = await supabase.from('tracks').select('*').eq('published', true).order('sort_order');
  return error || !data?.length ? fallbackTracks : data as Track[];
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  if (!supabase) return fallbackSettings;
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'portfolio').maybeSingle();
  return (data?.value as SiteSettings | undefined) ?? fallbackSettings;
}
