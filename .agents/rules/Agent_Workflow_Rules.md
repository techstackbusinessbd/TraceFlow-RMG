# Strict Agent Workflow & Behavioral Rules
These are mandatory behavioral instructions for you (the AI Agent) and any Subagents you spawn. You MUST follow these workflow rules before writing any code.

## 1. MANDATORY PRE-FLIGHT CHECK (READ BEFORE CODE)
You MUST NOT write any code based on assumptions or your internal memory. Before you generate a Controller, a React Component, or a Database Migration, you **MUST** use the `view_file` tool to read the relevant documentation from the `docs/` directory.

- **If you are assigned a Backend Task:** 
  You MUST first read:
  1. The specific `docs/01_Business_Analyst/PRD_[module].md`
  2. The specific `docs/02_Solution_Architect/API_Spec_[module].md`
  3. `docs/03_Backend_Developer/Coding_Workflow_SOP.md`

- **If you are assigned a Frontend Task:**
  You MUST first read:
  1. The specific `docs/01_Business_Analyst/PRD_[module].md`
  2. The specific `docs/04_Frontend_Developer/Mod_[module]_UI_Spec.md`
  3. `docs/04_Frontend_Developer/Design_System_Tokens.md`
  4. `docs/04_Frontend_Developer/Frontend_UI_Components_Strategy.md`

## 2. No Assumptions Rule
- If you are unsure about a database column name, DO NOT guess it. Read the API Spec or ERD.
- If you are unsure about a UI color, DO NOT guess it. Read the Design System Tokens.
- If you find a conflict between your knowledge and the documentation, **always follow the documentation**.

## 3. Subagent Delegation
If you spawn a subagent to help you (e.g., to build a React component while you build the API), you MUST include a strict instruction in the subagent's prompt telling it to read the relevant documentation first using its own tools.

**FAILURE TO READ DOCUMENTATION BEFORE CODING IS A CRITICAL VIOLATION OF THIS PROJECT'S INTEGRITY.**
