ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS travel_frequency text,
  ADD COLUMN IF NOT EXISTS travel_pain_point text,
  ADD COLUMN IF NOT EXISTS travel_personality text,
  ADD COLUMN IF NOT EXISTS local_frequency text,
  ADD COLUMN IF NOT EXISTS local_challenges text[],
  ADD COLUMN IF NOT EXISTS local_methods text[],
  ADD COLUMN IF NOT EXISTS use_cases text[],
  ADD COLUMN IF NOT EXISTS budget_level text,
  ADD COLUMN IF NOT EXISTS host_interest text;