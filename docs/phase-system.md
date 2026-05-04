# Phase System

## Purpose

The Phase System prevents premature implementation and keeps product, design, and engineering aligned.

## Phase Order

1. Product Definition.
2. Product Memory.
3. Roadmap.
4. Build Status.
5. Confirmation Gate.
6. Architecture Planning.
7. Execution.
8. Verification.
9. Status Update.

## Required Behavior By Phase

### Product Definition

Define the product, users, promise, scope, constraints, and success criteria.

No code.

### Product Memory

Record durable product rules, decisions, assumptions, terminology, non-goals, and current repo context.

No code.

### Roadmap

Break the work into ordered phases with deliverables and exit criteria.

No code.

### Build Status

Declare the current phase and allowed next action.

No code.

### Confirmation Gate

Ask the user to confirm the App Spine before continuing.

No code.

### Architecture Planning

Plan implementation structure, dependencies, storage, data flow, security, and verification.

No product code unless explicitly approved.

### Execution

Implement only the confirmed phase.

Code must follow `/docs`.

### Verification

Run appropriate checks for the phase: lint, typecheck, tests, browser verification, accessibility, and flow checks as relevant.

### Status Update

Update `/docs/build-status.md` and, if needed, `/docs/decision-log.md`.

## Enforcement Rules

- If Build Status is `Pre-Execution`, do not write product code.
- If the user says "stop", pause execution and return to the appropriate phase.
- If product scope changes, update docs before code.
- If implementation reveals a product contradiction, stop and document the contradiction before proceeding.
- Do not ask new product questions when the existing App Spine provides a reasonable answer.
- Ask for confirmation only at phase gates or when a blocking contradiction exists.

## Current Phase

Pre-Execution.

Allowed actions:

- Documentation updates.
- Product spine confirmation.
- Build status updates.

Disallowed actions:

- Feature implementation.
- UI implementation.
- Backend implementation.
- Additional package installation.
- Refactors.

