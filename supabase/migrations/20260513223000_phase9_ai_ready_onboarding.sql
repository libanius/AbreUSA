alter table public.orders
  add column if not exists onboarding_entry_mode text not null default 'manual',
  add column if not exists document_extraction_status text not null default 'not_started',
  add column if not exists extracted_applicant_data jsonb not null default '{}'::jsonb,
  add column if not exists extracted_address_data jsonb not null default '{}'::jsonb,
  add column if not exists extraction_confidence numeric,
  add column if not exists user_confirmed_extracted_data boolean not null default false,
  add column if not exists agent_summary text,
  add column if not exists missing_information_flags jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_onboarding_entry_mode_check'
  ) then
    alter table public.orders
      add constraint orders_onboarding_entry_mode_check
      check (onboarding_entry_mode in ('manual', 'document_assisted'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_document_extraction_status_check'
  ) then
    alter table public.orders
      add constraint orders_document_extraction_status_check
      check (document_extraction_status in ('not_started', 'pending', 'completed', 'failed'));
  end if;
end $$;
