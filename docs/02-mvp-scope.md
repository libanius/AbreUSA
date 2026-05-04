# 02 MVP Scope

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

## Required Outputs

- Customer-facing order summary.
- Florida Articles of Organization preview.
- IRS Form SS-4 preview when EIN is included.
- Protocol number after approval.
- Internal structured order payload for AbreUSA review.

## Existing Prototype Features

- Fixed top progress bar.
- 13-screen intake flow.
- Service selector with four services.
- LLC name validation requiring LLC-style suffix.
- Business activity selector with common categories.
- Member count stepper from 1 to 10.
- Dynamic member data collection.
- Florida principal office address.
- Registered Agent options: AbreUSA, self, or other.
- EIN/IRS questions for SS-4.
- Passport upload.
- U.S. address proof upload.
- Simulated AI extraction of passport and address fields.
- Review screen.
- Generated Florida Articles of Organization preview.
- Generated IRS SS-4 preview.
- Approval step.
- Protocol number confirmation.

## Non-Goals For MVP

- Direct automated filing with Sunbiz or IRS without human review.
- Legal advice.
- Accounting or tax planning.
- State coverage outside Florida.
- Full customer dashboard.
- Payment processing unless explicitly added to the roadmap after confirmation.
- Multi-language support beyond Portuguese-first UX with required English form labels.
- Real AI document extraction provider unless confirmed during a later phase.
- Backend architecture beyond what is confirmed in foundation planning.
- EIN-only production flow beyond placeholder/deferred planning.
- Registered Agent-only production flow beyond placeholder/deferred planning.
- PDF/export beyond HTML preview.
- Draft persistence/resume unless required later for MVP.

## Post-MVP Expansion Candidates

- Payment processing.
- Customer dashboard.
- Admin review portal.
- Real AI OCR/document extraction.
- Email/SMS updates.
- Multi-state LLC formation.
- Operating Agreement generation.
- Bank account preparation checklist.
- Bilingual Portuguese/English UI.
- EIN-only dedicated flow.
- Registered Agent-only dedicated flow.
- PDF/export workflow.
- Draft persistence and resume links.
