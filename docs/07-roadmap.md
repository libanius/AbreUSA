# 07 Roadmap

## Current Phase

Phase 8: Post-MVP Expansion and strategic evolution.

Phases 1–7 are complete. P8-T01 through P8-T14 are complete. Controlled MVP launch is fully verified.

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

Status: Complete. Phase 6 exit criteria met with remaining production risks moved to Phase 7.

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

P6-T01 status:

- Complete.
- First Phase 6 implementation slice defined below.
- Order payload boundaries documented below.
- Protocol and status lifecycle assumptions documented below.
- Persistence decision documented below.
- Payment, real agency submission, and real email delivery remain out of scope unless the App Spine is updated.
- No product code was changed in this planning task.

First Phase 6 implementation slice:

- Task ID: `P6-T02`.
- Title: Implement local submission confirmation and internal order payload shell.
- Scope:
  - Add a non-submitting confirmation step after local approval.
  - Convert the approved local intake state into a structured internal order payload object in client state.
  - Generate and display a local protocol placeholder using the documented protocol format.
  - Show a customer-facing next-step timeline that says AbreUSA will review the order before any government submission.
  - Show local order status as `approved` or `internal_review` only; do not show `submitted` until a real submission workflow exists.
  - Keep Supabase persistence, private document storage, reviewer portal, real agency submission, email delivery, and payment out of this slice.
- Out of scope:
  - Supabase writes.
  - Database schema migrations.
  - Private file storage.
  - Internal admin/reviewer UI.
  - Email sending.
  - Sunbiz or IRS submission.
  - Payment.
  - Real protocol collision checks.
- Acceptance criteria:
  - Complete Package path can continue from approval to a confirmation/protocol shell after checkbox confirmation.
  - Florida LLC path can continue from approval to a confirmation/protocol shell after checkbox confirmation.
  - Confirmation screen displays a protocol placeholder, selected service, LLC name, and clear next-step timeline.
  - Internal order payload includes only reviewed local data from the active service path.
  - EIN payload fields appear only for Complete Package.
  - Confirmation language states AbreUSA must review before any government submission.
  - No backend calls, persistence, storage, real email, payment, or agency submission are introduced.
  - `npm run lint` passes.
  - `npm run build` passes.
  - Browser verification covers Complete Package and Florida LLC paths through confirmation.

P6-T02 status:

- Complete.
- Non-submitting confirmation step added after local approval.
- Approved local intake state converts into a structured internal order payload object in client state.
- Local protocol placeholder is generated with the `AUS-YYYY-XXXX` shell format.
- Confirmation screen shows selected service, LLC name, local approved status, protocol, and AbreUSA review timeline.
- EIN payload fields appear only for Complete Package.
- Confirmation language states AbreUSA must review before any government submission.
- No backend calls, persistence, storage, real email, payment, or agency submission were introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package and Florida LLC paths through confirmation.

Order payload boundaries:

- Include:
  - `order.serviceType` for `complete_llc_ein` or `florida_llc`.
  - `order.status` starting as `approved` locally, then moving to `internal_review` only when persistence/reviewer handoff is implemented.
  - `order.approvedAt` from the local approval action.
  - `llc` values from the captured LLC name, business activity, member count, principal Florida address, and management context.
  - `members` values from the captured member list.
  - `registeredAgent` values from the selected Registered Agent option.
  - `einDetails` only when the selected service is Complete Package.
  - `documents` metadata and reviewed extraction fields, not raw public file URLs.
  - `generatedForms` metadata for the local preview types shown to the customer.
- Exclude:
  - Payment status.
  - Public document URLs.
  - Reviewer assignment.
  - Government filing identifiers.
  - Sunbiz or IRS submission timestamps.
  - Email delivery status.
  - EIN-only or Registered Agent-only branch data.

Protocol and status lifecycle assumptions:

- Protocol format for the local shell: `AUS-YYYY-XXXX`.
- `YYYY` uses the current calendar year.
- `XXXX` is a local placeholder sequence for the shell only and is not collision-resistant.
- Production protocol generation must become deterministic and collision-resistant before persisted orders launch.
- Status lifecycle for Phase 6 planning:
  - `approved`: customer confirmed the reviewed data locally.
  - `internal_review`: AbreUSA has received or can review the internal order.
  - `submitted`: reserved for AbreUSA action after review and must not be set by the local customer flow.
  - `completed` and `blocked`: reserved for post-submission operational status.

Persistence decision:

- Supabase persistence remains planned for Phase 6 but does not start in `P6-T02`.
- `P6-T02` will establish the local order payload and confirmation shell first.
- Supabase writes should start only after the payload shape, document security boundaries, and required applicant contact fields are confirmed.
- Private document storage and reviewer access remain blocked by the existing document retention and access-control decisions.

P6-T03 status:

- Status: Complete.
- Decision: Planning only. Supabase implementation deferred to P6-T04.
- Persistence boundary for implementable tables documented.
- Applicant email/phone explicitly blocked: not in intake flow; decision required before adding.
- Document file storage explicitly blocked: retention period and reviewer access model unresolved.
- Deliverables: `supabase/schema.sql` and `.env.local.example` created.

P6-T04 status:

- Status: Complete.
- `@supabase/supabase-js` installed.
- `lib/supabase.ts` and `lib/persist-order.ts` created.
- Persistence call wired in `handleContinueToConfirmation`.
- `isPersisting` loading state added; approval button disabled during write.
- Browser verification passed: Complete Package flow persisted all six tables.
- RLS disabled on all tables for development; must be configured in Phase 7.
- `npm run lint` passes. `npm run build` passes.

P6-T05 status:

- Status: Complete.
- `order_protocol_seq` Postgres sequence created in Supabase.
- `orders.protocol_number` default set to server-generated `AUS-YYYY-NNNN`.
- Client-side protocol generation removed; `persist-order.ts` returns server value.
- Browser verification passed: `AUS-2026-0003` generated with no client input.
- `npm run lint` passes. `npm run build` passes.

P6-T06 status:

- Status: Complete.
- `applicant_contact` FlowStep added after service selection; 13-step flow.
- `applicantContact` state, step UI, and `ApplicantContactDraft` type added.
- `applicants` table created in Supabase; RLS disabled for development.
- `persist-order.ts` updated with applicant insert.
- Browser verification passed: `AUS-2026-0004` with applicant row confirmed.
- `npm run lint` passes. `npm run build` passes.

P6-T07 status:

- Status: Complete.
- `documents` private storage bucket created in Supabase with anon upload policy.
- `documents` table created in Supabase; RLS disabled for development.
- `documentFiles` state added to hold actual `File` objects separate from serializable metadata.
- `uploadAndRecordDocument` helper added to `persist-order.ts`: uploads to `documents/{orderId}/{type}.{ext}`, inserts row in `documents` table.
- `persistOrder` updated to accept optional `files` parameter.
- `npm run lint` passes. `npm run build` passes.
- Browser verification passed with Complete Package flow and both files attached.
- Supabase verification passed for `AUS-2026-0005`: `documents` table contains passport and U.S. address proof rows.
- Private bucket object verification passed by same-path upload conflict: `passport.pdf` and `us_address_proof.pdf` already exist under the persisted order ID.

Next Phase 6 task:

