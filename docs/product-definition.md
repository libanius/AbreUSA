# Product Definition

## Product Name

AbreUSA

## Product Concept

AbreUSA is an intelligent Portuguese-first web application that helps Brazilian customers open and manage the formation process for a U.S. company, starting with Florida LLC formation and EIN acquisition.

The core product is a guided intake experience that asks adaptive questions, collects documents, extracts relevant data from uploads, generates official filing previews, and routes the approved order to AbreUSA for review and submission.

## Primary Customer

Brazilian entrepreneurs, professionals, investors, and small business owners who want to open a U.S. company but need a simpler, Portuguese-language path through U.S. formation paperwork.

## Core Jobs To Be Done

1. Choose the needed service: complete LLC + EIN package, LLC only, EIN only, or Registered Agent.
2. Provide the business identity and registration information needed for Florida formation.
3. Provide responsible party and federal tax information needed for IRS Form SS-4.
4. Upload identity and address documents.
5. Let the system extract relevant data and reduce manual typing.
6. Review all captured data before submission.
7. Preview generated official forms.
8. Approve the order for AbreUSA review and filing.
9. Receive a protocol number and expected processing timeline.

## Product Promise

AbreUSA makes opening a U.S. business feel guided, understandable, and fast for Portuguese-speaking customers by turning complex formation and tax forms into a structured step-by-step flow.

## MVP Scope

The MVP is a production-quality guided intake and form-generation workflow for:

- Florida LLC formation.
- IRS EIN request support through SS-4.
- Registered Agent selection.
- Applicant identity and U.S. address document collection.
- Review and approval before AbreUSA submission.
- Order protocol generation.

## Service Catalog

- Complete Package: Florida LLC + EIN.
- Florida LLC only.
- EIN Number only.
- Registered Agent service.

Current prototype pricing signals:

- Complete Package: $499.
- Florida LLC: $299.
- EIN Number: $149.
- Registered Agent: $99/year.

Pricing must be confirmed before production launch.

## Experience Principles

- Portuguese-first, with U.S. government form labels where legally relevant.
- Guided and adaptive rather than exposing raw forms first.
- Mobile-friendly and fast to complete.
- Customer remains in control through review and approval gates.
- Official forms are previewed as generated outputs, not treated as submitted until approval.
- AbreUSA remains the filing/review authority before government submission.

## Core Flow

1. Welcome and value statement.
2. Service selection.
3. LLC name entry and validation.
4. Business activity selection.
5. Member count selection.
6. Member data collection.
7. Principal Florida business address collection.
8. Registered Agent selection.
9. EIN and IRS SS-4 questions when service includes EIN.
10. Document upload.
11. AI-assisted document extraction.
12. Customer review.
13. Generated Florida Articles of Organization and IRS SS-4 previews.
14. Customer approval.
15. Submission confirmation with protocol number.

## Required Outputs

- Customer-facing order summary.
- Florida Articles of Organization preview.
- IRS Form SS-4 preview when EIN is included.
- Protocol number after approval.
- Internal structured order payload for AbreUSA review.

## Success Criteria

- A customer can complete the guided flow without needing to understand U.S. legal form structure.
- The app captures all fields needed for AbreUSA to review the order.
- The customer can correct data before approval.
- The app clearly distinguishes generated previews from actual government submission.
- The workflow supports single-member and multi-member LLCs.
- The product has a durable documentation spine before implementation resumes.

## Non-Goals For MVP

- Direct automated filing with Sunbiz or IRS without human review.
- Legal advice.
- Accounting or tax planning.
- State coverage outside Florida.
- Full customer dashboard.
- Payment processing unless explicitly added to the roadmap after confirmation.
- Multi-language support beyond Portuguese-first UX with required English form labels.

## Compliance And Trust Boundaries

- AbreUSA may assist with preparation and submission, but the product must avoid presenting itself as a law firm unless that is legally true and confirmed.
- Government timelines must be framed as estimates.
- AI extraction must be reviewable and correctable by the customer.
- Sensitive documents must be handled with secure upload, storage, access control, and retention rules before production.
- Generated forms must not be labeled as submitted until the customer approves and AbreUSA processes them.

