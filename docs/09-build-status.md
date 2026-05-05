# 09 Build Status

## Current Phase

Phase 3: Guided Intake Flow.

Phase 2 is complete. `P3-T08` is complete. The guided-flow shell now includes service selection, local LLC name validation, local business activity selection, local member count selection, local member data capture, local business address capture, and local Registered Agent selection without backend or persistence.

## Last Completed Task

Task ID: `P3-T08`

Title: Implement Registered Agent step shell.

Result:

- Registered Agent step shell implemented after business address entry.
- Three options: AbreUSA, self, or other.
- If "other" is selected, name, address, city, state (locked to FL), and ZIP fields appear locally.
- Continue is enabled when a valid selection is made and required "other" fields are filled.
- Progress sidebar updated to include Agente as step 7 of 10.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

## Current Task

None. P3-T08 is complete.

## Next Task

Task ID: `P3-T09`

Title: Implement EIN questions step shell.

Status: Awaiting execution.

Scope:

- Add the next interactive step after Registered Agent selection.
- Show EIN questions only when service includes EIN (Complete Package).
- Capture EIN/IRS SS-4 fields in local client state only: reason for applying, entity type, responsible party name and passport number, start date, and fiscal closing month.
- Keep data unpersisted.
- Keep Supabase, uploads, generated forms, and submission out of scope.

Acceptance criteria:

- User can move from Registered Agent to the EIN step when service is Complete Package.
- User can select reason for applying and entity type.
- User can enter responsible party name and passport number.
- User can enter start date and fiscal closing month.
- Existing steps remain intact.
- Existing static shell remains visually intact.
- No backend calls are introduced.
- No document upload or persistence is introduced.
- `npm run lint` passes.
- `npm run build` passes.

## Completed Tasks

- App Spine approved as official source of truth.
- Phase 1 Architecture Plan documented and approved.
- Phase 2 shell and all UI primitives implemented and closed.
- `P3-T01` first intake implementation slice planned.
- `P3-T02` service selection and step-state shell implemented.
- `P3-T03` LLC name step shell and validation plan implemented.
- `P3-T04` business activity step shell implemented.
- `P3-T05` member count step shell implemented.
- `P3-T06` member data step shell implemented.
- `P3-T07` business address step shell implemented.
- `P3-T08` Registered Agent step shell implemented.

## What Is Implemented

- Service selection (step 1): Complete Package and Florida LLC paths.
- LLC name entry (step 2): LLC suffix validation in local state.
- Business activity selection (step 3): existing prototype categories and custom "Other" entry.
- Member count selection (step 4): 1 to 10 members with Single/Multi-Member context.
- Member data entry (step 5): name, address, ownership percentage per member; Continue when ownership totals 100%.
- Business address entry (step 6): street, city, state (FL locked), ZIP; Continue when required fields filled.
- Registered Agent selection (step 7): AbreUSA, self, or other; "other" reveals name/address fields; Continue when selection complete.
- Progress header and sidebar reflect step 7 of 10.
- No Supabase, document upload, or data persistence is implemented.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- EIN questions step.
- Document upload and extraction.
- Review and generated form previews.
- Order submission workflow.
- Branching for EIN-only and Registered Agent-only flows.
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P3-T09: Implement EIN questions step shell`

Deliverable:

- Add step after Registered Agent selection (Complete Package path only).
- Capture reason for applying, entity type, responsible party name, passport number, start date, and fiscal closing month in local state.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after implementation.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but not connected; do not add backend work in the current Phase 3 slice.
- Document upload, extraction, generated forms, and submission workflow are later phases.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
