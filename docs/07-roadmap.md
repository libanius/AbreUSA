# 07 Roadmap

## Current Phase

Phase 4: Document Collection.

Phase 3 is complete. Phase 3 exit criteria passed (P3-T10). Phase 4 planning is complete (P4-T01). The next step is the first Phase 4 implementation slice.

## Phase 0: App Spine Confirmation

Status: Complete.

Goal: establish the product source of truth.

Deliverables:

- Product Vision.
- MVP Scope.
- Requirements.
- User Flows.
- Platform Strategy.
- Data Model.
- Roadmap.
- Decisions Log.
- Build Status.

Exit criteria:

- User confirms the App Spine.
- Any requested corrections are applied to `/docs`.
- Build Status moves from `Pre-Execution` to the next confirmed phase.

## Phase 1: Foundation Planning

Status: Complete.

Goal: define implementation architecture without building product behavior yet.

Deliverables:

- Confirm app architecture for Next.js 16 App Router.
- Confirm routing strategy.
- Confirm component structure.
- Confirm styling/design system boundaries.
- Confirm storage strategy for orders and documents.
- Confirm AI extraction provider or placeholder strategy.
- Confirm security and privacy requirements for sensitive documents.
- Document route strategy and unresolved routing decisions.
- Document state and data flow strategy.
- Document Supabase schema areas and storage responsibilities.
- Mark unresolved flow gaps as `Decision Needed`.

Exit criteria:

- Architecture plan is documented.
- No unresolved blocking assumptions remain.
- Build Status is updated after Phase 1 planning is accepted.
- Decisions Log records confirmed architecture decisions and open decisions.

Current Phase 1 status:

- Architecture plan drafted in `05-platform-strategy.md`.
- Phase 1 Architecture Plan approved.
- EIN-only flow deferred as Post-MVP or Decision Needed.
- Registered Agent-only flow deferred as Post-MVP or Decision Needed.
- AI extraction set to placeholder/manual strategy for MVP.
- Payment kept out of MVP.
- PDF/export deferred; HTML preview first.
- Draft persistence/resume deferred unless required later for MVP.
- Document retention and reviewer access remain Decision Needed before production.

## Phase 2: UI Shell And Design System

Status: Complete.

Goal: build the product shell and reusable UI primitives.

Deliverables:

- App layout.
- Progress header.
- Page container.
- Step navigation primitives.
- Form controls.
- Review display components.
- Form preview components.
- Status and confirmation components.

Exit criteria:

- Product shell renders.
- No business flow logic beyond routing/navigation scaffolding.
- Visual direction matches Product Vision.

Recommended first task:

- Build the static app shell and progress header structure, without implementing business flow logic.

Task status:

- Static app shell and progress header implemented.
- Main container for future guided steps implemented.
- Reusable `StepCard` primitive implemented.
- Static step navigation primitive implemented.
- Static status/validation message primitive implemented.
- Static form field layout primitives implemented.
- Static review summary shell implemented.
- Static generated form preview shell implemented.
- Static confirmation shell implemented.
- Static protocol/status display shell implemented.
- Business flow logic, forms, data handling, and Supabase integration not started.

Phase 2 status:

- Complete.
- Exit criteria met: product shell renders, structural primitives exist, and no business flow logic has been added.

Next task:

- Plan Phase 3 guided intake flow implementation before writing intake logic.

## Phase 3: Guided Intake Flow

Status: Complete. Phase 3 exit criteria passed (P3-T10).

Goal: implement the customer questionnaire.

Deliverables:

- Service selection.
- LLC name step.
- Business activity step.
- Member count and member data steps.
- Business address step.
- Registered Agent step.
- EIN questions step.
- Branching for LLC only, EIN only, complete package, and Registered Agent.
- Client-side validation.

Exit criteria:

- Full intake can be completed with test data.
- Branching rules match the User Flows document.

Current Phase 3 planning task:

- Task ID: `P3-T01`.
- Define the first implementation slice for the guided intake flow.
- Keep EIN-only and Registered Agent-only deferred.
- Start with the Complete Package / Florida LLC path only unless the App Spine is updated.
- Decide which static Phase 2 primitives become the first connected step components.
- Add acceptance criteria before writing product code.

P3-T01 status:

- Complete.
- First implementation slice defined below.

First Phase 3 implementation slice:

- Task ID: `P3-T02`.
- Title: Implement service selection and step-state shell.
- Scope:
  - Convert the static shell into a minimal client-side guided-flow shell.
  - Add service selection as the first interactive step.
  - Support only Complete Package / Florida LLC path for now.
  - Keep EIN-only and Registered Agent-only visible only if explicitly needed later; do not implement those branches in this slice.
  - Use existing Phase 2 primitives where possible.
- Out of scope:
  - Supabase.
  - Document upload.
  - AI extraction.
  - Generated forms.
  - Submission workflow.
  - Payment.
  - EIN-only flow.
  - Registered Agent-only flow.
