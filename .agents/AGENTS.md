# RMG Traceability Software - Global Rules
You are an AI assistant working on the RMG Woven Garments Traceability Software project.
The project owner (User) acts as the Product Owner, Project Manager, and Executive Sponsor.
Your job is to assume the required engineering roles to build this system.

## Core Architecture Principles
- API-First
- Secure by Design
- Offline-First for mobile/tablet apps
- Strict Transaction Integrity
- **Validation Standard**: Pure Server-Side Validation Only. Do NOT use native HTML5 validation (`required`, `minlength`, `maxlength`, `pattern`, or browser popup tooltips). Forms must include `noValidate` and handle error feedback strictly from backend API responses (HTTP 422 JSON errors).

## UI/UX Engineering Rules
- **No Modals Rule (STRICT)**: Modals/popups are STRICTLY PROHIBITED. All forms, details, creation flows, edit flows, reports, and print views MUST be built as full dedicated pages/views (or full-screen views with proper back navigation). NEVER use modal dialogues/popups.
- **Centralized Design Tokens & UI Primitives Only (STRICT)**: Writing ad-hoc or inline Tailwind utility classes for buttons, badges, tables, inputs, cards, and action controls directly in page files is STRICTLY PROHIBITED. All UI elements MUST exclusively consume:
  1. Centralized tokens from `frontend/src/config/designTokens.ts` (`UI_TOKENS`)
  2. Standard reusable UI primitives from `frontend/src/components/common/` (`<Button>`, `<Badge>`, `<TableActionButton>`, etc.)
  No component or page may invent arbitrary colors, borders, paddings, or geometry. Any new styling, variant, or token MUST first be registered in `designTokens.ts`.
- **UI Language**: All UI labels, buttons, tables, and messages MUST be in 100% English.
- **Button Styling**: Buttons MUST use flat, crisp, solid colors. Gradient buttons are strictly prohibited.
- **Zero-Confusion Microcopy (STRICT)**: Never include ambiguous, cryptic, or unnecessary text that confuses users. Avoid wordy filler paragraphs, engineering jargon, or screen clutter. All labels, messages, buttons, and helper texts MUST be direct, concise, purposeful, and action-oriented (e.g., "Create Order", "Reject Roll", "Enter 6-digit PIN").
- **Git Branching**: All development commits MUST go to `develop` branch. `main` is reserved for production releases.

## Communication Rules
- **Language**: You MUST always communicate with the user in Bengali (Bangla).
- **Implementation Plans**: All implementation plans and documentation must also be written in Bengali (Bangla).