- Task ID: `P6-T08`.
- Title: Plan email notification and customer handoff.
- Scope:
  - Decide whether Phase 6 needs only an email notification plan or a first implementation.
  - Define the minimum customer notification contents after approved order persistence.
  - Define whether email sends from the app, Supabase, Vercel, or remains an AbreUSA manual operation for MVP.
  - Keep payment, direct agency submission, admin portal, RLS hardening, signed document URLs, and retention policy out of scope unless the App Spine is updated.
- Acceptance criteria:
  - Email notification decision is documented.
  - Customer handoff/timeline copy requirements are documented.
  - Any implementation slice is explicitly scoped before code changes.
  - `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated after the task.

P6-T08 status:

- Status: Complete.
- Decision: Planning only. Email sending implementation is deferred.
- MVP customer handoff will be handled by the confirmation screen plus AbreUSA manual follow-up using the persisted applicant contact data.
- No email provider, Vercel email integration, Supabase trigger, or transactional email implementation is added in Phase 6.
- Customer notification contents documented below.
- Customer handoff and timeline copy requirements documented below.
- Payment, direct agency submission, admin portal, RLS hardening, signed document URLs, and retention policy remain out of scope.

Email notification decision:

- Phase 6 does not implement automated email sending.
- Automated email remains deferred until a sender/provider is confirmed.
- Candidate future implementation paths:
  - Vercel/Resend transactional email from the app.
  - Supabase Edge Function triggered after order persistence.
  - Manual AbreUSA operational email outside the app for MVP.
- MVP default for now:
  - Store applicant contact data.
  - Show protocol and next-step timeline on the confirmation screen.
  - AbreUSA team follows up manually using the persisted applicant email/phone.

Customer notification contents:

- Protocol number.
- Selected service.
- LLC legal name.
- Confirmation that the order was received by AbreUSA for internal review.
- Clear statement that no government filing has been submitted yet.
- Expected next step: AbreUSA reviews data/documents and contacts the customer if anything is missing.
- Estimated initial response window: to be confirmed before production launch.
- Support/contact channel: to be confirmed before production launch.

Customer handoff and timeline copy requirements:

- Confirmation screen must remain the authoritative customer-facing handoff in the MVP.
- Copy must avoid implying Sunbiz or IRS submission has happened.
- Copy must say AbreUSA reviews the order first.
- Copy must say the customer should keep the protocol number for follow-up.
- Copy must not promise exact government processing timelines before legal/operational confirmation.

Next Phase 6 task:

- Task ID: `P6-T09`.
- Title: Phase 6 exit review and Phase 7 planning.
- Scope:
  - Review Phase 6 deliverables against exit criteria.
  - Decide whether the current MVP can move to Phase 7 hardening.
  - List remaining Phase 6 gaps, if any.
  - Define first Phase 7 hardening slice.
  - Keep new feature implementation out of scope.
- Acceptance criteria:
  - Phase 6 exit status is documented.
  - Phase 7 first task is documented.
  - Remaining risks/blockers are clearly listed.
  - `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated.

P6-T09 status:

- Status: Complete.
- Phase 6 deliverables reviewed against exit criteria.
- Decision: the MVP can move to Phase 7 production hardening.
- No remaining Phase 6 implementation blockers.
- Remaining production risks moved to Phase 7:
  - Supabase table RLS policies.
  - Supabase storage policies and signed URL access.
  - Document retention period and reviewer access model.
  - Legal/compliance copy review.
  - Accessibility, mobile viewport, validation, and performance hardening.
  - Production environment configuration.
- No product code was changed in this planning task.

## Phase 6 Exit Status

Phase 6 is complete. Approved orders are saved and traceable through Supabase persistence and server-generated protocol numbers. Customers see a confirmation screen with protocol number, selected service, LLC name, review status, and next-step handoff/timeline copy.

Implemented Phase 6 persistence and handoff surfaces include orders, LLCs, members, Registered Agent data, EIN details when applicable, generated form records, applicant contact data, document table rows, and private Supabase document uploads.

Automated email remains deferred. MVP handoff uses the confirmation screen plus persisted applicant contact data for manual AbreUSA follow-up.

Direct agency submission, payment, admin portal, EIN-only flow, and Registered Agent-only flow remain out of MVP or Post-MVP scope.

## Phase 7: Production Hardening

Status: Current phase. P7-T04 is complete. The next step is applying and verifying Supabase RLS/storage lockdown.

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

First Phase 7 task:

- Task ID: `P7-T01`.
- Title: Production security hardening plan — Supabase RLS, storage access, retention, and reviewer model.
- Scope:
  - Audit current Supabase tables, private storage bucket, disabled RLS state, and anon upload policy.
  - Define RLS policy requirements for customer/order data tables.
  - Define storage policy requirements for uploaded passport and U.S. address proof files.
  - Define signed URL strategy for internal document review access.
  - Define document retention policy and reviewer access model, or mark unresolved items as production blockers.
  - Keep new product features, payment, admin UI, agency submission, and email implementation out of scope.
- Acceptance criteria:
  - Supabase RLS and storage policy requirements are documented.
  - Signed URL approach is documented.
  - Document retention and reviewer access decisions are documented or explicitly marked as blockers.
  - First implementable Phase 7 security slice is defined.
  - `/docs/07-roadmap.md`, `/docs/09-build-status.md`, `/progress/index.html`, and `/docs/08-decisions-log.md` are updated if decisions changed.

P7-T01 status:

- Status: Complete.
- Current Supabase access boundary audited.
- Production RLS and storage policy requirements documented below.
- Signed URL approach documented below.
- Document retention and reviewer access remain production blockers until confirmed.
- First implementable Phase 7 security slice defined as `P7-T02`.
- No product code was changed in this planning task.

P7-T01 audit findings:

- Current app writes approved orders directly from the browser using `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Current app writes to `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, and `documents`.
- Current app uploads passport and U.S. address proof files directly from the browser to the private `documents` storage bucket.
- Current schema notes that RLS policies are not defined.
- Phase 6 verification used RLS disabled on development tables and an anon upload policy for the private bucket.
- This access model is acceptable for development verification only and is not production-ready.

Production security requirements:

- RLS must be enabled on all persisted order tables before production:
  - `orders`.
  - `applicants`.
  - `llcs`.
  - `members`.
  - `registered_agents`.
  - `ein_details`.
  - `generated_forms`.
  - `documents`.
- Direct public `select`, `update`, and `delete` must be denied for all customer/order tables.
- Direct public table `insert` must be removed before production; the browser must not write sensitive order data directly with the anon key.
- Approved order persistence should move behind a server-side boundary that validates the payload and uses server-held Supabase credentials.
- Order child records must only be written as part of the server-side approved-order persistence flow.
- Internal AbreUSA review access must use a separate authenticated reviewer model or a controlled server-only operational process; it must not depend on public anon access.

Storage policy requirements:

- The `documents` bucket must remain private.
- Raw storage paths and public URLs must never be exposed to customers or unauthenticated users.
- Direct public uploads to the `documents` bucket must be removed before production.
- Document upload should move behind the same server-side approved-order persistence boundary, or use short-lived scoped upload credentials if a later architecture explicitly requires direct browser upload.
- Document objects should remain path-scoped by persisted order ID.
- Document reads must be blocked by default and allowed only through controlled internal access.

Signed URL approach:

- Internal document access should use short-lived signed URLs generated server-side.
- Signed URLs should be generated only after reviewer authorization is confirmed.
- Signed URLs should be valid for minutes, not days.
- Signed URLs should not be stored in the database.
- The database should store only the private `storage_path`, document metadata, order ID, and audit-friendly timestamps.
- Customer-facing confirmation and status screens must not show signed URLs, raw paths, or bucket details.

