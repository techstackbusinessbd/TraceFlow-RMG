# Agent Memory & Continuity Strategy
**Role:** Project Manager
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction: The "Agent Amnesia" Problem
AI Agents are typically stateless. When a developer closes the IDE, ends a session, or spawns a new subagent, the agent starts with a "blank slate" (Agent Amnesia). It forgets the architecture, decisions, and progress from the previous session. 

This document outlines the strict strategy to preserve context and ensure continuity across hundreds of sessions during this Enterprise project's lifecycle.

---

## 2. Strategy 1: "Documentation as Brain"
The primary mechanism to solve amnesia is the `docs/` folder combined with strict agent rules.

- **The Rule:** As defined in `.agents/rules/Agent_Workflow_Rules.md`, the AI Agent is explicitly FORBIDDEN from writing code immediately upon waking up in a new session.
- **The Execution:** The agent MUST use its `view_file` tool to read the relevant `PRD_*.md`, `API_Spec_*.md`, and `UI_Spec_*.md` files. 
- **Result:** By reading the documentation at the start of every session, the agent "re-hydrates" its memory and regains full context of the project architecture and the specific module it is working on.

---

## 3. Strategy 2: Task Artifacts (Progress Tracking)
If an agent is in the middle of a complex task (e.g., building a frontend module) and the session is interrupted:

- The agent will maintain a `task.md` artifact in its active workspace.
- This artifact acts as a checklist (e.g., `[x] Created UI component`, `[/] Fetching API data`, `[ ] Writing unit tests`).
- When a new session starts, the agent will review `task.md` to instantly know exactly where to resume work, preventing duplicate effort or skipped steps.

---

## 4. Strategy 3: Knowledge Items (The `/learn` Command)
During development, the agent might figure out a complex bug fix or a specific way the Product Owner wants the codebase structured that isn't written in the docs.

- **The Action:** The user must type the **`/learn`** command in the chat (e.g., `/learn always use Eloquent resources for JSON responses`).
- **The Result:** The IDE will save this rule into the system's permanent "Knowledge Items" (KI) system. 
- In every future session, before the agent even reads the `docs/` folder, the KI system automatically injects these learned rules into the agent's baseline context.

---
*(End of Memory Continuity Strategy)*
