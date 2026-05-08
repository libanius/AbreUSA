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

Status: Blocked.

Decision needed:

- How long passport and U.S. address proof files are retained.
- Whether documents are deleted after review, agency submission, completion, or a fixed retention window.

Blocks:

- Production compliance posture.
- Long-term document storage policy.

P8-T05 gate review:

- Do not invent a retention period in implementation.
- A production retention rule needs owner/legal/operations confirmation because uploaded documents include passport and U.S. address proof files.
- Controlled testing can continue with private storage, RLS lockdown, and admin-only signed URL access, but production launch should not proceed until this gate is resolved or formally accepted as a business risk.

Required confirmation:

- Retention window.
- Deletion trigger.
- Who is responsible for deletion.
- Whether retained files are needed for audit, filing support, refund/dispute handling, or compliance.

### DG-002: AbreUSA Sender Domain

Category: Operations, brand, email.

Status: Proposed.

Decision needed:

- When to migrate from `noreply@notifications.brightscalegroup.com` to an AbreUSA-branded sender domain.

Blocks:

- Long-term production email branding.

P8-T05 proposed direction:

- Keep `noreply@notifications.brightscalegroup.com` for development, controlled testing, and internal validation because it is already verified in Resend.
- Migrate to an AbreUSA-branded sender before broad public launch or customer-facing production marketing.
- This is not a technical blocker for controlled launch, but it is a brand/operations blocker for long-term production.

Required confirmation:

- Final sender domain.
- Sender address, such as `noreply@abreusa.com`.
- Whether the first controlled production release may use the existing verified sender temporarily.

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

Status: Proposed.

Decision needed:

- Whether conversational onboarding supplements the current guided 13-step flow or replaces parts of it.
- Which moments should be conversational: service selection, eligibility, document guidance, review, or support.

Blocks:

- Conversational onboarding implementation.
- Any major redesign of the intake experience.

P8-T04 proposed direction:

- Start with conversational assistance layered on top of the guided flow.
- Do not replace the guided intake until compliance, UX, and data-capture risks are resolved.
- Candidate first moments: service explanation, field help, document guidance, and review support.

### DG-006: AI-Guided Onboarding Scope

Category: AI orchestration, compliance, onboarding architecture.

Status: Proposed.

Decision needed:

- Whether AI guidance only explains steps, recommends next actions, validates answers, extracts document data, or orchestrates the full onboarding session.
- Guardrails for PII, passport data, legal/tax guidance, and customer-facing recommendations.

Blocks:

- AI-guided onboarding layer.
- Real AI extraction expansion.

P8-T04 proposed direction:

- AI may explain steps, check completeness, summarize review issues, and suggest non-final document extraction values.
- AI must not provide autonomous legal/tax advice, final service recommendations, or unreviewed order submission.
- All AI-generated field values must remain customer-reviewable before approval.

### DG-007: Progressive Onboarding And Resume Model

Category: UX, persistence, account model.

Status: Proposed.

Decision needed:

- Whether customers can save drafts and resume later.
- Whether resume uses account login, secure magic link, protocol lookup, or admin-assisted recovery.

Blocks:

- Progressive onboarding UX.
- Draft persistence.
- Customer dashboard assumptions.

P8-T04 proposed direction:

- If implemented, save/resume should begin after applicant contact is captured.
- Preferred options to evaluate: secure magic link or authenticated customer account.
- Protocol lookup alone is not enough for resume access because orders contain sensitive data.

### DG-008: State-Based Onboarding Model

Category: Architecture, onboarding orchestration, status lifecycle.

Status: Proposed.

Decision needed:

- Canonical onboarding states beyond linear steps.
- How states map to customer progress, internal review, missing information, customer correction, submission, completion, and blocked status.

Blocks:

- State-based onboarding implementation.
- Status-triggered email automation.
- Customer dashboard progress model.

P8-T04 proposed direction:

- Use a state model above the current step flow before adding conversational, AI-guided, progressive, or dashboard experiences.
- Candidate states are documented in `/docs/04-user-flows.md` and `/docs/06-data-model.md`.
- Keep order status separate from onboarding state, but define a clear mapping before implementation.

### DG-009: Onboarding Orchestration Architecture

Category: Architecture, scalability, AI orchestration.

Status: Proposed.

Decision needed:

- Whether onboarding remains component-local state plus order persistence, or moves to a central orchestration layer/state machine/workflow model.
- Whether AI guidance reads from that orchestration layer.

Blocks:

- Onboarding orchestration layer.
- Complex progressive or conversational flows.

P8-T04 proposed direction:

- Keep current component-local intake state for the existing guided flow.
- Do not add a central workflow engine until progressive onboarding, customer resume, customer dashboard, or AI orchestration requires it.
- Treat conversational and AI layers as consumers of structured onboarding state, not as the source of truth.

### DG-010: Production Deployment Environment

Category: Deployment, security, operations.

Status: Blocked.

Decision needed:

- Confirm all production Vercel environment variables are set.
- Confirm deployment target, domain, and launch access model.

Blocks:

- Production deployment.

P8-T05 gate review:

- Production deployment is blocked until the deployment target, domain, launch access model, and Vercel environment variables are confirmed.
- Required env vars are documented in `.env.example`.
- `SUPABASE_SERVICE_ROLE_KEY` must be set only server-side and never exposed with a `NEXT_PUBLIC_` prefix.

Required confirmation:

- Vercel project and production domain.
- `NEXT_PUBLIC_SUPABASE_URL`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `RESEND_API_KEY`.
- Launch access model: internal-only, password/protected preview, controlled users, or public production.
