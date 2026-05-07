-- AbreUSA Production RLS And Storage Lockdown
--
-- Apply only after:
-- - /api/orders persists approved orders with SUPABASE_SERVICE_ROLE_KEY.
-- - SUPABASE_SERVICE_ROLE_KEY is configured in the production runtime.
-- - Existing development/test data retention is decided.
-- - Existing storage policy names are confirmed in the Supabase project.
--
-- This artifact intentionally does not add anon or authenticated access
-- policies for order tables. The MVP has no customer auth or reviewer auth
-- model yet, so direct public reads/writes must remain closed.

begin;

alter table public.orders enable row level security;
alter table public.applicants enable row level security;
alter table public.llcs enable row level security;
alter table public.members enable row level security;
alter table public.registered_agents enable row level security;
alter table public.ein_details enable row level security;
alter table public.generated_forms enable row level security;
alter table public.documents enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.applicants from anon, authenticated;
revoke all on public.llcs from anon, authenticated;
revoke all on public.members from anon, authenticated;
revoke all on public.registered_agents from anon, authenticated;
revoke all on public.ein_details from anon, authenticated;
revoke all on public.generated_forms from anon, authenticated;
revoke all on public.documents from anon, authenticated;

revoke all on sequence public.order_protocol_seq from anon, authenticated;

-- Remove known development policies for direct document access.
-- If the Supabase project uses different policy names, drop those manually
-- before applying production lockdown.
drop policy if exists "Allow anon document uploads" on storage.objects;
drop policy if exists "Allow document uploads" on storage.objects;
drop policy if exists "Allow document reads" on storage.objects;
drop policy if exists "documents anon upload" on storage.objects;
drop policy if exists "documents read" on storage.objects;
drop policy if exists "Allow anon uploads to documents bucket" on storage.objects;

update storage.buckets
set public = false
where id = 'documents';

commit;
