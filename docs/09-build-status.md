# 09 Build Status

## Current Phase

Phase 5: Review And Generated Forms.

Phase 4 is complete. Exit criteria passed after browser verification (P4-T02V). Phase 5 planning is complete (P5-T01). The next step is the first Phase 5 implementation slice.

## Last Completed Task

Task ID: `P5-T01`

Title: Phase 5 planning — review and generated forms architecture.

Result:

- First Phase 5 implementation slice defined.
- Review screen data boundaries documented.
- Generated preview scope documented.
- Supabase, persistence, PDF/export, submission, protocol generation, payment, real AI extraction, EIN-only flow, and Registered Agent-only flow remain out of scope.
- No Phase 5 product code was changed.

## Current Task

None. P5-T01 planning is complete.

## Next Task

Task ID: `P5-T02`

Title: Implement local review screen and generated preview shells.

Status: Awaiting execution.

Scope:

- Add a review step after document collection.
- Map existing local intake and document state into customer-facing review sections.
- Show review sections for service, LLC, business activity, members, business address, Registered Agent, documents, and placeholder extraction fields.
- Show EIN review section only for Complete Package.
- Add generated HTML preview shell for Florida Articles of Organization.
- Add generated HTML preview shell for IRS Form SS-4 only when service includes EIN.
- Preserve local back navigation so the customer can return to the document step and prior intake steps.
- Keep previews clearly labeled as previews, not submitted filings.
- Use existing Phase 2 review and form-preview primitives where possible.
- Keep Supabase, persistence, PDF/export, submission, protocol generation, payment, real AI extraction, EIN-only flow, and Registered Agent-only flow out of scope.

Acceptance criteria:

- Complete Package path reaches review after document collection.
- Florida LLC path reaches review after document collection.
- Review screen shows all captured local data needed for customer review.
- EIN review and IRS SS-4 preview appear only for Complete Package.
- Florida Articles of Organization preview appears for Complete Package and Florida LLC.
- Customer can go back from review to document collection.
- Generated forms are labeled as previews only.
- No backend calls, persistence, PDF/export, submission, protocol generation, or payment are introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification covers Complete Package and Florida LLC paths through review.

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

- Phase 5: review and generated form previews.
- Phase 6: order submission workflow.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P5-T02: Implement local review screen and generated preview shells`

Deliverable:

- Add the local review step after document collection.
- Show customer-facing review sections from existing local state.
- Add Florida Articles of Organization and conditional IRS SS-4 HTML preview shells.
- Keep previews labeled as previews only.
- Run `npm run lint`, `npm run build`, and browser verification through review.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after implementation.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but deferred for the first Phase 4 implementation slice.
- Document retention and reviewer access rules remain unresolved before production storage.
- Default PATH in this shell does not include Node/npm; project commands run with `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
