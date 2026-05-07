# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

Phase 5 is complete. Exit criteria passed after browser verification through the local review, generated preview shells, and local approval gate. The next step is Phase 6 planning.

## Last Completed Task

Task ID: `P5-T03`

Title: Implement local approval gate shell.

Result:

- Non-submitting approval gate added after review.
- Approval requires an explicit customer confirmation checkbox before continue is enabled.
- Approval language states the order is not submitted to AbreUSA, Sunbiz, or IRS yet.
- Back navigation from approval returns to review.
- No backend calls, persistence, protocol generation, submission, or payment were introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package and Florida LLC paths through approval gate.

## Current Task

None. P5-T03 is complete.

## Next Task

Task ID: `P6-T01`

Title: Phase 6 planning — order submission workflow architecture.

Status: Awaiting execution.

Scope:

- Define the first Phase 6 implementation slice before writing submission code.
- Decide the local-to-persisted order payload boundary.
- Confirm protocol-number format and status lifecycle.
- Confirm whether Supabase persistence starts in this phase or remains deferred.
- Keep payment, real agency submission, and real email delivery out of scope unless the App Spine is updated.
- Add acceptance criteria before Phase 6 product code begins.

Acceptance criteria:

- First Phase 6 implementation slice is documented.
- Order payload boundaries are documented.
- Protocol and status lifecycle assumptions are documented.
- Persistence decision is documented.
- Out-of-scope items remain explicit.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated after planning.

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
- Florida LLC path implemented through review and local approval.
- Progress header and sidebar reflect 11-step flow.
- All state resets correctly when user returns to service selection.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- Phase 6: order submission workflow.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P6-T01: Phase 6 planning — order submission workflow architecture`

Deliverable:

- Define the first Phase 6 implementation slice.
- Document order payload boundaries, protocol/status assumptions, and persistence decision.
- Keep payment, real agency submission, and real email delivery explicitly out of scope unless confirmed.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after planning.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but deferred for the first Phase 4 implementation slice.
- Document retention and reviewer access rules remain unresolved before production storage.
- Default PATH in this shell does not include Node/npm; project commands run with `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
