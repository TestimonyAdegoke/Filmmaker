import type { Project, SiteSettings, Track } from '@/lib/types';

export const fallbackSettings: SiteSettings = {
  artist_name: 'NOIRFRAME',
  eyebrow: 'FILMMAKER · FILM COMPOSER · SCORE ENGINEER · MUSIC PRODUCER',
  hero_line_1: 'I tell stories',
  hero_line_2: 'in picture and sound.',
  bio: 'I create cinematic experiences across directing, composition, score engineering and music production. My work begins with emotion and ends with a world the audience can inhabit.',
  email: 'hello@example.com',
  imdb_url: '#',
  vimeo_url: '#',
  spotify_url: '#',
  instagram_url: '#',
};

export const fallbackProjects: Project[] = [
  {
    id: 'glass-horizon', slug: 'glass-horizon', title: 'Glass Horizon', year: 2026,
    type: 'Film', roles: 'Director · Composer · Score Engineer',
    description: 'A desert road film about memory, distance and the things we carry into silence.',
    story: 'A visual meditation on distance, inheritance and the strange intimacy of a long road home.',
    poster_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    hero_video_url: null, trailer_url: null, accent: '#b35c45', featured: true, published: true, sort_order: 1,
    credits: { Director: 'Artist Name', Composer: 'Artist Name', Cinematography: 'Sample Credit' },
    awards: ['Official Selection — Sample Film Festival'],
  },
  {
    id: 'after-midnight', slug: 'after-midnight', title: 'After Midnight', year: 2025,
    type: 'Score', roles: 'Composer · Music Producer',
    description: 'An electronic-noir score moving between pulse, loneliness and midnight city light.',
    story: 'Synth texture, restrained percussion and human breath shape an urban score built around unease and restraint.',
    poster_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=85',
    accent: '#37576b', featured: true, published: true, sort_order: 2,
  },
  {
    id: 'quiet-between', slug: 'the-quiet-between', title: 'The Quiet Between', year: 2025,
    type: 'Film', roles: 'Director · Producer',
    description: 'A restrained portrait of two people learning to speak through everything left unsaid.',
    story: 'An intimate short film where gesture, framing and silence carry more weight than dialogue.',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85',
    accent: '#a89e88', featured: true, published: true, sort_order: 3,
  }
];

export const fallbackTracks: Track[] = [
  { id: 't1', slug: 'glass-horizon-main-theme', title: 'Glass Horizon — Main Theme', genre: 'ORCHESTRAL / AMBIENT', duration: '04:18', audio_url: null, featured: true, sort_order: 1 },
  { id: 't2', slug: 'neon-rain', title: 'Neon Rain', genre: 'ELECTRONIC / NOIR', duration: '03:42', audio_url: null, featured: true, sort_order: 2 },
  { id: 't3', slug: 'home-before-dawn', title: 'Home Before Dawn', genre: 'PIANO / STRINGS', duration: '02:57', audio_url: null, featured: true, sort_order: 3 },
];
