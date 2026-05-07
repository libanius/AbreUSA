# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

Phase 5 is complete. P6-T03 is complete. The next step is P6-T04: Supabase client setup and order persistence implementation.

## Last Completed Task

Task ID: `P6-T03`

Title: Plan Supabase persistence boundary.

Result:

- P6-T03 is planning only. No Supabase implementation was introduced.
- Persistence boundary documented for approved orders covering six tables: orders, llcs, members, registered_agents, ein_details, generated_forms.
- Applicant email and phone explicitly blocked: not in the intake flow; product decision required before adding.
- Document file storage explicitly blocked: retention period and reviewer access model unresolved; private storage cannot be configured yet.
- `supabase/schema.sql` created with SQL for all six implementable tables and comments marking blocked tables.
- `.env.local.example` created with Supabase env var template.
- `docs/08-decisions-log.md` updated with the boundary decision.
- No TypeScript changes. No package installs. `npm run lint` and `npm run build` are unaffected.

## Current Task

None. P6-T03 is complete.

## Next Task

Task ID: `P6-T04`

Title: Set up Supabase client and wire order persistence on confirmation.

Status: Awaiting prerequisites from user.

Prerequisites (user must complete before task begins):

- Create a Supabase project at supabase.com.
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` (use `.env.local.example` as the template).
- Apply `supabase/schema.sql` in the Supabase SQL editor.

Scope:

- Install `@supabase/supabase-js`.
- Create `lib/supabase.ts` with the Supabase client.
- Create `lib/persist-order.ts` with an insert function for all six tables.
- Wire the persist call in `handleContinueToConfirmation` before `setActiveStep("confirmation")`.
- Verify with browser that a complete intake path creates rows in Supabase.
- Keep document file uploads, applicant contact fields, and real agency submission out of scope.

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- Browser verification shows order rows persisted in Supabase after confirmation.
- No document file storage, no RLS policies, no applicant contact fields introduced.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` updated.

## Completed Tasks

- App Spine approved as official source of truth.
- Phase 1 Architecture Plan documented and approved.
- Phase 2 shell and all UI primitives implemented and closed.
- Phase 3 complete: P3-T01 through P3-T10 all closed.
  - Service selection, LLC name validation, business activity, member count, member data, business address, Registered Agent, and EIN questions all implemented in local state.
  - Phase 3 exit criteria passed: all navigation, branching, and validation verified.
- Phase 4 planning complete: P4-T01 closed.
  - First document collection implementation slice defined.
  - Local-only upload scope and placeholder/manual extraction confirmed for P4-T02.
- Phase 4 implementation complete: P4-T02 closed after lint/build verification.
  - Document collection added for Complete Package and Florida LLC paths.
  - Local file capture and manual extraction review implemented.
- Phase 4 browser verification complete: P4-T02V closed.
  - Complete Package and Florida LLC paths verified through document collection.
  - File attachment gate and manual extraction field editability verified.
- Phase 5 planning complete: P5-T01 closed.
  - First review and generated preview implementation slice defined.
  - Review screen data boundaries and generated preview scope documented.
- Phase 5 implementation complete: P5-T02 closed.
  - Local review screen and generated preview shells implemented.
  - Complete Package and Florida LLC paths verified through review.
- Phase 5 approval gate complete: P5-T03 closed.
  - Complete Package and Florida LLC paths verified through approval gate.
- Phase 6 planning complete: P6-T01 closed.
  - Local submission confirmation slice, order payload boundary, protocol/status assumptions, and persistence decision documented.
- Phase 6 local confirmation complete: P6-T02 closed.
  - Complete Package and Florida LLC paths verified through confirmation/protocol shell.
  - Local order payload shell verified, including EIN payload only for Complete Package.
- Phase 6 persistence boundary documented: P6-T03 closed.
  - Minimum persistence boundary defined for six implementable tables.
  - Applicant contact and document file storage explicitly blocked pending decisions.
  - `supabase/schema.sql` and `.env.local.example` created.

## What Is Implemented

- Full guided intake for Complete Package path (steps 1–11) in local client state:
  - Service selection.
  - LLC name entry with suffix validation.
  - Business activity selection with custom "Other" entry.
  - Member count selection (1–10) with Single/Multi-Member context.
  - Member data entry per member (name, address, ownership percentage); gated on 100% total.
  - Business address entry (street, city, state FL, ZIP); gated on required fields.
  - Registered Agent selection (AbreUSA, self, other); branching to EIN for Complete Package.
  - EIN questions (reason, entity type, responsible party name and passport, start date, fiscal month).
- Document collection for passport and U.S. address proof in local client state.
- Editable placeholder/manual extraction review fields for passport and address proof targets.
- Local review screen from captured intake and document state.
- Florida Articles of Organization preview shell for Complete Package and Florida LLC.
- IRS Form SS-4 preview shell for Complete Package only.
- Local approval gate with explicit confirmation checkbox.
- Local confirmation/protocol shell after approval.
- Internal order payload object in client state for approved local orders.
- Florida LLC path implemented through review and local approval.
- Progress header and sidebar reflect 12-step flow.
- All state resets correctly when user returns to service selection.
- `/progress/index.html` available as stakeholder dashboard.
- `supabase/schema.sql` — SQL schema for orders, llcs, members, registered_agents, ein_details, and generated_forms tables.
- `.env.local.example` — Supabase env var template.

## What Is NOT Implemented

- Supabase project, credentials, or client setup.
- Supabase persistence for approved orders (P6-T04).
- Production protocol generation with collision resistance.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Document file storage (blocked: retention period and reviewer access decisions pending).
- Applicant email and phone in the intake flow (blocked: product decision pending).
- RLS policies (required before production deployment).
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

User prerequisites first:

1. Create a Supabase project at supabase.com.
2. Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Apply `supabase/schema.sql` in the Supabase SQL editor.

Then execute one task:

`P6-T04: Set up Supabase client and wire order persistence on confirmation`

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Document file storage is blocked: retention period and reviewer access model are unresolved.
- Applicant email and phone are not in the intake flow: decision required before adding.
- RLS policies must be configured before production deployment.
- P6-T04 cannot begin until the user creates a Supabase project and provides credentials.
- Default PATH in this shell does not include Node/npm; project commands run with `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
