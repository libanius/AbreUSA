# 09 Build Status

## Current Phase

Phase 7: Production Hardening.

Phase 6 is complete. P7-T01 is complete. The next task is moving approved-order persistence behind a server-side security boundary.

## Last Completed Task

Task ID: `P7-T01`

Title: Production security hardening plan — Supabase RLS, storage access, retention, and reviewer model.

Result:

- Current Supabase access boundary audited.
- Production requirement set: browser must not directly insert sensitive order data or directly upload documents with the anon key.
- RLS and storage policy requirements documented.
- Signed URL approach documented for future internal document review.
- Document retention period and reviewer access model remain production blockers.
- First implementable Phase 7 security slice defined as P7-T02.
- No product code changed.

## Current Task

None. P7-T01 is complete.

## Next Task

Task ID: `P7-T02`

Title: Move approved-order persistence behind a server-side security boundary.

Status: Awaiting execution.

Scope:

- Create a server-only Supabase persistence path for approved orders and document uploads.
- Stop using the browser Supabase anon key for direct inserts into order tables.
- Stop using direct browser uploads to the `documents` private bucket.
- Keep the customer-facing flow unchanged.
- Keep admin UI, signed URL reviewer UI, automated email, payment, and agency submission out of scope.

Acceptance criteria:

- Browser code no longer inserts directly into order tables.
- Browser code no longer uploads directly to the `documents` bucket.
- Server-side persistence still creates the same approved order records and document rows.
- Existing Complete Package and Florida LLC submission flows still reach confirmation with a server-generated protocol.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification confirms an approved Complete Package order persists successfully with both required files attached.

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
- `lib/supabase.ts`, `lib/persist-order.ts`, `supabase/schema.sql`.
- `/progress/index.html` stakeholder dashboard.

## What Is NOT Implemented

- Automated email notification implementation.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- RLS policies on all Supabase tables and storage (required before production).
- Document retention period and reviewer access model (Phase 7 blockers).
- Signed URLs for internal document access (Phase 7).
- Server-side order persistence boundary (next task).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P7-T02: Move approved-order persistence behind a server-side security boundary`

Deliverable:

- Move approved-order persistence and document upload to a server-side path.
- Remove direct browser inserts into order tables.
- Remove direct browser uploads to the private `documents` bucket.
- Preserve existing customer-facing submission and confirmation behavior.
- Run lint, build, and browser verification.

## Blockers And Risks

- EIN-only and Registered Agent-only flows remain deferred.
- RLS must be configured on all tables and storage before production deployment.
- Document retention period and reviewer access model unresolved (Phase 7).
- Raw file URLs must never be exposed publicly; signed URLs required for reviewer access (Phase 7).
- Current browser Supabase anon-key write path is not production-ready; P7-T02 must move persistence server-side before RLS lockdown.
- Default PATH does not include Node/npm; use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