Retention and reviewer access blockers:

- Document retention period is still Decision Needed before production.
- Required decision: whether passport and U.S. address proof files are deleted after AbreUSA review, after agency submission, after completion, or after a fixed retention window.
- Reviewer access model is still Decision Needed before production.
- Required decision: whether reviewers authenticate through Supabase Auth, a future admin portal, Vercel-protected internal routes, or a manual operational process outside the app.
- Until these decisions are made, production launch remains blocked even if RLS and storage policies are implemented.

First implementable Phase 7 security slice:

- Task ID: `P7-T02`.
- Title: Move approved-order persistence behind a server-side security boundary.
- Scope:
  - Create a server-only Supabase persistence path for approved orders and document uploads.
  - Stop using the browser Supabase anon key for direct inserts into order tables.
  - Stop using direct browser uploads to the `documents` private bucket.
  - Keep the customer-facing flow unchanged.
  - Keep admin UI, signed URL reviewer UI, automated email, payment, and agency submission out of scope.
- Acceptance criteria:
  - Browser code no longer inserts directly into order tables.
  - Browser code no longer uploads directly to the `documents` bucket.
  - Server-side persistence still creates the same approved order records and document rows.
  - Existing Complete Package and Florida LLC submission flows still reach confirmation with a server-generated protocol.
  - `npm run lint` passes.
  - `npm run build` passes.
  - Browser verification confirms an approved Complete Package order persists successfully with both required files attached.

P7-T02 status:

- Status: Complete.
- Added `/api/orders` route handler for approved-order persistence.
- Moved Supabase table inserts and private document uploads into server-side persistence helpers.
- Browser `persistOrder` now posts a multipart payload to `/api/orders` instead of importing the Supabase client.
- Removed the unused browser Supabase client file.
- Customer-facing flow remains unchanged.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package with both required files attached.
- Verification order: `AUS-2026-0006`.
- Supabase verification confirmed:
  - The order row exists.
  - `documents` table contains `passport` and `us_address_proof` rows.
  - Private storage objects exist at the expected order-scoped paths, confirmed by duplicate-upload conflicts.

Next Phase 7 task:

- Task ID: `P7-T03`.
- Title: Plan production Supabase service-role credentials and RLS/storage lockdown SQL.
- Scope:
  - Decide the production server credential requirement for Supabase writes.
  - Remove the development fallback to the anon key from the production plan.
  - Draft SQL for enabling RLS on all order tables.
  - Draft SQL for denying public table reads, updates, deletes, and direct inserts.
  - Draft storage policy changes that remove direct public uploads and block document reads by default.
  - Keep customer auth, reviewer UI, signed URL implementation, payment, email, and agency submission out of scope.
- Acceptance criteria:
  - Production Supabase credential requirement is documented.
  - RLS lockdown SQL plan is documented.
  - Storage lockdown SQL/policy plan is documented.
  - Remaining blockers for applying the policies are explicit.
  - `/docs/07-roadmap.md`, `/docs/09-build-status.md`, `/progress/index.html`, and `/docs/08-decisions-log.md` are updated if decisions changed.

P7-T03 status:

- Status: Complete.
- Production Supabase credential requirement documented below.
- RLS lockdown SQL plan documented below.
- Storage lockdown SQL/policy plan documented below.
- Blockers before applying production policies documented below.
- No product code was changed in this planning task.

Production Supabase credential requirement:

- Production writes must use a server-only Supabase credential.
- Required env var: `SUPABASE_SERVICE_ROLE_KEY`.
- Required env var: `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to browser code, committed to git, shown in customer UI, or prefixed with `NEXT_PUBLIC_`.
- The current development fallback from server code to `NEXT_PUBLIC_SUPABASE_ANON_KEY` is allowed only for local development verification before lockdown.
- Before production RLS/storage lockdown is applied, the server persistence path must fail closed if `SUPABASE_SERVICE_ROLE_KEY` is missing.

RLS lockdown SQL plan:

```sql
alter table public.orders enable row level security;
alter table public.applicants enable row level security;
alter table public.llcs enable row level security;
alter table public.members enable row level security;
alter table public.registered_agents enable row level security;
alter table public.ein_details enable row level security;
alter table public.generated_forms enable row level security;
alter table public.documents enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.applicants from anon, authenticated;
revoke all on public.llcs from anon, authenticated;
revoke all on public.members from anon, authenticated;
revoke all on public.registered_agents from anon, authenticated;
revoke all on public.ein_details from anon, authenticated;
revoke all on public.generated_forms from anon, authenticated;
revoke all on public.documents from anon, authenticated;
```

RLS policy direction:

- Do not add anon policies for order tables in the MVP.
- Do not add authenticated customer policies until customer auth exists.
- Server-side writes should use `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS for trusted server mutations.
- Internal reviewer reads remain blocked until reviewer authentication/access model is confirmed.

Storage lockdown SQL/policy plan:

```sql
-- Remove existing development upload/read policies on storage.objects for the documents bucket.
-- Exact policy names must be confirmed in Supabase before applying.
drop policy if exists "Allow anon document uploads" on storage.objects;
drop policy if exists "Allow document uploads" on storage.objects;
drop policy if exists "Allow document reads" on storage.objects;

-- Keep the documents bucket private.
update storage.buckets
set public = false
where id = 'documents';

-- Do not create anon upload/read policies for the documents bucket.
-- Server-side uploads use the service-role credential.
```

Storage policy direction:

- The `documents` bucket remains private.
- Browser direct uploads are not allowed in production.
- Browser direct reads are not allowed in production.
- Internal document access must be implemented later through server-generated signed URLs after reviewer authorization is defined.

Blockers before applying production lockdown:

- Confirm `SUPABASE_SERVICE_ROLE_KEY` is available in the production runtime environment.
- Remove the server-side development fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Confirm actual storage policy names in the Supabase project before running `drop policy`.
- Confirm whether existing development/test rows and files should remain in the production project before enabling lockdown.
- Document retention period remains Decision Needed before production launch.
- Reviewer access model remains Decision Needed before internal document access can be implemented.

Next Phase 7 task:

- Task ID: `P7-T04`.
- Title: Enforce production Supabase service-role credential and add lockdown SQL artifact.
- Scope:
  - Remove server-side fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Require `SUPABASE_SERVICE_ROLE_KEY` for server-side persistence.
  - Add a Supabase SQL artifact for RLS/table grants and storage lockdown.
  - Keep customer auth, reviewer UI, signed URL implementation, payment, email, and agency submission out of scope.
- Acceptance criteria:
  - Server persistence fails closed when `SUPABASE_SERVICE_ROLE_KEY` is missing.
  - Server persistence works when `SUPABASE_SERVICE_ROLE_KEY` is present.
  - Lockdown SQL artifact exists and covers all order tables and the `documents` bucket.
  - `npm run lint` passes.
  - `npm run build` passes.
  - Browser verification confirms an approved Complete Package order still persists through `/api/orders` when service-role credentials are configured.

P7-T04 status:

- Status: Complete.
- Server-side fallback to `NEXT_PUBLIC_SUPABASE_ANON_KEY` removed.
- Server-side persistence now requires `SUPABASE_SERVICE_ROLE_KEY`.
- Lockdown SQL artifact added at `supabase/rls-storage-lockdown.sql`.
- Lockdown SQL artifact covers:
  - RLS enablement for all order tables.
  - Revoking public table access from `anon` and `authenticated`.
  - Revoking public sequence access.
  - Removing known development storage policies.
  - Keeping the `documents` bucket private.
