# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

P6-T07 is complete. Browser and Supabase verification passed for document file upload to private storage. The next step is P6-T08 email notification and customer handoff planning.

## Last Completed Task

Task ID: `P6-T07`

Title: Document file upload to Supabase private storage bucket.

Result:

- `documents` private storage bucket created in Supabase.
- Storage upload policy created for anon role.
- `documents` table created in Supabase; RLS disabled for development.
- `supabase/schema.sql` updated with `documents` table.
- `documentFiles` state added to hold actual `File` objects separate from serializable metadata.
- `handleChangeDocumentFile` populates both serializable metadata and actual `File` objects.
- `lib/persist-order.ts` uploads passport and U.S. address proof files to `documents/{orderId}/{type}.{ext}` and inserts rows in the `documents` table.
- `npm run lint` passes. `npm run build` passes.
- Browser verification passed with Complete Package flow and both files attached.
- Supabase verification passed for `AUS-2026-0005`: document rows exist for passport and U.S. address proof.
- Private bucket object verification passed by same-path upload conflict for `passport.pdf` and `us_address_proof.pdf`.

## Current Task

None. P6-T07 is complete.

## Next Task

Task ID: `P6-T08`

Title: Plan email notification and customer handoff.

Status: Awaiting execution.

Scope:

- Decide whether Phase 6 needs only an email notification plan or a first implementation.
- Define the minimum customer notification contents after approved order persistence.
- Define whether email sends from the app, Supabase, Vercel, or remains an AbreUSA manual operation for MVP.
- Keep payment, direct agency submission, admin portal, RLS hardening, signed document URLs, and retention policy out of scope unless the App Spine is updated.

Acceptance criteria:

- Email notification decision is documented.
- Customer handoff/timeline copy requirements are documented.
- Any implementation slice is explicitly scoped before code changes.
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

## What Is Implemented

- Full guided 13-step intake for Complete Package and Florida LLC paths.
- Applicant contact step (name, email, phone) — step 2.
- Document collection for passport and U.S. address proof in local client state.
- Local review screen, generated preview shells (Articles + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number.
- Supabase persistence: orders, llcs, members, registered_agents, ein_details, generated_forms, applicants.
- Document file upload to Supabase private storage.
- `documents` table schema and storage bucket created in Supabase.
- `lib/supabase.ts`, `lib/persist-order.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Email notification plan or implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P6-T08: Plan email notification and customer handoff`

Deliverable:

- Decide whether this phase needs a plan only or first email implementation.
- Document customer notification contents and handoff/timeline copy.
- Keep payment, direct agency submission, admin portal, RLS hardening, signed document URLs, and retention policy out of scope unless confirmed.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html`.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
