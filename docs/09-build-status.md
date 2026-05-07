# 09 Build Status

## Current Phase

Phase 7: Production Hardening.

Phase 6 is complete. P6-T09 closed the order submission phase and moved the project into Phase 7 production hardening.

## Last Completed Task

Task ID: `P6-T09`

Title: Phase 6 exit review and Phase 7 planning.

Result:

- Phase 6 deliverables reviewed against exit criteria.
- Decision: move to Phase 7 production hardening.
- No remaining Phase 6 implementation blockers.
- Remaining production risks moved to Phase 7: Supabase RLS, storage policies, signed URLs, document retention, reviewer access, legal/compliance copy, validation, accessibility, mobile, performance, and production environment configuration.
- First Phase 7 hardening slice defined as P7-T01.
- No product code changed.

## Current Task

None. P6-T09 is complete.

## Next Task

Task ID: `P7-T01`

Title: Production security hardening plan — Supabase RLS, storage access, retention, and reviewer model.

Status: Awaiting execution.

Scope:

- Audit current Supabase tables, private storage bucket, disabled RLS state, and anon upload policy.
- Define RLS policy requirements for customer/order data tables.
- Define storage policy requirements for uploaded passport and U.S. address proof files.
- Define signed URL strategy for internal document review access.
- Define document retention policy and reviewer access model, or mark unresolved items as production blockers.
- Keep new product features, payment, admin UI, agency submission, and email implementation out of scope.

Acceptance criteria:

- Supabase RLS and storage policy requirements are documented.
- Signed URL approach is documented.
- Document retention and reviewer access decisions are documented or explicitly marked as blockers.
- First implementable Phase 7 security slice is defined.
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
- `lib/supabase.ts`, `lib/persist-order.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Automated email notification implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P7-T01: Production security hardening plan — Supabase RLS, storage access, retention, and reviewer model`

Deliverable:

- Audit current Supabase tables, private storage bucket, disabled RLS state, and anon upload policy.
- Define RLS and storage policy requirements.
- Define signed URL strategy for internal document access.
- Define document retention policy and reviewer access model, or mark blockers.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, `/progress/index.html`, and `/docs/08-decisions-log.md` if decisions changed.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