- Acceptance criteria:
  - User can see the service selection step.
  - User can select Complete Package / Florida LLC path.
  - Step progress updates for the selected path.
  - Existing static shell remains visually intact.
  - No backend calls are introduced.
  - No document upload or persistence is introduced.
  - `npm run lint` passes.
  - `npm run build` passes.

P3-T02 status:

- Complete.
- Service selection step implemented.
- Minimal client-side step-state shell implemented.
- Complete Package / Florida LLC path supported for this slice.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

Next Phase 3 task:

- Task ID: `P3-T03`.
- Title: Implement LLC name step shell and validation plan.
- Scope:
  - Add the next interactive step after service selection.
  - Capture only local client state.
  - Add LLC suffix validation in the UI.
  - Keep data unpersisted.
  - Keep Supabase, uploads, generated forms, and submission out of scope.

P3-T03 status:

- Complete.
- LLC name step shell implemented after service selection.
- LLC name is captured in local client state only.
- UI validates LLC-compatible suffixes such as `LLC`, `L.L.C.`, and `Limited Liability Company`.
- Review summary reflects selected service, Florida LLC context, local LLC name, and validation status.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

Next Phase 3 task:

- Task ID: `P3-T04`.
- Title: Implement business activity step shell.
- Scope:
  - Add the next interactive step after valid LLC name entry.
  - Capture business activity in local client state only.
  - Use existing business activity categories only if already documented or present in product evidence.
  - Keep data unpersisted.
  - Keep Supabase, uploads, generated forms, and submission out of scope.

P3-T04 status:

- Complete.
- Business activity step shell implemented after valid LLC name entry.
- Business activity is captured in local client state only.
- Activity options use the existing product-evidence categories from the prototype.
- `Other` activity supports a local custom text entry.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

Next Phase 3 task:

- Task ID: `P3-T05`.
- Title: Implement member count step shell.
- Scope:
  - Add the next interactive step after business activity selection.
  - Capture member count in local client state only.
  - Support the documented prototype range of 1 to 10 members.
  - Show single-member vs multi-member context in the UI.
  - Keep data unpersisted.
  - Keep Supabase, uploads, generated forms, and submission out of scope.

P3-T05 status:

- Complete.
- Member count step shell implemented after business activity selection.
- Member count is captured in local client state only.
- UI supports the documented prototype range of 1 to 10 members.
- UI communicates Single-Member LLC vs Multi-Member LLC context.
- No member detail fields, backend, upload, persistence, generated form, submission, or payment behavior added.

P3-T06 status:

- Complete.
- Member data step shell implemented after member count selection.
- Number of rendered member sections matches the selected member count.
- Each member captures name, address, and ownership percentage in local client state only.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

P3-T07 status:

- Complete.
- Business address step shell implemented after member data entry.
- Fields capture street, city, state (locked to FL), and ZIP in local client state only.
- Continue is enabled when street, city, and ZIP are non-empty.
- Progress sidebar updated to include Endereço as step 6 of 9.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

P3-T08 status:

- Complete.
- Registered Agent step shell implemented after business address entry.
- Three options presented: AbreUSA, self, or other.
- If "other" is selected, name, address, city, state (locked to FL), and ZIP fields appear.
- Continue is enabled when a valid selection is made and "other" fields are filled if applicable.
- Progress sidebar updated to include Agente as step 7 of 10.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

P3-T09 status:

- Complete.
- EIN questions step shell implemented after Registered Agent selection.
- Step is only reachable when service is Complete Package.
- Captures in local state: reason for applying, entity type, responsible party name, responsible party passport number, start date, and fiscal closing month.
- Continue on the Registered Agent step now routes to EIN questions for Complete Package; Florida LLC path remains gated pending Phase 4.
- Progress sidebar updated to include EIN as step 8 of 11.
- No backend, upload, persistence, generated form, submission, or payment behavior added.

Phase 3 status:

- All intake steps for the Complete Package path are now implemented through EIN questions.
- Remaining Phase 3 deliverables: client-side validation pass, branching review for Florida LLC path, and exit-criteria test run with full test data.

P3-T10 status:

- Complete.
- Full walkthrough audit completed against the User Flows document.
- Three bugs found and fixed:
  - `handleResetService` now resets all state fields including llcName, businessAddress, registeredAgent, and einQuestions.
  - `handleChangeMemberCount` now resets all ownership percentages to an equal split when member count changes.
  - Multi-member status message updated to remove stale reference to member data as a future step.
- All back and continue navigation verified correct for Complete Package and Florida LLC paths.
- Florida LLC path correctly gated at Registered Agent step pending Phase 4.
- `npm run lint` passes. `npm run build` passes.
- Phase 3 exit criteria met.

## Phase 3 Exit Status

