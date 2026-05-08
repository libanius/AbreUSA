# 11 Product Memory

## Purpose

This document defines what AbreUSA should remember long term and what should remain temporary operational storage.

Strategic principle:

AbreUSA should not become a permanent storage vault for sensitive identity documents. The long-term platform asset should be customer relationship, onboarding intelligence, business lifecycle memory, and operational history.

## Data Architecture Principle

Separate:

1. Long-Term Customer Memory.
2. Temporary Sensitive Processing Storage.

## Long-Term Customer Memory

These may be retained operationally long term:

- Applicant profile.
- Name.
- Email.
- Phone or WhatsApp.
- Country.
- Language preference.
- Service history.
- Company metadata.
- Onboarding summaries.
- Protocol history.
- Status timeline.
- Operational notes.
- Lifecycle relationship data.

Purpose:

- Enable future operational relationship.
- Support follow-up services.
- Support business lifecycle operations.
- Improve onboarding intelligence.
- Preserve operational history without retaining sensitive uploads indefinitely.

## Temporary Sensitive Processing Storage

Sensitive uploads should be treated separately from long-term customer memory.

Examples:

- Passports.
- IDs.
- Proofs of address.
- Sensitive uploaded documents.

Default principle:

- Sensitive uploads are used for onboarding and operational processing.
- Sensitive uploads should not be retained indefinitely by default.
- Sensitive uploads should be removed according to the retention policy unless a later confirmed policy requires a hold or extension.

## Initial Retention Policy

Sensitive uploads:

- Retention: 90 days after order completion or cancellation.

Generated operational files:

- Examples: protocol previews, generated summaries, operational PDFs.
- Retention: 1 year.

Customer operational metadata:

- Retention: long-term operational retention allowed.

## Storage Architecture

Use private Supabase Storage buckets only.

Recommended buckets:

- `private-documents`.
- `generated-previews`.
- `internal-summaries`.

Rules:

- No permanent public URLs.
- Use signed URLs.
- Use short-lived access URLs.
- Require authenticated admin access.
- Do not expose raw storage paths or bucket internals to customers.

## Product Positioning

The platform should communicate:

"Documents are used for onboarding and operational processing purposes and may be removed after the process is completed."

Do not position AbreUSA as a permanent secure archive for identity documents.

## Customer Lifecycle Direction

The long-term strategic value of AbreUSA is:

- Customer lifecycle relationship.
- Business operational support.
- Future services.
- Onboarding intelligence.

Potential future services:

- Annual reports.
- Renewals.
- Bookkeeping.
- Banking guidance.
- Tax coordination.
- Compliance reminders.

## Governance

Open governance areas:

- Document retention automation.
- Deletion workflows.
- Reviewer access scopes.
- Audit logging.
- Future compliance framework needs.

Constraints:

- Do not introduce enterprise compliance complexity yet.
- Do not introduce legal claims about compliance certification.
- Do not overengineer security architecture for MVP.
- Focus on minimal responsible retention, operational clarity, risk reduction, and future customer lifecycle support.