- `npm run lint` passes.
- `npm run build` passes.
- Fail-closed verification passed: `/api/orders` returns `500` when `SUPABASE_SERVICE_ROLE_KEY` is missing.
- Service-role endpoint verification passed: `/api/orders` returned `200` and generated `AUS-2026-0007`.
- Browser verification with real `SUPABASE_SERVICE_ROLE_KEY` passed for Complete Package with both required files attached.
- Final verification order: `AUS-2026-0008`.
- Supabase verification confirmed:
  - The order row exists.
  - `documents` table contains `passport` and `us_address_proof` rows.
  - Private storage objects exist at the expected order-scoped paths, confirmed by duplicate-upload conflicts.

P7-T05 completed 2026-05-07:

- Task ID: `P7-T05`.
- Title: Apply and verify Supabase RLS/storage lockdown.
- Status: Complete.
- Result:
  - Applied `supabase/rls-storage-lockdown.sql` in Supabase SQL Editor.
  - RLS enabled on all 8 order tables.
  - `revoke all` executed for `anon` and `authenticated` roles on all tables and sequence.
  - All development storage policies dropped.
  - `documents` storage bucket set to private.
  - Anon table access verified blocked: `ERROR 42501 permission denied for table orders`.
  - Storage bucket confirmed private in Supabase dashboard.
  - Server-side persistence via `/api/orders` confirmed working: returned `200` and generated `AUS-2026-0009`.
  - Browser Complete Package verification passed with `AUS-2026-0009`.
- Phase 7 is complete.

## Phase 8: Post-MVP Expansion

Current Phase 8 status:

- P8-T01 through P8-T14 complete.
- Controlled MVP launch fully verified on 2026-05-09.

### P8-T01: Applicant Email Confirmation — Integration Structure

Task ID: `P8-T01`.

Title: Prepare Resend email integration structure for applicant confirmation.

Status: Complete (2026-05-07). Email delivery verified live with AUS-2026-0010.

Scope:

- Install the `resend` npm package.
- Define `RESEND_API_KEY` environment variable (server-side only, never prefixed with `NEXT_PUBLIC_`).
- Create `lib/resend.ts`: Resend client, returns `null` if `RESEND_API_KEY` is not set.
- Create `lib/send-confirmation-email.ts`: fail-safe function that sends an order confirmation to the applicant email. Must catch all errors and never throw. Must skip silently if the Resend client is not configured.
- Update `/api/orders/route.ts`: call `sendConfirmationEmail` after successful order persistence, fire-and-forget (do not await in a way that blocks the response, and do not surface email errors to the caller).
- Temporary sender address: `contact@brightscalegroup.com`.
- Email content: protocol number, service name, next-steps message (AbreUSA will follow up).
- Do not require live `RESEND_API_KEY` to pass build or run the app.
- Document the environment variable in a `.env.example` file (or update the existing example file).

Out of scope:

- Live email delivery (requires Resend account and verified sender domain).
- Email templates with HTML styling.
- Email tracking, open rates, or unsubscribe links.
- Retry logic.
- Customer-facing email preferences.
- AbreUSA domain sender migration (Decision Needed — see decisions log).

Acceptance criteria:

- `npm run lint` passes.
- `npm run build` passes.
- App starts and complete order flow works without `RESEND_API_KEY` set.
- `lib/resend.ts` and `lib/send-confirmation-email.ts` exist with correct fail-safe structure.
- `/api/orders` calls `sendConfirmationEmail` after persistence and does not fail if email is skipped.
- Environment variable is documented.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated.

### P8-T02: Admin Review Portal

Task ID: `P8-T02`.

Title: Admin review portal with Supabase Auth, order list, order detail, document signed URLs, and status updates.

Status: Complete (2026-05-07).

Scope:

- Add Supabase Auth email/password login at `/admin/login`.
- Protect all `/admin` routes: redirect to `/admin/login` if no active session.
- `/admin` redirects to `/admin/orders`.
- `/admin/orders`: table of all orders — protocol number, service type, applicant name, applicant email, status, submitted date. Newest first.
- `/admin/orders/[id]`: full order detail — LLC info, members, registered agent, EIN details, applicant contact, document links.
- Document access via Supabase signed URLs (60-minute expiry). Each document: open in new tab, download button.
- Status dropdown on order detail. Admin updates status via server-side API route using SUPABASE_SERVICE_ROLE_KEY.
- All data reads/writes through server-side API routes using SUPABASE_SERVICE_ROLE_KEY. Supabase Auth session used only to verify identity.
- Admin user created manually in Supabase Auth dashboard.
- Styling consistent with existing app (Tailwind, shadcn).

Valid status values: draft, awaiting_documents, ready_for_review, customer_reviewing, approved, internal_review, submitted, completed, blocked.

Out of scope:

- Role-based access control.
- Admin user management UI.
- Pagination (low volume MVP).
- Email actions from admin.
- Audit log of status changes.

Acceptance criteria:

- Admin user created in Supabase Auth dashboard.
- `/admin/login` authenticates via Supabase Auth.
- Authenticated session redirects to `/admin/orders`.
- Unauthenticated `/admin` access redirects to `/admin/login`.
- `/admin/orders` lists all orders, newest first.
- `/admin/orders/[id]` shows full order data and document links.
- Signed URLs open documents in new browser tab.
- Download button downloads the document file.
- Status dropdown updates order status in database.
- Logout clears session, redirects to `/admin/login`.
- `npm run lint` passes.
- `npm run build` passes.
- Three docs updated.

### P8-T03: Strategic Evolution System Synchronization

Task ID: `P8-T03`.

Title: Synchronize App Spine with strategic evolution and onboarding architecture evolution.

Status: Complete (2026-05-08).

Scope:

- Add strategic evolution rules to `AGENTS.md`.
- Create `/docs/START-HERE.md` as the operating entry point.
- Add commands for strategic evolution analysis, App Spine synchronization, and Decision Gate review.
- Create `/docs/10-decision-gates.md`.
- Update roadmap, decisions log, build status, and progress page.
- Support future strategic product evolution, onboarding architecture evolution, conversational onboarding systems, AI-guided onboarding, progressive onboarding UX, state-based onboarding, and onboarding orchestration concepts.

Out of scope:

- Product feature code.
- Conversational onboarding UI.
- AI-guided onboarding implementation.
- State machine or workflow implementation.
- Draft persistence.
- Customer dashboard changes.

Acceptance criteria:

- `AGENTS.md` includes Strategic Evolution Rules.
- `START-HERE.md` explains that strategic conversations may require App Spine updates before coding.
- `COMMANDS.md` includes strategic evolution, App Spine sync, and Decision Gate review prompts.
- `10-decision-gates.md` exists and tracks unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.
- Roadmap supports onboarding orchestration evolution, conversational onboarding architecture, AI-guided onboarding layer, progressive onboarding systems, and state-based onboarding model.
- Build status reflects strategic evolution synchronization and conversational onboarding direction.

Result:

- Strategic evolution is now treated as an operational architecture layer before implementation.
- Major onboarding and AI direction changes must go through impact analysis, App Spine updates, Decision Gates, sequencing, and confirmation.
- No product feature code was changed.

## Strategic Onboarding Evolution Track

Status: Active planning track. No product feature code has started.

Purpose:

