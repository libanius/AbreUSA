# 07 Roadmap

## Current Phase

Phase 6: Order Submission Workflow.

Phase 5 is complete. Phase 5 exit criteria passed after browser verification for the local review, generated preview shells, and approval gate. The next step is Phase 6 planning.

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

Status: Complete. Phase 4 exit criteria passed after browser verification (P4-T02V).

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
- `npm run dev -- --hostname 127.0.0.1 --port 3000` starts successfully when run with Homebrew Node 22 on PATH and localhost binding approval.
- Local HTTP verification returns `200 OK` for `/`.

Phase 4 verification task:

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

- Complete.
- Browser verification completed with installed headless Chrome and the Chrome DevTools Protocol.
- Complete Package path reaches document collection after EIN questions.
- Florida LLC path reaches document collection after Registered Agent.
- Attaching both required files enables the document step continuation gate.
- Manual extraction fields remain editable.
- No runtime or log errors were captured during the browser-flow verification.
- Phase 4 exit criteria met.

## Phase 4 Exit Status

Phase 4 is complete. Customers can attach the required passport and U.S. address proof documents in local client state. Placeholder/manual extraction fields remain editable and are not final without customer review.

## Phase 5: Review And Generated Forms

Status: Complete. P5-T03 is complete.

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
- Customer can explicitly confirm approval locally before Phase 6 submission work begins.

Next Phase 5 task:

- Task ID: `P5-T01`.
- Title: Phase 5 planning — review and generated forms architecture.
- Scope:
  - Define the first Phase 5 implementation slice before writing review or form-generation code.
  - Decide how the existing local intake and document state maps into the review screen.
  - Confirm which generated previews are included first: Florida Articles of Organization and IRS SS-4 when EIN is included.
  - Keep Supabase, persistence, PDF/export, submission, and payment out of scope unless the App Spine is updated.
  - Add acceptance criteria before Phase 5 product code begins.
- Acceptance criteria:
  - First Phase 5 implementation slice is documented.
  - Review screen data boundaries are documented.
  - Generated form preview scope is documented.
  - Out-of-scope items remain explicit.
  - `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated after planning.

P5-T01 status:

- Complete.
- First Phase 5 implementation slice defined below.
- Review screen data boundaries documented below.
- Generated preview scope documented below.
- No product code was changed in this planning task.

First Phase 5 implementation slice:

- Task ID: `P5-T02`.
- Title: Implement local review screen and generated preview shells.
- Scope:
  - Add a review step after document collection.
  - Map existing local intake and document state into customer-facing review sections.
  - Show review sections for service, LLC, business activity, members, business address, Registered Agent, documents, and placeholder extraction fields.
  - Show EIN review section only for Complete Package.
  - Add generated HTML preview shell for Florida Articles of Organization.
  - Add generated HTML preview shell for IRS Form SS-4 only when service includes EIN.
  - Preserve local back navigation so the customer can return to the document step and prior intake steps.
  - Keep previews clearly labeled as previews, not submitted filings.
  - Use existing Phase 2 review and form-preview primitives where possible.
- Out of scope:
  - Supabase persistence.
  - PDF/export.
  - Order submission.
  - Approval gate behavior beyond a non-submitting preview state.
  - Protocol number generation.
  - Payment.
  - Real AI extraction.
  - EIN-only flow.
  - Registered Agent-only flow.
- Acceptance criteria:
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

Review screen data boundaries:

- Include local values captured in Phase 3 and Phase 4 only.
- Include selected service and Florida LLC context.
- Include LLC legal name and business activity.
- Include member names, addresses, and ownership percentages.
- Include Florida principal office address.
- Include Registered Agent choice and entered agent detail when applicable.
- Include EIN/SS-4 fields only for Complete Package.
- Include document file names/status and editable placeholder extraction values.
- Do not show backend order status, protocol number, payment status, reviewer status, or storage paths in this slice.

Generated preview scope:

- Florida Articles of Organization preview:
  - Included for Complete Package and Florida LLC.
  - Uses local LLC name, principal office address, Registered Agent, and member/management context.
  - Remains an HTML preview only.
- IRS Form SS-4 preview:
  - Included only for Complete Package.
  - Uses local LLC name, responsible party, passport number, reason for applying, entity type, start date, and fiscal closing month.
  - Remains an HTML preview only.
- PDF/export, stored generated form records, and approval/submission are deferred.

P5-T02 status:

- Complete.
- Local review step added after document collection.
- Existing local intake and document state maps into customer-facing review sections.
- Review screen includes service, LLC, business activity, members, business address, Registered Agent, documents, and placeholder extraction fields.
- EIN review section appears only for Complete Package.
- Florida Articles of Organization HTML preview shell appears for Complete Package and Florida LLC.
- IRS Form SS-4 HTML preview shell appears only for Complete Package.
- Back navigation from review returns to document collection.
- Generated forms are labeled as previews only.
- No backend calls, persistence, PDF/export, submission, protocol generation, or payment were introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package and Florida LLC paths through review.

Next Phase 5 task:

- Task ID: `P5-T03`.
- Title: Implement local approval gate shell.
- Scope:
  - Add a non-submitting approval gate after review.
  - Require explicit customer confirmation that the reviewed data and generated previews are ready for AbreUSA review.
  - Keep approval local-only and clearly not submitted to AbreUSA, Sunbiz, or IRS.
  - Preserve back navigation from approval to review.
  - Keep protocol generation, order persistence, internal order payload, and submission workflow in Phase 6.
- Acceptance criteria:
  - Complete Package path reaches approval gate after review.
  - Florida LLC path reaches approval gate after review.
  - Approval gate requires an explicit confirmation checkbox or equivalent control before continue is enabled.
  - Approval language states the order is not submitted yet.
  - Customer can go back from approval to review.
  - No backend calls, persistence, protocol generation, submission, or payment are introduced.
  - `npm run lint` passes.
  - `npm run build` passes.
  - Browser verification covers Complete Package and Florida LLC paths through approval gate.

P5-T03 status:

- Complete.
- Non-submitting approval gate added after review.
- Approval requires an explicit customer confirmation checkbox before continue is enabled.
- Approval language states the order is not submitted to AbreUSA, Sunbiz, or IRS yet.
- Back navigation from approval returns to review.
- No backend calls, persistence, protocol generation, submission, or payment were introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package and Florida LLC paths through approval gate.

## Phase 5 Exit Status

Phase 5 is complete. Customers can review captured local intake/document data, inspect local generated preview shells, return to correct data, and explicitly confirm local approval. Official submission, protocol generation, persistence, and customer confirmation screen remain Phase 6 work.

## Phase 6: Order Submission Workflow

Status: Current phase. Awaiting Phase 6 planning.

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

Next Phase 6 task:

- Task ID: `P6-T01`.
- Title: Phase 6 planning — order submission workflow architecture.
- Scope:
  - Define the first Phase 6 implementation slice before writing submission code.
  - Decide the local-to-persisted order payload boundary.
  - Confirm protocol-number format and status lifecycle.
  - Confirm whether Supabase persistence starts in this phase or remains deferred.
  - Keep payment, real agency submission, and real email delivery out of scope unless the App Spine is updated.
  - Add acceptance criteria before Phase 6 product code begins.

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
