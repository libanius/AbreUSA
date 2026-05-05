# 09 Build Status

## Current Phase

Phase 3: Guided Intake Flow.

Phase 2 is complete. `P3-T07` is complete. The guided-flow shell now includes service selection, local LLC name validation, local business activity selection, local member count selection, local member data capture, and local business address capture without backend or persistence.

## Last Completed Task

Task ID: `P3-T07`

Title: Implement business address step shell.

Result:

- Business address step shell implemented after member data entry.
- Fields capture street address, city, state (locked to FL), and ZIP in local client state only.
- Continue is enabled when street, city, and ZIP are non-empty.
- Progress sidebar updated to include Endereço as step 6 of 9.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

## Current Task

None. P3-T07 is complete.

## Next Task

Task ID: `P3-T08`

Title: Implement Registered Agent step shell.

Status: Awaiting execution.

Scope:

- Add the next interactive step after business address entry.
- Present the three Registered Agent options: AbreUSA, self, or other.
- Capture the selection in local client state only.
- If "other" is selected, capture agent name and address locally.
- Keep data unpersisted.
- Keep Supabase, uploads, generated forms, and submission out of scope.

Acceptance criteria:

- User can move from business address to the Registered Agent step.
- User can select AbreUSA, self, or other as the Registered Agent.
- If "other" is selected, agent name and address fields appear locally.
- Existing steps remain intact.
- Existing static shell remains visually intact.
- No backend calls are introduced.
- No document upload or persistence is introduced.
- `npm run lint` passes.
- `npm run build` passes.

## Completed Tasks

- App Spine approved as official source of truth.
- Phase 1 Architecture Plan documented in `05-platform-strategy.md`.
- Phase 1 roadmap refinements documented in `07-roadmap.md`.
- Architecture decisions and open decisions recorded in `08-decisions-log.md`.
- Phase 1 Architecture Plan approved.
- MVP directions recorded for deferred/service/provider/payment/export/draft decisions.
- Static app shell implemented in the Next.js App Router.
- Progress header placeholder implemented.
- Main guided-flow container implemented.
- Reusable `StepCard` primitive implemented.
- Static step navigation primitive implemented.
- Static status/validation message primitive implemented.
- Static form field layout primitives implemented.
- Static review summary shell implemented.
- Static generated form preview shell implemented.
- Static confirmation shell implemented.
- Static protocol/status display shell implemented.
- Phase 2 shell composition reviewed and closed.
- Root metadata updated for AbreUSA.
- Root HTML language set to `pt-BR`.
- Geist/Tailwind font token issue corrected in `app/globals.css`.
- Verification completed: `npm run lint` passes.
- Verification completed: `npm run build` passes.
- Static stakeholder progress dashboard created at `/progress/index.html`.
- GitHub Pages root publishing support prepared with `.nojekyll`.
- GitHub Pages setup instructions documented in `05-platform-strategy.md`.
- `P3-T01` first intake implementation slice planned.
- `P3-T02` service selection and step-state shell implemented.
- `P3-T03` LLC name step shell and validation plan implemented.
- `P3-T04` business activity step shell implemented.
- `P3-T05` member count step shell implemented.
- `P3-T06` member data step shell implemented.
- `P3-T07` business address step shell implemented.

## What Is Implemented

- The app renders a static AbreUSA shell from `components/app-shell.tsx`.
- The home route uses the App Router page at `app/page.tsx`.
- The app uses a client component at `components/guided-intake-shell.tsx` for guided flow and progress state.
- The shell includes sticky header, brand mark, progress bar, main container, and side progress area.
- The guided-flow primitive layer: `StepCard`, `StepNavigation`, `StatusMessage`, `FieldGroup`, `FieldShell`, `ReviewSummary`, `FormPreviewShell`, `ConfirmationShell`, `ProtocolStatusShell`.
- Service selection (step 1) for Complete Package and Florida LLC paths.
- LLC name entry (step 2) with LLC suffix validation in local state.
- Business activity selection (step 3) with existing prototype categories and custom "Other" entry.
- Member count selection (step 4) for 1 to 10 members with Single/Multi-Member context.
- Member data entry (step 5) — name, address, and ownership percentage per member in local state; Continue enabled when ownership totals 100%.
- Business address entry (step 6) — street, city, state (FL, locked), ZIP in local state; Continue enabled when street, city, and ZIP are filled.
- Progress header and sidebar reflect step 6 of 9.
- No Supabase connection, document upload, or data persistence is implemented.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- Registered Agent step.
- EIN questions step.
- Branching for EIN-only and Registered Agent-only flows.
- Document upload and extraction.
- Review and generated form previews.
- Order submission workflow.
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P3-T08: Implement Registered Agent step shell`

Deliverable:

- Add step after business address entry.
- Present AbreUSA / self / other options.
- Capture selection (and agent details if "other") in local state.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after implementation.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but not connected; do not add backend work in the current Phase 3 slice.
- Document upload, extraction, generated forms, and submission workflow are later phases.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