- Govern future onboarding changes before implementation.
- Keep strategic product evolution separate from feature execution.
- Make onboarding architecture decisions explicit before conversational, AI-guided, progressive, or state-based systems are built.

Supported evolution areas:

- Onboarding orchestration evolution.
- Conversational onboarding architecture.
- AI-guided onboarding layer.
- Progressive onboarding systems.
- State-based onboarding model.

Next non-code task:

- Task ID: `P8-T04`.
- Title: Onboarding architecture discovery and Decision Gate review.
- Scope:
  - Map the current 13-step guided intake to a candidate onboarding state model.
  - Identify where conversational onboarding could supplement or replace current guided steps.
  - Identify where AI guidance may be safe, useful, or risky.
  - Identify progressive onboarding and resume assumptions.
  - Review and update relevant Decision Gates.
  - Do not write product feature code.
- Acceptance criteria:
  - Current guided flow is mapped to candidate onboarding states.
  - Conversational onboarding options are documented.
  - AI-guided onboarding scope options and guardrails are documented.
  - Progressive onboarding and resume decisions are captured as gates.
  - Roadmap, build status, decisions log, Decision Gates, and progress page are updated.

P8-T04 status:

- Status: Complete (2026-05-08).
- Current guided 13-step intake mapped to candidate onboarding states in `/docs/04-user-flows.md`.
- Candidate onboarding state values documented in `/docs/06-data-model.md`.
- Platform-level onboarding orchestration strategy documented in `/docs/05-platform-strategy.md`.
- Conversational onboarding, AI-guided onboarding, progressive onboarding, state-based onboarding, and orchestration Decision Gates reviewed.
- DG-005 through DG-009 moved to `Proposed` with recommended direction.
- No product feature code was changed.

P8-T04 recommended architecture direction:

- Keep the current guided 13-step flow as the canonical baseline.
- Add state-based onboarding as a planning layer before conversational or AI-guided implementation.
- Start conversational onboarding as assistance around the guided flow, not as a replacement.
- Keep AI advisory, reviewable, and blocked from autonomous legal/tax advice or submission actions.
- Defer central workflow/orchestration code until progressive onboarding, customer resume, dashboard, or AI orchestration requires it.

Next non-code task:

- Task ID: `P8-T05`.
- Title: Resolve launch-blocking operational Decision Gates.
- Scope:
  - Decide document retention policy.
  - Decide AbreUSA sender domain migration timing.
  - Confirm production deployment environment, Vercel env vars, domain, and launch access model.
  - Keep product feature code out of scope.
- Acceptance criteria:
  - DG-001, DG-002, and DG-010 are resolved, deferred with reason, or explicitly marked as blockers.
  - Decisions log is updated for confirmed decisions.
  - Build status and progress page are updated.

P8-T05 status:

- Status: Complete (2026-05-08).
- DG-001 Document Retention Policy marked `Blocked`.
- DG-002 AbreUSA Sender Domain marked `Proposed`.
- DG-010 Production Deployment Environment marked `Blocked`.
- `.env.example` sender comment aligned with the current verified Resend sender.
- No product feature code was changed.

P8-T05 gate results:

- Document retention remains a production blocker because the app stores passport and U.S. address proof files. The project should not invent a retention period without owner/legal/operations confirmation.
- Current verified Resend sender can support development and controlled testing, but AbreUSA-branded sender migration should happen before broad public launch.
- Production deployment is blocked until Vercel project/domain, launch access model, and production environment variables are confirmed.

Next non-code task:

- Task ID: `P8-T06`.
- Title: Owner confirmation for launch gates.
- Scope:
  - Confirm document retention window and deletion trigger.
  - Confirm whether controlled production may temporarily use `noreply@notifications.brightscalegroup.com`.
  - Confirm production domain, Vercel project, required environment variables, and launch access model.
  - Do not write product feature code.
- Acceptance criteria:
  - DG-001, DG-002, and DG-010 can move from `Blocked` or `Proposed` to `Confirmed` or intentionally `Deferred`.
  - Decisions log records the confirmed launch decisions.
  - Build status and progress page are updated.

P8-T06 status:

- Status: Complete (2026-05-08).
- Initial Document Retention and Customer Data Lifecycle Policy introduced.
- `/docs/11-product-memory.md` created.
- DG-001 Document Retention Policy moved to `Confirmed`.
- DG-002 AbreUSA Sender Domain moved to `Confirmed` for temporary use of `noreply@notifications.brightscalegroup.com`.
- DG-010 Production Deployment Environment moved to `Proposed` for Vercel deployment using a temporary Vercel-provided URL if possible.
- New governance gates added for retention automation, deletion workflows, reviewer access scopes, audit logging, and future compliance framework needs.
- No product feature code was changed.

P8-T06 confirmed policy:

- Sensitive uploads: retain for 90 days after order completion or cancellation.
- Generated operational files: retain for 1 year.
- Customer operational metadata: long-term operational retention allowed.
- AbreUSA should not become a permanent storage vault for passports, IDs, proofs of address, or sensitive uploaded documents.
- Long-term value should come from customer relationship, onboarding intelligence, operational history, and business lifecycle memory.

Next governance task:

- Task ID: `P8-T07`.
- Title: Retention automation and deletion workflow architecture.
- Scope:
  - Define how the 90-day sensitive upload deletion policy will be enforced.
  - Decide whether deletion starts as manual admin SOP, Vercel Cron, Supabase scheduled job, or other scheduled workflow.
  - Define deletion audit requirements.
  - Define reviewer access scope requirements.
  - Keep product feature code out of scope until architecture is confirmed.
- Acceptance criteria:
  - DG-011, DG-012, DG-013, and DG-014 are reviewed.
  - Recommended first implementation slice is documented.
  - Roadmap, build status, Decision Gates, and progress page are updated.

P8-T07 status:

- Status: Complete (2026-05-08).
- DG-011 Document Retention Automation moved to `Proposed`.
- DG-012 Deletion Workflow And Responsibility moved to `Proposed`.
- DG-013 Reviewer Access Scopes moved to `Proposed`.
- DG-014 Audit Logging Scope moved to `Proposed`.
- `/docs/11-product-memory.md` updated with retention automation architecture, deletion audit model, and reviewer access scope.
- `/docs/05-platform-strategy.md` updated with retention automation architecture notes.
- No product feature code was changed.

P8-T07 recommended architecture:

- Use a two-step workflow before fully automatic deletion.
- First mark sensitive uploads as `eligible_for_deletion` after the 90-day window.
- Then delete eligible files with an audit record.
- Preserve customer operational metadata after sensitive file deletion.
- Use manual admin SOP for controlled launch if needed.
- Prefer Vercel Cron for future automated enforcement when deployment is on Vercel.
- Keep single authenticated admin role for MVP controlled launch; add granular reviewer scopes later only if operational needs require it.

Recommended first implementation slice:

- Task ID: `P8-T08`.
- Title: Retention metadata and audit-log implementation planning.
- Scope:
  - Define database fields/tables needed for retention eligibility and deletion audit records.
  - Define admin visibility for retention status.
  - Define whether the first implementation is manual-only or includes Vercel Cron.
  - Keep file deletion implementation out of scope until the plan is confirmed.
- Acceptance criteria:
  - Retention metadata model is documented.
  - Audit event model is documented.
  - First code implementation slice is scoped.
  - Roadmap, build status, Decision Gates, and progress page are updated.

P8-T08 status:

