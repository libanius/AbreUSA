# Product Memory System

## Product Identity

AbreUSA is a guided business formation assistant for Portuguese-speaking customers opening a U.S. company. The app starts with Florida LLC and EIN workflows and should feel like a professional intake tool, not a generic landing page.

## Canonical Product State

Current official status: Pre-Execution.

The existing repository contains a Next.js scaffold and a standalone HTML prototype named `AbreUSA — Formulário Inteligente`. That prototype is treated as product evidence, not production architecture.

No further implementation should happen until the App Spine is confirmed.

## Audience Memory

Primary users:

- Brazilians opening a U.S. business.
- Portuguese speakers who may not understand U.S. filing terminology.
- Users who need confidence, clarity, and visible progress.

User likely concerns:

- Whether they are choosing the correct service.
- Whether they can open a company without SSN.
- What documents are required.
- Whether the official forms are accurate.
- What happens after approval.
- How long AbreUSA takes to submit and process the order.

## Product Language

Primary UI language: Brazilian Portuguese.

Acceptable English terms:

- LLC.
- EIN.
- IRS.
- Form SS-4.
- Articles of Organization.
- Registered Agent.
- Florida.
- Sunbiz.

Tone:

- Clear.
- Professional.
- Guided.
- Trustworthy.
- Not overly playful.

## Core Product Concepts

- Service: the product the customer is buying or requesting.
- Applicant: the person completing the flow.
- Responsible party: the person listed for IRS EIN purposes.
- LLC: the company being formed or used for EIN.
- Member: LLC owner.
- Registered Agent: required Florida agent.
- Documents: passport and U.S. address proof.
- Generated forms: previews created from intake data.
- Approval: customer confirmation to send order to AbreUSA.
- Submission: AbreUSA action after review, not automatic at preview time.

## Durable Rules

- Always ask for confirmation before continuing from Pre-Execution to implementation.
- Do not create implementation code while the project is in Pre-Execution.
- Preserve `/docs` as the source of truth.
- Implementation must follow the roadmap phase order unless the user confirms a change.
- Product decisions should be recorded in `decision-log.md`.
- Build status must be updated whenever a phase changes.
- Do not add new product questions unless required by a blocking contradiction.

## Existing Prototype Memory

Recovered prototype features:

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

## Required Document Memory

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

## Business Rule Memory

- Florida is the initial state.
- LLC name must include a valid LLC suffix.
- Single-member and multi-member LLCs must be supported.
- Multi-member LLCs require each member name, address, and ownership percentage.
- Registered Agent is mandatory for Florida LLC formation.
- EIN flow must support foreign nationals without SSN by using passport-based responsible party context.
- Customer must review extracted and entered data before approval.

## Technical Context Memory

Current repo context:

- Framework scaffold: Next.js 16 App Router.
- React: 19.
- Tailwind: 4.
- shadcn initialized before this App Spine reset.
- Existing production product is not yet implemented in Next.js.

Important local instruction:

- Before editing Next.js code, read relevant guides in `node_modules/next/dist/docs/` because this Next.js version may differ from prior conventions.

## Non-Goals Memory

Do not assume:

- Automatic government submission.
- Full payment integration.
- Multi-state formation.
- Legal advice.
- Customer account dashboard.
- Real AI document extraction provider.
- Backend architecture.

These can be added only through explicit roadmap confirmation.