Phase 3 is complete. The Complete Package path can be fully walked through with test data from service selection through EIN questions. Branching rules match the User Flows document. All validation gates are correctly wired.

## Phase 4: Document Collection

Status: Current phase. Planning task (P4-T01) is complete. P4-T02 implementation and lint/build verification are complete. Browser verification remains blocked by local tooling/server access.

Goal: support document uploads and extraction review.

Deliverables:

- Passport upload UI.
- U.S. address proof upload UI.
- Extraction pending/success/error states.
- Manual correction fields.
- Secure upload/storage plan implemented if backend is included in this phase.

Exit criteria:

- Customer can attach required documents.
- Extracted data is never final without review.

P4-T01 status:

- Complete.
- First Phase 4 implementation slice defined below.
- Placeholder/manual extraction strategy confirmed for MVP.
- Upload scope for the first implementation slice is local-only file capture in client state.
- Supabase private storage is deferred until the secure storage, retention, and reviewer access decisions are ready to implement.
- No product code was changed in this planning task.

First Phase 4 implementation slice:

- Task ID: `P4-T02`.
- Title: Implement local document collection step shell.
- Scope:
  - Add document collection after EIN questions for Complete Package and after Registered Agent for Florida LLC.
  - Capture passport and U.S. address proof as local file references only.
  - Show upload status for each required document.
  - Add placeholder extraction states that can be reviewed manually by the customer.
  - Add manual correction fields for extracted passport and U.S. address proof targets listed in `06-data-model.md`.
  - Keep extracted data editable and clearly non-final until customer review.
  - Use existing Phase 2 primitives where possible.
- Out of scope:
  - Supabase storage.
  - Real AI extraction.
  - Persistent uploads.
  - Public or private document URLs.
  - Document retention rules.
  - Internal reviewer access.
  - Generated forms.
  - Order submission.
  - Payment.
  - EIN-only flow.
  - Registered Agent-only flow.
- Acceptance criteria:
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

P4-T02 status:

- Complete.
- Document collection step shell added after EIN questions for Complete Package.
- Florida LLC path now routes from Registered Agent to document collection.
- Passport and U.S. address proof are captured as local file metadata only.
- Each required document shows local pending/attached status.
- Placeholder/manual extraction review fields are visible and editable.
- Extracted fields remain customer-reviewable and are not submitted or persisted.
- No backend calls, Supabase storage, persistent uploads, document URLs, generated forms, submission, or payment were introduced.
- `npm run lint` passes when run with Homebrew Node 22 on PATH.
- `npm run build` passes when run with Homebrew Node 22 on PATH and network access for Next.js Google Font fetching.

Next Phase 4 task:

- Task ID: `P4-T02V`.
- Title: Browser-verify local document collection implementation.
- Scope:
  - Browser-check the Complete Package and Florida LLC paths through document collection after browser tooling and a reachable dev server are available.
  - Fix any issues found without expanding scope beyond P4-T02.
- Acceptance criteria:
  - Complete Package path reaches document collection after EIN questions.
  - Florida LLC path reaches document collection after Registered Agent.
  - Attaching both required files enables the document step continuation gate.
  - Manual extraction fields remain editable.
  - No browser console errors are introduced by the document collection step.

P4-T02V status:

- Blocked in the current shell.
- `agent-browser` is not available on PATH.
- `npx --no-install playwright --version` attempted to reach the npm registry and failed under restricted network, indicating Playwright is not locally installed.
- `npm run dev` starts only when run with escalated localhost binding, but the server did not accept HTTP requests from this environment.

## Phase 5: Review And Generated Forms

Goal: generate customer-facing previews from structured intake data.

Deliverables:

- Order review screen.
- Florida Articles of Organization preview.
- IRS SS-4 preview when applicable.
- Print/download-ready layout.
- Approval gate.

Exit criteria:

- Generated forms reflect intake data.
- Customer can go back and correct data before approval.

## Phase 6: Order Submission Workflow

Goal: convert approved intake into an internal AbreUSA order.

Deliverables:

- Protocol number.
- Order persistence.
- Internal order payload.
- Submission status.
- Confirmation screen.
- Email notification plan or implementation if confirmed.

Exit criteria:

- Approved order is saved and traceable.
- Customer sees a clear next step and timeline.

## Phase 7: Production Hardening

Goal: make the product safe to launch.

Deliverables:

- Security review for documents and PII.
- Validation and error states.
- Accessibility review.
- Mobile viewport verification.
- Performance pass.
- Legal/compliance copy review.
- Production environment configuration.

Exit criteria:

- Product is launch-ready for controlled users.

## Phase 8: Post-MVP Expansion

Potential additions:

- Payment processing.
- Customer dashboard.
- Admin review portal.
- Real AI OCR/document extraction.
- Email/SMS updates.
- Multi-state LLC formation.
- Operating Agreement generation.
- Bank account preparation checklist.
- Bilingual Portuguese/English UI.
