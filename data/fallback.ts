import type { Project, SiteSettings, Track } from '@/lib/types';

export const fallbackSettings: SiteSettings = {
  artist_name: 'NOIRFRAME',
  eyebrow: 'COMPOSER · MUSIC PRODUCER · SOUND DESIGNER',
  hero_line_1: 'I build emotion',
  hero_line_2: 'through music and sound.',
  bio: 'I compose, produce and design sound for film, records and brands. My work lives where melody, texture, rhythm and picture meet — building sonic worlds that make stories feel larger, sharper and more human.',
  email: 'hello@example.com',
  imdb_url: '#',
  vimeo_url: '#',
  spotify_url: '#',
  instagram_url: '#',
};

export const fallbackProjects: Project[] = [
  {
    id: 'glass-horizon', slug: 'glass-horizon', title: 'Glass Horizon', year: 2026,
    type: 'Film', roles: 'Composer · Sound Designer',
    description: 'A desert road film scored around memory, distance and the things we carry into silence.',
    story: 'A visual meditation on distance, inheritance and the strange intimacy of a long road home. The score moves between intimate piano, processed strings and environmental textures drawn from the world of the film.',
    poster_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85',
    hero_video_url: null, trailer_url: null, accent: '#b35c45', featured: true, published: true, sort_order: 1,
    credits: { Composer: 'Artist Name', 'Sound Designer': 'Artist Name', Cinematography: 'Sample Credit' },
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
    id: 'the-quiet-between', slug: 'the-quiet-between', title: 'The Quiet Between', year: 2025,
    type: 'Film', roles: 'Composer · Sound Designer',
    description: 'An intimate drama where sparse instrumentation and close-detail sound carry what dialogue leaves unsaid.',
    story: 'The sonic language is intentionally restrained: room tone, breath, felt piano and fragile string gestures become part of the storytelling grammar.',
    poster_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=85',
    accent: '#a89e88', featured: true, published: true, sort_order: 3,
  },
  {
    id: 'stay-a-little', slug: 'stay-a-little', title: 'Stay A Little', year: 2026,
    type: 'Music', roles: 'Music Producer · Arrangement',
    description: 'Warm alternative R&B production built around intimate vocals, dusty drums and a wide late-night chorus.',
    story: 'A record shaped from a stripped voice-note demo into a detailed, spacious production without losing the vulnerability of the original idea.',
    poster_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=85',
    accent: '#b98269', featured: false, published: true, sort_order: 4,
  },
  {
    id: 'move-different', slug: 'move-different', title: 'Move Different', year: 2026,
    type: 'Music', roles: 'Music Producer · Vocal Production',
    description: 'A rhythm-forward pop record balancing live percussion, synth bass and layered vocal textures.',
    story: 'The production was designed to feel immediate on first listen while revealing small rhythmic and vocal details over repeated plays.',
    poster_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85',
    accent: '#7f674f', featured: false, published: true, sort_order: 5,
  },
  {
    id: 'velocity-campaign', slug: 'velocity-campaign', title: 'Velocity', year: 2026,
    type: 'Commercial', roles: 'Composer · Sound Designer',
    description: 'A kinetic automotive campaign built around engine rhythm, metallic impacts and a custom hybrid score.',
    story: 'The music and sound design were developed together so the vehicle, edit and score feel like a single rhythmic instrument.',
    poster_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=85',
    accent: '#8c2b24', featured: false, published: true, sort_order: 6,
  },
  {
    id: 'soft-light-campaign', slug: 'soft-light-campaign', title: 'Soft Light', year: 2025,
    type: 'Commercial', roles: 'Composer · Sound Designer',
    description: 'A beauty film using breath, glass, fabric movement and a minimal vocal score to create tactile intimacy.',
    story: 'Every sound was designed to feel close enough to touch, while the score leaves deliberate negative space around the product moments.',
    poster_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=85',
    accent: '#b9a69b', featured: false, published: true, sort_order: 7,
  }
];

export const fallbackTracks: Track[] = [
  { id: 't1', slug: 'glass-horizon-main-theme', title: 'Glass Horizon — Main Theme', genre: 'ORCHESTRAL / AMBIENT', duration: '04:18', audio_url: null, project_id: 'glass-horizon', featured: true, sort_order: 1 },
  { id: 't2', slug: 'neon-rain', title: 'Neon Rain', genre: 'ELECTRONIC / NOIR', duration: '03:42', audio_url: null, project_id: 'after-midnight', featured: true, sort_order: 2 },
  { id: 't3', slug: 'home-before-dawn', title: 'Home Before Dawn', genre: 'PIANO / STRINGS', duration: '02:57', audio_url: null, featured: true, sort_order: 3 },
  { id: 't4', slug: 'stay-a-little', title: 'Stay A Little', genre: 'ALT R&B / SOUL', duration: '03:26', audio_url: null, artwork_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=85', project_id: 'stay-a-little', featured: true, sort_order: 4 },
  { id: 't5', slug: 'move-different', title: 'Move Different', genre: 'POP / AFRO-FUSION', duration: '02:54', audio_url: null, artwork_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=85', project_id: 'move-different', featured: true, sort_order: 5 },
];
