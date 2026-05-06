# 09 Build Status

## Current Phase

Phase 4: Document Collection.

Phase 3 is complete. Exit criteria passed (P3-T10). Phase 4 planning is complete (P4-T01). P4-T02 implementation is in place pending lint/build verification.

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

Task ID: `P4-T02`

Title: Implement local document collection step shell.

Status: Implementation in place, pending verification.

Current result:

- Document collection step shell added after EIN questions for Complete Package.
- Florida LLC path now routes from Registered Agent to document collection.
- Passport and U.S. address proof are captured as local file metadata only.
- Each required document shows local pending/attached status.
- Placeholder/manual extraction review fields are visible and editable.
- Extracted fields remain customer-reviewable and are not submitted or persisted.
- No backend calls, Supabase storage, persistent uploads, document URLs, generated forms, submission, or payment were introduced.
- Verification blocked because this shell does not have `node` or `npm` available on PATH.

## Next Task

Task ID: `P4-T02V`

Title: Verify local document collection implementation.

Status: Awaiting execution.

Scope:

- Run `npm run lint`.
- Run `npm run build`.
- Browser-check Complete Package and Florida LLC paths through document collection after a dev server is available.
- Fix any issues found without expanding scope beyond P4-T02.

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- Complete Package path reaches document collection after EIN questions.
- Florida LLC path reaches document collection after Registered Agent.
- Attaching both required files enables the document step continuation gate.
- Manual extraction fields remain editable.

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
- Phase 4 implementation started: P4-T02 implementation is in place pending verification.

## What Is Implemented

- Full guided intake for Complete Package path (steps 1–9) in local client state:
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
- Florida LLC path implemented through document collection.
- Progress header and sidebar reflect 11-step flow.
- All state resets correctly when user returns to service selection.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- P4-T02 lint/build/browser verification.
- Phase 5: review and generated form previews.
- Phase 6: order submission workflow.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P4-T02V: Verify local document collection implementation`

Deliverable:

- Run `npm run lint` and `npm run build`.
- Start the dev server when Node/npm are available.
- Browser-check the Complete Package and Florida LLC paths through document collection.
- Fix any scoped issues found.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after verification.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but deferred for the first Phase 4 implementation slice.
- Document retention and reviewer access rules remain unresolved before production storage.
- Current shell has no `node` or `npm` on PATH, blocking lint/build/dev-server verification.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
