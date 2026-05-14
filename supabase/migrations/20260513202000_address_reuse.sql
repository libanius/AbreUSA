alter table public.applicants
  add column if not exists residential_street text,
  add column if not exists residential_city text,
  add column if not exists residential_state text,
  add column if not exists residential_zip text;

alter table public.llcs
  add column if not exists principal_same_as_applicant_address boolean not null default false;