- Status: Complete (2026-05-08).
- Retention metadata fields documented in `/docs/06-data-model.md` and `/docs/11-product-memory.md`.
- Audit event model documented in `/docs/06-data-model.md`.
- DG-011 Document Retention Automation moved to `Confirmed`.
- DG-012 Deletion Workflow And Responsibility moved to `Confirmed`.
- DG-014 Audit Logging Scope moved to `Confirmed`.
- Physical file deletion remains out of scope until metadata and audit foundations exist.
- No product feature code was changed.

P8-T08 planned metadata:

- Add retention fields to document records: `retention_category`, `retention_eligible_at`, `retention_status`, `deletion_status`, `deleted_at`, `deleted_by`, `deletion_reason`, `deletion_audit_id`.
- Add operational `audit_events` records for retention eligibility, deletion attempts/results, and order status updates.
- Show retention status in the admin order detail before enabling actual deletion.

First code implementation slice:

- Task ID: `P8-T09`.
- Title: Implement retention metadata and audit event foundation.
- Scope:
  - Add database migration for document retention metadata.
  - Add `audit_events` table.
  - Update server/admin data reads to include retention status.
  - Show retention status in admin order detail.
  - Record audit event for admin order status updates if feasible in this slice.
  - Do not physically delete files.
  - Do not add Vercel Cron yet.
- Acceptance criteria:
  - Database schema supports retention eligibility and audit events.
  - Existing order persistence still works.
  - Admin order detail shows retention status for documents.
  - Status update audit event is recorded or explicitly deferred with reason.
  - `npm run lint` passes.
  - `npm run build` passes.
  - Browser verification covers admin order detail.

P8-T09 status:

- Status: Implementation complete with partial runtime verification. Authenticated admin verification remains pending.
- Added SQL artifact: `supabase/retention-audit-foundation.sql`.
- Added Supabase migration file: `supabase/migrations/20260508195000_retention_audit_foundation.sql`.
- Updated `supabase/schema.sql` with retention metadata and `audit_events`.
- Updated `supabase/rls-storage-lockdown.sql` to include `audit_events` lockdown.
- Updated server persistence to initialize document retention metadata.
- Updated admin order status API to write `audit_events` for status updates.
- Updated admin order status API to set document `retention_eligible_at` when an order moves to `completed` or `blocked`.
- Updated admin order detail to show retention category, eligibility date, retention status, and deletion status.
- `npm run lint` passes.
- `npm run build` passes.
- Supabase SQL artifact applied manually in Supabase SQL Editor.
- Remote Supabase check confirms `documents.retention_status`, `documents.retention_eligible_at`, `documents.deletion_status`, and `audit_events` exist.
- Dev server verification confirms unauthenticated `/admin/orders` redirects to `/admin/login`.
- Dev server verification confirms unauthenticated admin status PATCH returns `Unauthorized`.

Pending verification:

- Complete.
- Authenticated admin status update verified by user.
- Supabase verification confirmed `audit_events` row for order status update.
- Supabase verification confirmed both sensitive documents for the tested order received `retention_eligible_at`.
- Tested order ID: `3c34ff96-f0eb-4e86-bb5c-609268b188d4`.
- New status: `completed`.
- Retention eligible date: `2026-08-07T00:13:37.338Z`.

P8-T09V status:

- Status: Complete (2026-05-08).
- Admin status update wrote an `order_status_updated` event to `audit_events`.
- Audit metadata captured previous status `approved`, new status `completed`, retention update `scheduled`, and retention eligible date.
- Passport and U.S. address proof rows were updated with retention status `active`, deletion status `not_applicable`, and retention eligible date.
- No physical file deletion was performed.
- No Vercel Cron was added.

P8-T10 status:

- Status: Complete (2026-05-09).
- First physical deletion workflow is scoped as manual/admin-triggered, not scheduled.
- Vercel Cron remains deferred until manual deletion behavior, audit records, failure handling, and admin review are verified.
- DG-013 Reviewer Access Scopes moved to `Confirmed` for MVP controlled launch.
- DG-016 Physical Deletion Safeguards added and confirmed.
- DG-017 Automated Retention Cron added and deferred.
- `/docs/08-decisions-log.md`, `/docs/10-decision-gates.md`, `/docs/11-product-memory.md`, `/docs/09-build-status.md`, and `/progress/index.html` updated.
- No product feature code was changed.

P8-T10 deletion workflow plan:

- Delete only sensitive uploads eligible under the retention policy.
- Enforce `retention_eligible_at <= now()` server-side.
- Require authenticated admin confirmation before physical deletion.
- Create `document_deletion_attempted` before storage removal.
- On success, create `document_deleted` and update the document row with `retention_status = deleted`, `deletion_status = success`, `deleted_at`, `deleted_by`, `deletion_reason`, and `deletion_audit_id`.
- On failure, create `document_deletion_failed`, set `deletion_status = failed`, preserve the document record, and keep the item visible for operational follow-up.
- Preserve customer memory: applicant profile, service history, company metadata, protocol history, status timeline, and operational notes are not deleted by the sensitive upload cleanup workflow.
- Do not add broad bulk deletion without a reviewed preview/dry-run step.

Completed task:

- Task ID: `P8-T11`.
- Title: Manual retention deletion workflow foundation.
- Status: Complete.
- Result:
  - `/api/admin/documents/[id]` DELETE route with full server-side eligibility checks.
  - `document_deletion_attempted` audit event created before storage removal.
  - `document_deleted` or `document_deletion_failed` audit event on outcome.
  - Document metadata updated on success.
  - Admin UI delete button with two-step confirmation added.
  - Build passes. TypeScript clean.

P8-T12 status:

- Status: Complete (2026-05-09).
- Decision: The next MVP-readiness task should be production deployment readiness, not Vercel Cron, sender-domain migration, or expanded audit logging.
- Rationale:
  - The core guided intake, persistence, admin review, email confirmation, security lockdown, retention metadata, audit foundation, and manual deletion workflow are already implemented.
  - DG-017 keeps automated retention Cron deferred until manual deletion is verified in production.
  - AbreUSA-branded sender migration is important for long-term production polish but the temporary verified sender is already confirmed for controlled deployment.
  - Additional audit events are useful but not the primary blocker to putting the MVP in front of controlled users.
  - DG-010 was the main blocker before P8-T13 because Vercel environment variables, project link, and launch access model were not confirmed yet.
- No product feature code was changed.

P8-T12 deployment readiness plan:

- Required environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `SUPABASE_SERVICE_ROLE_KEY`.
  - `RESEND_API_KEY`.
- Required platform confirmations:
  - Vercel project is linked to the repository.
  - Vercel environment variables are configured for the target environment.
  - `SUPABASE_SERVICE_ROLE_KEY` is server-side only and never exposed with a `NEXT_PUBLIC_` prefix.
  - Initial launch access model is confirmed: internal-only, protected preview, controlled users, or public production.
  - Temporary Vercel-provided URL remains acceptable for the first controlled deployment if a custom domain is not ready.
- Required verification after deployment:
  - Customer Complete Package path can submit an order.
  - Supabase order, applicant, LLC, member, registered agent, EIN, generated form, and document rows are created.
  - Private document files are uploaded.
  - Confirmation email is sent or safely skipped if intentionally unconfigured.
  - Admin login works.
  - Admin order list and detail load.
  - Admin signed document links work.
  - Admin status update writes an audit event.
  - Manual deletion button remains hidden unless a document is retention-eligible.
