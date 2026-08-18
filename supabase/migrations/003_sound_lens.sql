-- Film Sound Lens: synchronized score and sound-design stems for selected screen projects.
alter table public.projects
  add column if not exists score_stem_url text,
  add column if not exists sound_design_stem_url text,
  add column if not exists sound_lens_note text;
