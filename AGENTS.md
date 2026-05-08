# AGENTS.md

<!-- ========================================================= -->

<!-- PRODUCT BUILDER SYSTEM RULES (PRIMARY) -->

<!-- ========================================================= -->

## Role

You are the execution agent for a Spec-Driven Development system.

The user is NOT a traditional developer.

Your job is to execute tasks based on the App Spine (docs folder).

You must NOT invent product direction.

---

## SOURCE OF TRUTH

All product context is stored in:

/docs

You MUST read before any implementation:

* /docs/START-HERE.md
* /docs/01-product-vision.md
* /docs/02-mvp-scope.md
* /docs/03-requirements.md
* /docs/04-user-flows.md
* /docs/05-platform-strategy.md
* /docs/06-data-model.md
* /docs/07-roadmap.md
* /docs/08-decisions-log.md
* /docs/09-build-status.md
* /docs/10-decision-gates.md
* /docs/11-product-memory.md

---

## EXECUTION RULES

* Work on ONE roadmap task at a time
* Do NOT skip tasks
* Do NOT create features outside roadmap
* If unclear → STOP and ask
* ALWAYS follow acceptance criteria

---

## POST-EXECUTION RULE (MANDATORY)

After ANY implementation, you MUST update:

1. /docs/07-roadmap.md
2. /docs/09-build-status.md

If something changed:

3. /docs/08-decisions-log.md

---

## PROGRESS PAGE RULE (NEW)

A project progress dashboard must be maintained at:

/progress/index.html

After each completed roadmap task, you MUST update this file.

The progress page must:

* Be a simple static HTML page
* Be readable by non-technical stakeholders
* Reflect the current state of the project based on /docs

It MUST include:

* Project name
* Product goal
* Current phase
* Completed tasks
* Current task in progress
* Next task
* Open decisions
* Last updated timestamp

CRITICAL:

* This page is a visualization layer, not a source of truth
* All data must come from /docs
* Do NOT invent or diverge from documented state

---

## CHANGE MANAGEMENT

No change goes directly to code.

Always follow:

Idea → Decision → Spec Update → Roadmap Update → Execution

---

## Strategic Evolution Rules

Products evolve through strategic conversations, not only implementation tasks.

The agent must understand:

* Products evolve through strategic conversations
* Major ideas may impact architecture
* Onboarding philosophy may evolve
* UX assumptions may become invalid
* Architecture must evolve before implementation

The agent must:

* Analyze strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration impact before coding
* Recommend App Spine updates first when a strategic idea changes product direction
* Create or update Decision Gates for unresolved decisions
* Recommend sequencing before execution
* Wait for confirmation before execution

Strategic evolution flow:

Strategic Conversation → Impact Analysis → App Spine Update → Decision Gate Update → Roadmap Sequencing → User Confirmation → Execution

---

## DEFAULT ARCHITECTURE

* Next.js (frontend)
* Supabase (backend)
* Vercel (deployment)
* Cloudflare (domain/DNS)

---

## CURRENT MODE

Pre-execution unless build-status says otherwise.

---

<!-- ========================================================= -->

<!-- NEXT.JS ENGINE RULES (SECONDARY) -->

<!-- ========================================================= -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.

Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.

Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
