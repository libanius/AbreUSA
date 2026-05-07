# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

P6-T08 is complete. Email notification and customer handoff are documented as a plan-only MVP handoff. The next step is Phase 6 exit review and Phase 7 planning.

## Last Completed Task

Task ID: `P6-T08`

Title: Plan email notification and customer handoff.

Result:

- Decision: planning only. Automated email sending is deferred.
- MVP handoff uses the confirmation screen plus persisted applicant contact data.
- AbreUSA manual follow-up remains the default until a sender/provider is confirmed.
- Customer notification contents documented: protocol number, service, LLC name, review status, no government submission yet, next steps, response window, and support channel.
- Customer handoff/timeline copy requirements documented.
- No email provider, Vercel email integration, Supabase trigger, or transactional email implementation was added.

## Current Task

None. P6-T08 is complete.

## Next Task

Task ID: `P6-T09`

Title: Phase 6 exit review and Phase 7 planning.

Status: Awaiting execution.

Scope:

- Review Phase 6 deliverables against exit criteria.
- Decide whether the current MVP can move to Phase 7 hardening.
- List remaining Phase 6 gaps, if any.
- Define first Phase 7 hardening slice.
- Keep new feature implementation out of scope.

Acceptance criteria:

- Phase 6 exit status is documented.
- Phase 7 first task is documented.
- Remaining risks/blockers are clearly listed.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated after the task.

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

`P6-T09: Phase 6 exit review and Phase 7 planning`

Deliverable:

- Review Phase 6 deliverables against exit criteria.
- Decide whether to move to Phase 7 hardening.
- Document remaining Phase 6 gaps, if any.
- Define the first Phase 7 hardening slice.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html`.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
