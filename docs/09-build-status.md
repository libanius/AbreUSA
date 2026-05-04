# 09 Build Status

## Current Phase

Phase 3: Guided Intake Flow Planning.

Phase 2 is complete. The project is not yet implementing intake logic; it is ready to define the first Phase 3 implementation slice.

## Last Completed Task

Task ID: `P2-T04`

Title: Static confirmation/status shell and Phase 2 closure.

Result:

- Static confirmation shell implemented.
- Static protocol/status display shell implemented.
- Phase 2 shell composition reviewed and closed.
- Roadmap, build status, and progress dashboard updated.
- Verification completed: `npm run lint` passes.
- Verification completed: `npm run build` passes.

## Current Task

Task ID: `P3-T01`

Title: Plan the first Guided Intake Flow implementation slice.

Status: Not started.

Scope:

- Define the first Phase 3 implementation slice before coding.
- Recommended first slice: service selection and step-state shell for the Complete Package / Florida LLC path.
- Keep EIN-only and Registered Agent-only deferred.

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

## What Is Implemented

- The app renders a static AbreUSA shell from `components/app-shell.tsx`.
- The home route uses the App Router page at `app/page.tsx`.
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
- No business logic is implemented.
- No form handling is implemented.
- No Supabase connection is implemented.
- No document upload or data persistence is implemented.
- `/progress/index.html` is available as a standalone static dashboard for stakeholders.
- GitHub Pages can publish `/progress/` from the repository root after GitHub Pages is enabled in repository settings.

## What Is NOT Implemented

- Phase 3 guided intake flow.
- Service selection behavior.
- Step state.
- Customer questionnaire steps.
- Client-side validation.
- Phase 4 document collection.
- Phase 5 review and generated form previews.
- Phase 6 order submission workflow.
- Supabase schema/storage implementation.
- Real or placeholder document extraction UI states.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P3-T01: Plan the first Guided Intake Flow implementation slice`

Deliverable:

- Update `/docs/07-roadmap.md` with the exact first Phase 3 implementation task and acceptance criteria.
- Do not write product code until that slice is confirmed.

Recommended first implementation slice after planning:

- Service selection.
- Static-to-interactive step state shell.
- Complete Package / Florida LLC path only.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but not connected; do not add backend work in the first Phase 3 slice.
- Document upload, extraction, generated forms, and submission workflow are later phases.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
- The dev server previously started on `localhost:3001` because port `3000` was already in use.
