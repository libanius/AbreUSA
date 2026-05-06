# 09 Build Status

## Current Phase

Phase 4: Document Collection.

Phase 3 is complete. Exit criteria passed (P3-T10). Phase 4 planning is complete (P4-T01). The next step is the first Phase 4 implementation slice.

## Last Completed Task

Task ID: `P4-T01`

Title: Phase 4 planning — document collection architecture.

Result:

- First Phase 4 implementation slice defined.
- Placeholder/manual extraction strategy confirmed for MVP.
- First upload scope set to local-only file references in client state.
- Supabase private storage deferred until secure storage, retention, and reviewer access decisions are ready to implement.
- Acceptance criteria added for the next implementation task.
- No Phase 4 product code was changed.

## Current Task

None. P4-T01 planning is complete.

## Next Task

Task ID: `P4-T02`

Title: Implement local document collection step shell.

Status: Awaiting execution.

Scope:

- Add document collection after EIN questions for Complete Package and after Registered Agent for Florida LLC.
- Capture passport and U.S. address proof as local file references only.
- Show upload status for each required document.
- Add placeholder extraction states and editable manual correction fields.
- Keep extracted data non-final until customer review.
- Do not introduce Supabase, real AI extraction, persistence, storage URLs, generated forms, submission, or payment.

Acceptance criteria:

- Complete Package path reaches document collection after EIN questions.
- Florida LLC path reaches document collection after Registered Agent.
- Customer can attach one passport file and one U.S. address proof file in local state.
- Continue is disabled until both required documents are attached.
- Each document shows a clear local upload status.
- Placeholder extraction review fields are visible and editable.
- Extracted fields are not treated as final without customer review.
- No backend calls are introduced.
- No document persistence or storage URLs are introduced.
- `npm run lint` passes.
- `npm run build` passes.

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

## What Is Implemented

- Full guided intake for Complete Package path (steps 1–8) in local client state:
  - Service selection.
  - LLC name entry with suffix validation.
  - Business activity selection with custom "Other" entry.
  - Member count selection (1–10) with Single/Multi-Member context.
  - Member data entry per member (name, address, ownership percentage); gated on 100% total.
  - Business address entry (street, city, state FL, ZIP); gated on required fields.
  - Registered Agent selection (AbreUSA, self, other); branching to EIN for Complete Package.
  - EIN questions (reason, entity type, responsible party name and passport, start date, fiscal month).
- Florida LLC path implemented through Registered Agent; gated at Registered Agent pending Phase 4.
- Progress header and sidebar reflect 11-step flow.
- All state resets correctly when user returns to service selection.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- Phase 4: document upload and extraction UI.
- Phase 5: review and generated form previews.
- Phase 6: order submission workflow.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P4-T02: Implement local document collection step shell`

Deliverable:

- Add the local document collection step for passport and U.S. address proof.
- Wire Complete Package and Florida LLC paths into document collection.
- Add editable placeholder extraction review fields.
- Keep uploads local-only with no backend or persistence.
- Run `npm run lint` and `npm run build`.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after implementation.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but deferred for the first Phase 4 implementation slice.
- Document retention and reviewer access rules remain unresolved before production storage.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