- Out of scope:
  - Vercel Cron retention automation.
  - AbreUSA-branded sender-domain migration.
  - Payment.
  - Customer dashboard.
  - Expanded audit event types beyond what already exists.
  - EIN-only and Registered Agent-only dedicated flows.

Next operational task:

- Task ID: `P8-T13`.
- Title: Configure Vercel production environment and perform controlled deployment verification.
- Scope:
  - Link or confirm the Vercel project.
  - Configure required Vercel environment variables.
  - Deploy to Vercel.
  - Verify the deployed customer and admin flows end to end.
  - Record the deployed URL and verification result in `/docs/09-build-status.md` and `/progress/index.html`.
- Acceptance criteria:
  - Vercel deployment succeeds.
  - Deployed customer order flow persists a real test order with documents.
  - Confirmation email behavior is verified.
  - Admin login, order detail, signed document access, status update, and audit event creation are verified.
  - No server-side secret is exposed to the browser.
  - Build status and progress page are updated with the deployment URL and verification notes.

P8-T13 status:

- Status: Complete.
- Vercel project linked/created: `abre-usa-s-projects/abre-usa`.
- Production URL: `https://abre-usa.vercel.app`.
- Production environment variables configured:
  - `NEXT_PUBLIC_SUPABASE_URL`.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - `SUPABASE_SERVICE_ROLE_KEY`.
  - `RESEND_API_KEY`.
- Vercel production build and deployment succeeded.
- HTTP verification passed:
  - `/` returns `200`.
  - `/admin/login` returns `200`.
  - `/admin/orders` redirects unauthenticated users to `/admin/login`.
- Deployed Complete Package browser verification passed:
  - Test protocol: `AUS-2026-0011`.
  - Order ID: `44885adc-ebec-42b3-9365-f582b14f4144`.
  - Supabase order and document records created.
  - Private storage files created: `passport.pdf` and `us_address_proof.pdf`.
- Vercel production error log query after verification returned no error logs.
- Production confirmation email path produced no visible Vercel error logs, but inbox receipt was not verified in this session.

P8-T13V status:

- Status: Complete.
- Initial authenticated admin verification exposed a real production issue: `/admin/orders` and `/admin/orders/[id]` were cacheable/prerendered and could show stale data.
- Fix implemented:
  - Added `export const dynamic = "force-dynamic";` to `app/admin/orders/page.tsx`.
  - Added `export const dynamic = "force-dynamic";` to `app/admin/orders/[id]/page.tsx`.
- `npm run lint` passed.
- `npm run build` passed and confirmed both admin pages are dynamic.
- Production redeploy succeeded at `https://abre-usa.vercel.app`.
- Authenticated admin verification passed using a temporary Supabase Auth admin user that was deleted after verification.
- Verification results:
  - Admin login succeeded in production.
  - Production order list includes `AUS-2026-0011`.
  - Production order detail loads for order `44885adc-ebec-42b3-9365-f582b14f4144`.
  - Signed document open/download links were generated and reachable.
  - Status update from `approved` to `internal_review` succeeded.
  - Audit event created: `55b19546-f7ed-4a1b-99e1-5373cb9577ca`.
  - Delete button remained hidden because the documents are not retention-eligible.
  - Temporary admin verification user cleanup confirmed; no `admin-verify` users remain in Supabase Auth.
- Vercel production error log query after admin verification returned no error logs.

Next operational task:

- Task ID: `P8-T14`.
- Title: Confirm remaining launch operations.
- Scope:
  - Confirm production email receipt for `AUS-2026-0011` or run a new email receipt test.
  - Confirm permanent admin user ownership and password access.
  - Decide whether controlled launch stays on `https://abre-usa.vercel.app` or moves to a custom domain.
  - Decide whether to continue with the temporary sender or start AbreUSA-branded sender migration.
- Acceptance criteria:
  - Email receipt status is known and documented.
  - Permanent admin account access is confirmed.
  - Domain decision is documented.
  - Sender-domain decision is documented.
  - Build status and progress page are updated.

P8-T14 status:

- Status: Complete (2026-05-09).
- Root cause identified: `void sendConfirmationEmail()` in `app/api/orders/route.ts` caused silent email failures — Vercel terminated the serverless function before the Resend API call completed.
- Fix applied: replaced `void` with `await`. Build passed. Redeployed to production.
- New test order submitted: `AUS-2026-0014` (order ID `df140edf-bc35-4f91-a3ae-de5e3e6cf89c`).
- Production confirmation email received at `brightscalegroup@gmail.com`. Receipt confirmed by owner/operator.
- Permanent admin access via `contact@brightscalegroup.com` confirmed.
- Controlled launch on `https://abre-usa.vercel.app` confirmed.
- Temporary sender `noreply@notifications.brightscalegroup.com` confirmed for controlled launch.
- All acceptance criteria met. P8-T14 closed.

## Phase 8.5: Onboarding UX Cleanup

Status: Complete.

Purpose:

Improve the current onboarding experience before payment, customer dashboard, OCR, or full conversational AI.

Scope:

- Remove inline Articles of Organization friction from the main question path.
- Add auto-advance for choice/card questions.
- Keep Continue only for input, upload, and review/confirmation steps.
- Add sticky footer/navigation behavior by step type.
- Move document previews to review, accordion, modal, or a hidden-by-default detail area.
- Preserve Supabase persistence, document upload, and admin review.

Current Phase 8.5 task:

- Task ID: `P8.5-T01`.
- Title: Implement guided concierge onboarding cleanup.
- Scope:
  - Auto-advance simple predefined option/card selections.
  - Keep explicit Continue for typed input, uploads, mixed input choices, review, approval, and submission confirmation.
  - Replace inline Articles of Organization previews in the active onboarding path with a short educational card and hidden-by-default details.
  - Keep full generated preview content in the review stage.
  - Make the bottom step navigation sticky so users do not need to scroll to continue.
  - Preserve existing Supabase persistence, private document upload, confirmation email, and admin review behavior.
- Out of scope:
  - Payment.
  - Real AI OCR.
  - Customer dashboard.
  - Multi-state orchestration.
  - Full conversational AI.
  - Business model changes.
  - Removing existing Supabase persistence, document upload, or admin review.
- Acceptance criteria:
  - Option/card-based answers advance automatically after click.
  - Text input steps still require Continue.
  - Upload steps still require Continue.
  - Final review and approval still require explicit confirmation.
  - Articles of Organization full content is no longer inline between a question and Continue.
  - Continue button is not required for simple choice steps.
  - Sticky navigation/footer works appropriately based on step type.
  - Existing data persistence and order submission behavior remain working.
  - No regression to Supabase order persistence.
  - No regression to document upload.
  - No regression to admin order review.
  - Build status and progress page are updated.

P8.5-T01 status:

- Status: Complete.
- Simple predefined option/card selections now auto-advance:
  - Service selection advances to applicant contact.
  - Business activity selections advance to member count, except `Other`, which keeps Continue for custom text.
  - Registered Agent selections advance to EIN questions or documents, except `other`, which keeps Continue for agent details.
- Text input, upload, review, approval, and protocol-generation steps keep explicit Continue/Confirm behavior.
- Bottom step navigation is sticky and includes the current step progress indicator.
- Inline Articles of Organization previews were removed from active question steps and replaced with a short educational card plus hidden-by-default example details.
- Full Florida Articles and IRS SS-4 previews remain in the review stage.
- Supabase persistence, document upload, confirmation email, and admin review paths were not removed or structurally changed.
- `npm run lint` passes.
- `npm run build` passes after clearing the interrupted `.next` cache.
- Browser verification passed for auto-advance on service, business activity, and Registered Agent selection, and confirmed sticky navigation is present.
- Server-side persistence and document upload regression check passed through `/api/orders` with test protocol `AUS-2026-0015`.

