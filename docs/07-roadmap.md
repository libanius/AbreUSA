# 07 Roadmap

## Current Phase

Phase 3: Guided Intake Flow Planning.

Phase 2 is complete. The next step is to plan the Phase 3 guided intake flow before implementing business logic.

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

Status: Current phase. Planning, not implementation.

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

## Phase 4: Document Collection

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
