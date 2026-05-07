# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

P6-T07 is in progress. Code is implemented and lint/build pass. Browser verification is pending.

## Last Completed Task

Task ID: `P6-T06`

Title: Applicant contact step — collect name, email, phone; persist to applicants table.

Result:

- `applicant_contact` FlowStep added after service selection (now step 2 of 13).
- `ApplicantContactDraft` type and `applicantContact` state added.
- Step UI collects name, email, and phone; gated on all three required.
- `applicants` table created in Supabase; RLS disabled for development.
- `persist-order.ts` updated with applicant insert.
- `supabase/schema.sql` updated with `applicants` table.
- `npm run lint` passes. `npm run build` passes.
- Browser verification passed: `AUS-2026-0004` with applicant row confirmed in Supabase.

## Current Task

Task ID: `P6-T07`

Title: Document file upload to Supabase private storage bucket.

Status: Code implemented. Browser verification pending.

What is done:

- `documents` private storage bucket created in Supabase.
- Storage upload policy created for anon role.
- `documents` table created in Supabase; RLS disabled for development.
- `supabase/schema.sql` updated with `documents` table.
- `documentFiles` state added to `GuidedIntakeShell`: holds actual `File` objects separate from serializable draft metadata.
- `handleChangeDocumentFile` updated to populate both `documents` (metadata) and `documentFiles` (File objects).
- `handleResetService` resets `documentFiles` on service restart.
- `lib/persist-order.ts` updated: `uploadAndRecordDocument` helper uploads each file to `documents/{orderId}/{type}.{ext}` and inserts a row in the `documents` table.
- `persistOrder` accepts optional `files` parameter; uploads run after all DB inserts.
- `handleContinueToConfirmation` passes `documentFiles` to `persistOrder`.
- `npm run lint` passes. `npm run build` passes.

What remains:

- Browser verification: complete a full intake flow with both passport and address proof files attached, confirm the confirmation screen is reached, and verify document rows in Supabase and files in the private bucket.

## Next Task

Task ID: `P6-T07` (completion)

To resume: complete browser verification for P6-T07.

Steps:

1. Start dev server: `PATH=/usr/local/opt/node@22/bin:$PATH npm run dev`
2. Open `http://localhost:3000`
3. Complete full intake flow; attach both passport and address proof files in the documents step.
4. Reach the confirmation screen.
5. Query Supabase `documents` table and `documents` storage bucket to confirm rows and files exist.
6. Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html`.

## Completed Tasks

- App Spine approved as official source of truth.
- Phases 1–5 complete.
- Phase 6 planning complete: P6-T01 closed.
- Phase 6 local confirmation complete: P6-T02 closed.
- Phase 6 persistence boundary documented: P6-T03 closed.
- Phase 6 Supabase persistence implemented: P6-T04 closed.
- Phase 6 production protocol generation: P6-T05 closed.
- Phase 6 applicant contact step: P6-T06 closed.

## What Is Implemented

- Full guided 13-step intake for Complete Package and Florida LLC paths.
- Applicant contact step (name, email, phone) — step 2.
- Document collection for passport and U.S. address proof in local client state.
- Local review screen, generated preview shells (Articles + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number.
- Supabase persistence: orders, llcs, members, registered_agents, ein_details, generated_forms, applicants.
- Document file upload to Supabase private storage (code complete, verification pending).
- `documents` table schema and storage bucket created in Supabase.
- `lib/supabase.ts`, `lib/persist-order.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- P6-T07 browser verification (pending — resume here next session).
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Complete browser verification for P6-T07:

1. `PATH=/usr/local/opt/node@22/bin:$PATH npm run dev`
2. Open `http://localhost:3000`, complete full intake with both files attached.
3. Confirm confirmation screen reached.
4. Verify `documents` table rows and files in Supabase storage bucket.
5. Update three docs after verification passes.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
