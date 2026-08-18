export type ProjectType = 'Film' | 'Score' | 'Music' | 'Commercial' | 'Documentary';

export type Track = {
  id: string;
  title: string;
  slug: string;
  genre: string;
  duration?: string | null;
  audio_url?: string | null;
  artwork_url?: string | null;
  project_id?: string | null;
  featured?: boolean;
  sort_order?: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  year: number;
  type: ProjectType | string;
  roles: string;
  description: string;
  story?: string | null;
  poster_url?: string | null;
  hero_video_url?: string | null;
  trailer_url?: string | null;
  accent?: string | null;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
  credits?: Record<string, string> | null;
  awards?: string[] | null;
  score_stem_url?: string | null;
  sound_design_stem_url?: string | null;
  sound_lens_note?: string | null;
  created_at?: string;
};

export type SiteSettings = {
  artist_name: string;
  eyebrow: string;
  hero_line_1: string;
  hero_line_2: string;
  bio: string;
  email: string;
  imdb_url?: string;
  vimeo_url?: string;
  spotify_url?: string;
  instagram_url?: string;
};
