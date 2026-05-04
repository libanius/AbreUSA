# 08 Decisions Log

## Confirmed Decisions

### 2026-05-04: App Spine Created

Decision:

Create `/docs` as the official Product Memory System and single source of truth.

Reason:

Execution began before the product spine was established.

### 2026-05-04: Build Status Reset

Decision:

Set current Build Status to `Pre-Execution`.

Reason:

User explicitly stopped execution and requested reconstruction of product definition, docs, roadmap, and build status before continuing.

### 2026-05-04: Existing Prototype Treated As Product Evidence

Decision:

Use the existing `index.html` intelligent form prototype to reconstruct the product definition.

Reason:

It contains the clearest available representation of the intended AbreUSA flow.

### 2026-05-04: Documentation Naming Standardized

Decision:

Normalize `/docs` to the numbered file convention required by `AGENTS.md`.

Reason:

`AGENTS.md` defines the expected source-of-truth file names, and execution should not proceed while documentation naming is inconsistent.

### 2026-05-04: Next.js App Router As Production Foundation

Decision:

Use the existing Next.js 16 App Router scaffold as the production application foundation.

Reason:

`AGENTS.md` defines Next.js as the frontend architecture, and the repository already contains a Next.js 16 scaffold.

### 2026-05-04: Standalone Prototype Is Product Evidence Only

Decision:

Treat the standalone `index.html` prototype as product evidence, not production architecture.

Reason:

The prototype expresses the intended product flow, but production should follow the App Spine, Next.js architecture, and phased roadmap.

### 2026-05-04: Supabase Is Planned Backend Platform

Decision:

Use Supabase as the planned backend platform for orders, documents, generated forms, and status tracking.

Reason:

`AGENTS.md` defines Supabase as the default backend.

### 2026-05-04: Documents Require Private Storage

Decision:

Uploaded passport and address proof files must use private storage and must not be publicly exposed.

Reason:

The app handles sensitive identity and address documents.

### 2026-05-04: Generated Forms Remain Previews Until Approval

Decision:

Generated Florida Articles of Organization and IRS SS-4 outputs are previews until customer approval and AbreUSA processing.

Reason:

The App Spine requires AbreUSA to remain the filing/review authority and forbids labeling generated previews as submitted.

### 2026-05-04: Phase 1 Architecture Plan Approved

Decision:

Approve the Phase 1 Architecture Plan as the planning basis for Phase 2.

Reason:

The App Spine has been accepted and the architecture plan establishes the implementation direction without product code changes.

### 2026-05-04: EIN-Only Flow Deferred

Decision:

Defer EIN-only flow as Post-MVP or Decision Needed.

Reason:

The existing product spine flags EIN-only requirements as under-specified for customers who already have an LLC.

### 2026-05-04: Registered Agent-Only Flow Deferred

Decision:

Defer Registered Agent-only flow as Post-MVP or Decision Needed.

Reason:

The existing product spine flags Registered Agent-only intake requirements as under-specified.

### 2026-05-04: Placeholder / Manual Extraction For MVP

Decision:

Use placeholder/manual extraction strategy for MVP.

Reason:

Real AI extraction provider selection is not required for the MVP planning baseline and remains deferred.

### 2026-05-04: Payment Out Of MVP

Decision:

Keep payment out of MVP for now.

Reason:

Payment was previously a non-goal unless explicitly added, and the approved direction keeps it deferred.

### 2026-05-04: HTML Preview First

Decision:

Use HTML preview first for generated forms; defer PDF/export.

Reason:

HTML previews satisfy the MVP review requirement while avoiding export complexity before core flow validation.

### 2026-05-04: Draft Persistence Deferred

Decision:

Defer draft persistence/resume unless required later for MVP.

Reason:

The MVP can prioritize the guided completion flow before adding resumable drafts.

## Pending Confirmation Gates

### App Spine Confirmation

Question for user:

Confirm whether the generated `/docs` App Spine is approved as the official source of truth.

### Pricing Confirmation

Current prototype pricing:

- Complete Package: $499.
- Florida LLC: $299.
- EIN: $149.
- Registered Agent: $99/year.

Status:

Must be confirmed before production launch.

### Registered Agent Legal Entity Confirmation

Current prototype text:

- AbreUSA Registered Agent Services LLC.
- 1000 Brickell Ave, Miami, FL 33131.

Status:

Must be confirmed before production use.

### EIN-Only Intake Requirements

Status:

Deferred as Post-MVP or Decision Needed.

Decision Needed:

- Required existing LLC/company fields for EIN-only customers.
- Whether EIN-only skips LLC formation steps completely or asks for existing entity data.

### Registered Agent-Only Intake Requirements

Status:

Deferred as Post-MVP or Decision Needed.

Decision Needed:

- Minimal fields for Registered Agent-only service.
- Whether Registered Agent-only uses a separate shorter flow.
- Whether LLC-style steps should be skipped.

### AI Extraction Provider

Status:

Deferred.

MVP decision:

- Use placeholder/manual extraction strategy.

Decision Needed later:

- Real AI provider.

### Payment Scope

Status:

Not included in MVP.

Decision Needed later:

- Payment timing if included.

### PDF / Export Strategy

Status:

Deferred.

MVP decision:

- Use HTML preview first.

Decision Needed later:

- Downloadable PDF/export.
- Whether generated forms are persisted as artifacts or generated from structured order data.

### Draft Persistence

Status:

Deferred unless required later for MVP.

Decision Needed later:

- Whether unfinished customer drafts are saved.
- Whether customers can resume incomplete orders.

### Document Retention

Status:

Decision Needed:

- Retention period for uploaded passport and address proof files.
- Whether documents are deleted after submission or completion.
