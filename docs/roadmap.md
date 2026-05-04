# Roadmap

## Current Phase

Pre-Execution.

The project is paused before implementation. The App Spine must be confirmed before any code generation, refactor, or feature build.

## Phase 0: App Spine Confirmation

Goal: establish the product source of truth.

Deliverables:

- Product Definition.
- Product Memory System.
- Roadmap.
- Build Status.
- Phase System.
- User Flows.
- Data Model.
- Decision Log.

Exit criteria:

- User confirms the App Spine.
- Any requested corrections are applied to `/docs`.
- Build Status moves from `Pre-Execution` to the next confirmed phase.

## Phase 1: Foundation Planning

Goal: define implementation architecture without building product behavior yet.

Deliverables:

- Confirm app architecture for Next.js 16 App Router.
- Confirm routing strategy.
- Confirm component structure.
- Confirm styling/design system boundaries.
- Confirm storage strategy for orders and documents.
- Confirm AI extraction provider or placeholder strategy.
- Confirm security and privacy requirements for sensitive documents.

Exit criteria:

- Architecture plan is documented.
- No unresolved blocking assumptions remain.

## Phase 2: UI Shell And Design System

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
- Visual direction matches Product Definition.

## Phase 3: Guided Intake Flow

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

