# 10 Decision Gates

## Purpose

Decision Gates track unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.

They prevent implementation from starting before the App Spine, roadmap, and operational assumptions are synchronized.

## How To Use Decision Gates

- Create or update a gate when a strategic conversation introduces unresolved direction.
- Treat gates as blockers when they affect architecture, data flow, compliance, security, customer UX, or AI behavior.
- Resolve or explicitly defer gates before writing product feature code.
- Link roadmap tasks to gates when sequencing depends on a decision.
- Keep `/docs/08-decisions-log.md` for confirmed decisions and this file for unresolved or gated decisions.

## Status Values

- `Open`: decision is unresolved.
- `Proposed`: recommended direction exists but is not confirmed.
- `Confirmed`: decision is resolved and should move to the decisions log.
- `Deferred`: intentionally postponed.
- `Blocked`: cannot proceed until outside input is available.

## Open Gates

### DG-001: Document Retention Policy

Category: Compliance, privacy, operations.

Status: Open.

Decision needed:

- How long passport and U.S. address proof files are retained.
- Whether documents are deleted after review, agency submission, completion, or a fixed retention window.

Blocks:

- Production compliance posture.
- Long-term document storage policy.

### DG-002: AbreUSA Sender Domain

Category: Operations, brand, email.

Status: Open.

Decision needed:

- When to migrate from `noreply@notifications.brightscalegroup.com` to an AbreUSA-branded sender domain.

Blocks:

- Long-term production email branding.

### DG-003: EIN-Only Flow Requirements

Category: Product, onboarding, data model.

Status: Deferred.

Decision needed:

- Required fields for customers who already have an LLC and only need EIN support.
- Whether EIN-only uses a separate shorter flow or existing LLC data sections.

Blocks:

- EIN-only implementation.

### DG-004: Registered Agent-Only Flow Requirements

Category: Product, onboarding, data model.

Status: Deferred.

Decision needed:

- Required fields for Registered Agent-only customers.
- Whether Registered Agent-only uses a dedicated shorter flow.

Blocks:

- Registered Agent-only implementation.

### DG-005: Conversational Onboarding Role

Category: UX, onboarding architecture, product strategy.

Status: Open.

Decision needed:

- Whether conversational onboarding supplements the current guided 13-step flow or replaces parts of it.
- Which moments should be conversational: service selection, eligibility, document guidance, review, or support.

Blocks:

- Conversational onboarding implementation.
- Any major redesign of the intake experience.

### DG-006: AI-Guided Onboarding Scope

Category: AI orchestration, compliance, onboarding architecture.

Status: Open.

Decision needed:

- Whether AI guidance only explains steps, recommends next actions, validates answers, extracts document data, or orchestrates the full onboarding session.
- Guardrails for PII, passport data, legal/tax guidance, and customer-facing recommendations.

Blocks:

- AI-guided onboarding layer.
- Real AI extraction expansion.

### DG-007: Progressive Onboarding And Resume Model

Category: UX, persistence, account model.

Status: Open.

Decision needed:

- Whether customers can save drafts and resume later.
- Whether resume uses account login, secure magic link, protocol lookup, or admin-assisted recovery.

Blocks:

- Progressive onboarding UX.
- Draft persistence.
- Customer dashboard assumptions.

### DG-008: State-Based Onboarding Model

Category: Architecture, onboarding orchestration, status lifecycle.

Status: Open.

Decision needed:

- Canonical onboarding states beyond linear steps.
- How states map to customer progress, internal review, missing information, customer correction, submission, completion, and blocked status.

Blocks:

- State-based onboarding implementation.
- Status-triggered email automation.
- Customer dashboard progress model.

### DG-009: Onboarding Orchestration Architecture

Category: Architecture, scalability, AI orchestration.

Status: Open.

Decision needed:

- Whether onboarding remains component-local state plus order persistence, or moves to a central orchestration layer/state machine/workflow model.
- Whether AI guidance reads from that orchestration layer.

Blocks:

- Onboarding orchestration layer.
- Complex progressive or conversational flows.

### DG-010: Production Deployment Environment

Category: Deployment, security, operations.

Status: Open.

Decision needed:

- Confirm all production Vercel environment variables are set.
- Confirm deployment target, domain, and launch access model.

Blocks:

- Production deployment.
