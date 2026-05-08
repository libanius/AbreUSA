# 03 Requirements

## Product Requirements

- The customer must be able to select a service: complete LLC + EIN, Florida LLC only, EIN only, or Registered Agent.
- The customer must be able to complete a guided intake without understanding raw U.S. government forms.
- The app must support Florida as the initial state.
- The app must support single-member and multi-member LLCs.
- The customer must be able to review and correct data before approval.
- Generated forms must be previews and must not be labeled as submitted before approval and AbreUSA processing.
- AbreUSA must remain the filing/review authority before government submission.

## Business Rules

- LLC name must include a valid LLC suffix.
- Multi-member LLCs require each member name, address, and ownership percentage.
- Registered Agent is mandatory for Florida LLC formation.
- EIN flow must support foreign nationals without SSN by using passport-based responsible party context.
- Customer must review extracted and entered data before approval.
- Ownership percentages should total 100.

## Document Requirements

MVP requires:

- Passport page with photo.
- U.S. address proof such as utility bill, bank statement, lease, or similar.

Document extraction targets:

- Full name.
- Date of birth.
- Passport number.
- Passport expiration.
- Nationality.
- Street address.
- City.
- State.
- ZIP code.

AI extraction strategy for MVP:

- Use placeholder/manual extraction behavior.
- Customer must be able to manually review and correct fields.
- Real AI provider selection is deferred.

## Review And Approval Requirements

- Review screen must summarize all captured data.
- Customer must be able to go back and correct.
- Customer must be able to generate form previews.
- Customer must be able to approve submission.
- AbreUSA receives the approved order for human review and filing.

## Error And Correction Requirements

Required correction points:

- Missing LLC name.
- LLC name missing valid suffix.
- Missing business address and city.
- Missing required document.
- Failed document extraction.
- Missing member data.
- Invalid ownership percentages.
- Missing Registered Agent detail when "other" is selected.

MVP behavior:

- Show inline errors.
- Preserve entered data when navigating back.
- Allow manual override of extracted data.

## Compliance And Trust Requirements

- AbreUSA may assist with preparation and submission, but the product must avoid presenting itself as a law firm unless that is legally true and confirmed.
- Government timelines must be framed as estimates.
- AI extraction must be reviewable and correctable by the customer.
- Sensitive documents must be handled with secure upload, storage, access control, and retention rules before production.
- Generated forms must not be labeled as submitted until the customer approves and AbreUSA processes them.
- AbreUSA must not position itself as a permanent secure archive for passports, IDs, proofs of address, or other sensitive uploads.
- Customer-facing positioning should explain that documents are used for onboarding and operational processing and may be removed after the process is completed.
- Sensitive uploads should follow the initial retention policy unless a later compliance or operational decision changes it.

## Document Retention And Customer Data Lifecycle Requirements

Strategic principle:

- Separate long-term customer memory from temporary sensitive processing storage.
- The long-term asset of the platform is the customer relationship, onboarding intelligence, business lifecycle memory, and operational history.
- The platform should not retain sensitive uploads indefinitely by default.

Long-term customer memory may include:

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

Sensitive temporary storage includes:

- Passports.
- IDs.
- Proofs of address.
- Sensitive uploaded documents.

Initial retention policy:

- Sensitive uploads: retain for 90 days after order completion or cancellation.
- Generated operational files, such as protocol previews, generated summaries, and operational PDFs: retain for 1 year.
- Customer operational metadata: long-term operational retention allowed.

Governance constraints:

- Do not introduce enterprise compliance complexity yet.
- Do not make claims about compliance certification.
- Focus on minimal responsible retention, operational clarity, risk reduction, and future customer lifecycle support.

## MVP Deferrals

- EIN-only flow is deferred as Post-MVP or Decision Needed.
- Registered Agent-only flow is deferred as Post-MVP or Decision Needed.
- Payment is out of MVP.
- PDF/export is deferred; MVP uses HTML preview first.
- Draft persistence/resume is deferred unless later required for MVP.

## Execution Requirements

- Work on one roadmap task at a time.
- Do not skip tasks.
- Do not create features outside the roadmap.
- If unclear, stop and ask.
- Always follow acceptance criteria.
- No change goes directly to code.
- Follow: Idea -> Decision -> Spec Update -> Roadmap Update -> Execution.
- After any implementation, update `07-roadmap.md` and `09-build-status.md`.
- If something changed, update `08-decisions-log.md`.
- If Build Status is `Pre-Execution`, do not write product code.
