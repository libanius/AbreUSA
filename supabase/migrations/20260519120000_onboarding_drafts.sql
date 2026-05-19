-- Phase 12: Cross-device onboarding draft persistence
-- Keyed by applicant email; accessed only via service-role API route.
create table if not exists onboarding_drafts (
  email      text        primary key,
  draft_data jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table onboarding_drafts enable row level security;
revoke all on onboarding_drafts from anon, authenticated;
