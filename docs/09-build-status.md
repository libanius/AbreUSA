# 09 Build Status

## Current Phase

Phase 7: Production Hardening.

Phase 6 is complete. P7-T03 is complete. The next task is enforcing the production Supabase service-role credential and adding the lockdown SQL artifact.

## Last Completed Task

Task ID: `P7-T03`

Title: Plan production Supabase service-role credentials and RLS/storage lockdown SQL.

Result:

- Production Supabase credential requirement documented.
- Required production credential: server-only `SUPABASE_SERVICE_ROLE_KEY`.
- Development fallback to anon key is documented as local-only and must be removed before production lockdown.
- RLS lockdown SQL plan documented for all order tables.
- Storage lockdown SQL/policy plan documented for the private `documents` bucket.
- Remaining blockers before applying policies are explicit.
- No product code changed.

## Current Task

None. P7-T03 is complete.

## Next Task

Task ID: `P7-T04`

Title: Enforce production Supabase service-role credential and add lockdown SQL artifact.

Status: Awaiting execution.

Scope:

- Remove server-side fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Require `SUPABASE_SERVICE_ROLE_KEY` for server-side persistence.
- Add a Supabase SQL artifact for RLS/table grants and storage lockdown.
- Keep customer auth, reviewer UI, signed URL implementation, payment, email, and agency submission out of scope.

Acceptance criteria:

- Server persistence fails closed when `SUPABASE_SERVICE_ROLE_KEY` is missing.
- Server persistence works when `SUPABASE_SERVICE_ROLE_KEY` is present.
- Lockdown SQL artifact exists and covers all order tables and the `documents` bucket.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification confirms an approved Complete Package order still persists through `/api/orders` when service-role credentials are configured.

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
- `lib/persist-order.ts`, `lib/persist-order-server.ts`, `lib/supabase-server.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Automated email notification implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- Production service-role credential enforcement and lockdown SQL artifact (next task).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P7-T04: Enforce production Supabase service-role credential and add lockdown SQL artifact`

Deliverable:

- Remove server-side anon-key fallback.
- Require `SUPABASE_SERVICE_ROLE_KEY` for server persistence.
- Add lockdown SQL artifact covering order tables and the private `documents` bucket.
- Run lint, build, and browser verification with service-role credentials configured.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Development server path currently can fall back to anon credentials; P7-T04 must remove that fallback before RLS lockdown.
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
