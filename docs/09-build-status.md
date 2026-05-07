# 09 Build Status

## Current Phase

Phase 7: Production Hardening.

Phase 6 is complete. P7-T04 is complete. The next task is applying and verifying Supabase RLS/storage lockdown.

## Last Completed Task

Task ID: `P7-T04`

Title: Enforce production Supabase service-role credential and add lockdown SQL artifact.

Result:

- Removed server-side fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server-side persistence now requires `SUPABASE_SERVICE_ROLE_KEY`.
- Added `supabase/rls-storage-lockdown.sql`.
- Fail-closed verification passed without service-role credentials.
- Service-role endpoint verification passed: `/api/orders` returned `200` and generated `AUS-2026-0007`.
- Browser verification passed with Complete Package order `AUS-2026-0008` and both required files attached.
- `npm run lint` passes.
- `npm run build` passes.

## Current Task

None. P7-T04 is complete.

## Next Task

Task ID: `P7-T05`

Title: Apply and verify Supabase RLS/storage lockdown.

Status: Awaiting execution.

Scope:

- Apply the reviewed lockdown SQL to Supabase.
- Confirm direct anon table reads/writes are denied for order tables.
- Confirm direct anon storage uploads/reads are denied for the `documents` bucket.
- Confirm `/api/orders` still persists approved orders with `SUPABASE_SERVICE_ROLE_KEY`.
- Keep customer auth, reviewer UI, signed URL implementation, payment, email, and agency submission out of scope.

Acceptance criteria:

- Lockdown SQL is applied successfully.
- Direct anon access to order tables is blocked.
- Direct anon access to document storage is blocked.
- Server-side approved-order persistence still works through `/api/orders`.
- Browser verification confirms an approved Complete Package order still persists with both required files attached.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated.

## Completed Tasks

- App Spine approved as official source of truth.
- Phases 1–5 complete.
- Phase 6 planning complete: P6-T01 closed.
- Phase 6 local confirmation complete: P6-T02 closed.
- Phase 6 persistence boundary documented: P6-T03 closed.
- Phase 6 Supabase persistence implemented: P6-T04 closed.
- Phase 6 production protocol generation: P6-T05 closed.
- Phase 6 applicant contact step: P6-T06 closed.
- Phase 6 document file upload: P6-T07 closed.
- Phase 6 email/customer handoff planning: P6-T08 closed.
- Phase 6 exit review and Phase 7 planning: P6-T09 closed.
- Phase 7 production security hardening plan: P7-T01 closed.
- Phase 7 server-side persistence boundary: P7-T02 closed.
- Phase 7 production credential and RLS/storage lockdown plan: P7-T03 closed.
- Phase 7 service-role enforcement and lockdown SQL artifact: P7-T04 closed.

## What Is Implemented

- Full guided 13-step intake for Complete Package and Florida LLC paths.
- Applicant contact step (name, email, phone) — step 2.
- Document collection for passport and U.S. address proof in local client state.
- Local review screen, generated preview shells (Articles + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number.
- Supabase persistence: orders, llcs, members, registered_agents, ein_details, generated_forms, applicants.
- Document file upload to Supabase private storage.
- `documents` table schema and storage bucket created in Supabase.
- Customer handoff plan: confirmation screen plus manual AbreUSA follow-up using persisted applicant contact data.
- Phase 6 exit criteria met and documented.
- Phase 7 security hardening plan documented.
- Server-side approved-order persistence route: `/api/orders`.
- Server-side Supabase persistence helpers for order rows and private document uploads.
- Browser persistence wrapper that posts to `/api/orders` instead of writing directly to Supabase.
- Production service-role credential requirement documented.
- RLS and storage lockdown SQL plan documented.
- Server-side persistence fails closed without `SUPABASE_SERVICE_ROLE_KEY`.
- Lockdown SQL artifact: `supabase/rls-storage-lockdown.sql`.
- Service-role browser verification passed with `AUS-2026-0008`.
- `lib/persist-order.ts`, `lib/persist-order-server.ts`, `lib/supabase-server.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Automated email notification implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- Applied Supabase RLS/storage lockdown (next task).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P7-T05: Apply and verify Supabase RLS/storage lockdown`

Deliverable:

- Apply `supabase/rls-storage-lockdown.sql` in Supabase.
- Verify anon table and storage access are blocked.
- Verify `/api/orders` still persists approved orders with service-role credentials.
- Re-run Complete Package browser verification.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Applying lockdown will affect the shared Supabase project; verify test/development data retention before running the SQL.
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
