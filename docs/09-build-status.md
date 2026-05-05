# 09 Build Status

## Current Phase

Phase 3: Guided Intake Flow.

Phase 2 is complete. `P3-T03` is complete. The guided-flow shell now includes service selection and local LLC name validation without backend or persistence.

## Last Completed Task

Task ID: `P3-T03`

Title: Implement LLC name step shell and validation plan.

Result:

- LLC name step shell implemented after service selection.
- LLC name captured in local client state only.
- LLC-compatible suffix validation added in the UI.
- Review summary reflects selected service, Florida LLC context, local LLC name, and validation status.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

## Current Task

Task ID: `P3-T03`

Title: Implement LLC name step shell and validation plan.

Status: Complete.

Scope:

- Add the next interactive step after service selection.
- Capture LLC name in local client state only.
- Add LLC suffix validation in the UI.
- Keep data unpersisted.
- Keep Supabase, uploads, generated forms, and submission out of scope.

## Next Task

Task ID: `P3-T04`

Title: Implement business activity step shell.

Status: Awaiting confirmation.

Scope:

- Add the next interactive step after valid LLC name entry.
- Capture business activity in local client state only.
- Use existing business activity categories only if already documented or present in product evidence.
- Keep data unpersisted.
- Keep Supabase, uploads, generated forms, and submission out of scope.

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

## What Is Implemented

- The app renders a static AbreUSA shell from `components/app-shell.tsx`.
- The home route uses the App Router page at `app/page.tsx`.
- The app now uses a small client component at `components/guided-intake-shell.tsx` for service selection and progress state.
- The shell includes:
  - Sticky header.
  - Brand mark.
  - Static progress indicator placeholder.
  - Main container for future guided steps.
  - Side progress area for future step groups.
- The guided-flow primitive layer includes:
  - `StepCard`.
  - `StepNavigation`.
  - `StatusMessage`.
  - `FieldGroup`.
  - `FieldShell`.
  - `ReviewSummary`.
  - `FormPreviewShell`.
  - `ConfirmationShell`.
  - `ProtocolStatusShell`.
- The shell is structural only.
- Service selection behavior is implemented for the first Phase 3 slice.
- Progress updates when a supported service path is selected.
- LLC name entry is implemented in local client state.
- UI validates LLC-compatible suffixes before continuing to the next planned step.
- No form handling is implemented beyond service selection and LLC name validation.
- No Supabase connection is implemented.
- No document upload or data persistence is implemented.
- `/progress/index.html` is available as a standalone static dashboard for stakeholders.
- GitHub Pages can publish `/progress/` from the repository root after GitHub Pages is enabled in repository settings.

## What Is NOT Implemented

- Full Phase 3 guided intake flow.
- Customer questionnaire steps.
- Business activity step.
- Member count and member data steps.
- Address, Registered Agent, EIN, document, review, approval, and confirmation steps.
- Client-side validation beyond LLC name suffix validation.
- Phase 4 document collection.
- Phase 5 review and generated form previews.
- Phase 6 order submission workflow.
- Supabase schema/storage implementation.
- Real or placeholder document extraction UI states.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P3-T04: Implement business activity step shell`

Deliverable:

- Add the next interactive step after valid LLC name entry.
- Capture business activity in local client state only.
- Keep business activity choices constrained to documented/product-evidence categories.
- Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` after implementation.

Acceptance criteria:

- User can move from a valid LLC name state to the business activity step.
- User can select or enter a business activity locally.
- Existing service selection and LLC name validation remain intact.
- Existing static shell remains visually intact.
- No backend calls are introduced.
- No document upload or persistence is introduced.
- `npm run lint` passes.
- `npm run build` passes.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but not connected; do not add backend work in the first Phase 3 slice.
- Document upload, extraction, generated forms, and submission workflow are later phases.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
- The dev server previously started on `localhost:3001` because port `3000` was already in use.