## Phase 8.5 Follow-up: Address Reuse UX

Status: Complete.

Task ID: `P8.5-T02`.

Title: Add same-as-residential checkbox to company address flow.

Scope:

- Capture applicant/residential address during the applicant/contact step.
- Add a checkbox to the LLC/company principal address step: `Usar o mesmo endereço residencial informado anteriormente`.
- When checked, use the applicant/residential address as the LLC principal address and persist a boolean relationship flag.
- When unchecked, preserve and use the separately entered LLC/company principal address.
- Show the address relationship in final review.
- Show applicant residential address, LLC principal address, and address relationship in admin order detail.
- Preserve existing Supabase persistence, document upload, and admin review behavior.

Out of scope:

- Payment.
- Customer dashboard.
- Sunbiz name availability checking.
- Real AI OCR.
- Multi-state orchestration.
- Registered Agent logic changes unless required by data structure.

Acceptance criteria:

- LLC/company address step includes a checkbox to use the residential/applicant address.
- Checking the box uses the residential address in the company address payload.
- Unchecking the box allows a separate company address.
- Final review shows the correct address behavior.
- Admin view shows the address relationship clearly.
- Existing order submission still works.
- Supabase persistence is not broken.
- Docs are updated.

P8.5-T02 status:

- Status: Complete.
- Applicant/contact step now captures residential street, city, state, and ZIP.
- LLC/company principal address step includes the checkbox `Usar o mesmo endereço residencial informado anteriormente`.
- When checked, the final LLC principal address payload uses the applicant residential address.
- When unchecked, the user can enter and preserve a separate LLC/company principal address.
- Final review shows whether the company address is the same as the residential address or a separate address.
- Admin order detail shows applicant residential address, LLC principal address, and the address relationship.
- Supabase schema and migration now include applicant residential address fields and `llcs.principal_same_as_applicant_address`.
- Remote Supabase migration applied with `npx supabase db push`.
- `npm run lint` passes.
- `npm run build` passes.
- Server-side `/api/orders` persistence and document upload verification passed with test protocol `AUS-2026-0016`.
- Supabase verification confirmed:
  - Applicant residential address persisted.
  - LLC principal address copied from applicant residential address.
  - `principal_same_as_applicant_address = true`.
  - Two document records persisted.

## Phase 8.5 Deployment

Status: Complete.

Task ID: `P8.5-T03`.

Title: Deploy Phase 8.5 onboarding UX cleanup to production.

Scope:

- Deploy the committed Phase 8.5 changes to Vercel production.
- Verify the production alias points to the new deployment.
- Run production health checks for the customer app and admin login.
- Confirm unauthenticated admin orders still redirect to login.
- Preserve controlled launch URL.

P8.5-T03 status:

- Status: Complete.
- Local `npm run build` passed before deploy.
- Vercel production deploy completed successfully.
- Deployment ID: `dpl_FKGnAAzFvdhVNkeazTgXxugx7HsQ`.
- Production deployment URL: `https://abre-ha3hf131u-abre-usa-s-projects.vercel.app`.
- Production alias updated: `https://abre-usa.vercel.app`.
- Production health checks passed:
  - `/` returns `200`.
  - `/admin/login` returns `200`.
  - `/admin/orders` redirects unauthenticated users to `/admin/login`.
- `npx vercel inspect https://abre-usa.vercel.app` reports the deployment is `Ready`.

## Phase 8.5 Documentation Alignment Deploy

Status: Complete.

Task ID: `P8.5-T04`.

Title: Redeploy committed Phase 8.5 state to production.

Scope:

- Confirm the worktree is clean and the Phase 8.5 deploy documentation commit exists.
- Redeploy the current HEAD to Vercel production so the production deployment aligns with the committed repository state.
- Verify customer app and admin entry points after redeploy.

P8.5-T04 status:

- Status: Complete.
- Current HEAD before redeploy: `fd119631c295d3ba5d35f31283d1108a5bba7706`.
- Local `npm run build` passed.
- Vercel production redeploy completed successfully.
- Deployment ID: `dpl_49uw5re5UDZQnVBDPJPPwqDufjSn`.
- Production deployment URL: `https://abre-49oizmwkg-abre-usa-s-projects.vercel.app`.
- Production alias remains `https://abre-usa.vercel.app`.
- Production health checks passed:
  - `/` returns `200`.
  - `/admin/login` returns `200`.
  - `/admin/orders` redirects unauthenticated users to `/admin/login`.
- `npx vercel inspect https://abre-usa.vercel.app` reports the deployment is `Ready`.

## Phase 9: AI-Ready Onboarding Foundation

Status: Complete locally.

Source of truth:

- GitHub issue #2: Phase 9 — AI-Ready Onboarding Foundation.

Purpose:

Prepare AbreUSA for future AI-assisted document extraction and conversational onboarding while keeping the current product deterministic, safe, and MVP-friendly.

Scope:

- Update the App Spine first.
- Add a post-diagnosis onboarding choice after service selection:
  - `Enviar documentos para facilitar o preenchimento`.
  - `Preencher manualmente`.
- Preserve anonymous initial onboarding; do not require login at the beginning.
- Document-assisted path:
  - Uses existing document upload infrastructure.
  - Stores documents securely using the existing approach.
  - Prepares UI/data model for future extraction review.
  - Does not claim OCR is currently active.
- Manual path:
  - Continues through the existing manual flow.
  - Preserves Phase 8.5 UX behavior.
- Prepare data model support for:
  - `onboarding_entry_mode`.
  - `document_extraction_status`.
  - `extracted_applicant_data`.
  - `extracted_address_data`.
  - `extraction_confidence`.
  - `user_confirmed_extracted_data`.
  - `agent_summary`.
  - `missing_information_flags`.
- Prepare an editable review concept for future extracted data.

Out of scope:

- Real AI OCR.
- OpenAI API calls.
- Passport parsing.
- Proof-of-residence parsing.
- Autonomous AI decision-making.
- Payment.
- Customer dashboard.
- Sunbiz availability check.
- Multi-state orchestration.
- Custom production domain.
- Branded sender domain.
- Retention Cron automation.

Completed Phase 9 task:

- Task ID: `P9-T01`.
- Title: Implement AI-ready onboarding entry mode foundation.
- Result:
  - App Spine updated first from GitHub issue #2.
  - Service selection now advances to a post-diagnosis entry mode choice.
  - Entry modes are `manual` and `document_assisted`.
  - Manual mode preserves the existing Phase 8.5 guided onboarding.
  - Document-assisted mode uses the existing document upload/review path and does not claim OCR is active.
  - `orders` persistence supports Phase 9 readiness fields for future extraction and agent summaries.
  - Admin order detail displays onboarding entry mode and extraction readiness fields.
  - Verification passed: `npm run lint`, `npm run build`, `npx supabase db push`, and `/api/orders` persistence/upload regression with `AUS-2026-0017`.

Potential additions (post-P8-T02):

- Payment processing.
- Customer dashboard.
- Real AI OCR/document extraction.
- Multi-state LLC formation.
- Operating Agreement generation.
- Bank account preparation checklist.
