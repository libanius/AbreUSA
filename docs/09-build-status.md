# 09 Build Status

## Current Phase

Phase 7: Production Hardening.

Phase 6 is complete. P7-T02 is complete. The next task is production Supabase credential and RLS/storage lockdown planning.

## Last Completed Task

Task ID: `P7-T02`

Title: Move approved-order persistence behind a server-side security boundary.

Result:

- Added `/api/orders` route handler for approved-order persistence and file upload.
- Moved Supabase table inserts and private document uploads into server-side helpers.
- Browser `persistOrder` now posts a multipart payload to `/api/orders`.
- Removed the unused browser Supabase client file.
- Customer-facing flow remains unchanged.
- Verification passed with Complete Package order `AUS-2026-0006` and both required files attached.
- `npm run lint` passes.
- `npm run build` passes.

## Current Task

None. P7-T02 is complete.

## Next Task

Task ID: `P7-T03`

Title: Plan production Supabase service-role credentials and RLS/storage lockdown SQL.

Status: Awaiting execution.

Scope:

- Decide the production server credential requirement for Supabase writes.
- Remove the development fallback to the anon key from the production plan.
- Draft SQL for enabling RLS on all order tables.
- Draft SQL for denying public table reads, updates, deletes, and direct inserts.
- Draft storage policy changes that remove direct public uploads and block document reads by default.
- Keep customer auth, reviewer UI, signed URL implementation, payment, email, and agency submission out of scope.

Acceptance criteria:

- Production Supabase credential requirement is documented.
- RLS lockdown SQL plan is documented.
- Storage lockdown SQL/policy plan is documented.
- Remaining blockers for applying the policies are explicit.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, `/progress/index.html`, and `/docs/08-decisions-log.md` are updated if decisions changed.

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
- `lib/persist-order.ts`, `lib/persist-order-server.ts`, `lib/supabase-server.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Automated email notification implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- Production service-role credential requirement and RLS/storage lockdown SQL plan (next task).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P7-T03: Plan production Supabase service-role credentials and RLS/storage lockdown SQL`

Deliverable:

- Document the required production Supabase server credential.
- Draft RLS lockdown SQL for all order tables.
- Draft storage lockdown policy changes for the private `documents` bucket.
- List blockers before applying the lockdown.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Development server path can fall back to anon credentials; production must use server-only credentials before RLS lockdown.
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
