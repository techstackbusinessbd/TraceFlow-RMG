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
- **UI Language**: All UI labels, buttons, tables, and messages MUST be in 100% English.
- **Button Styling**: Buttons MUST use flat, crisp, solid colors. Gradient buttons are strictly prohibited.
- **Git Branching**: All development commits MUST go to `develop` branch. `main` is reserved for production releases.

## Communication Rules
- **Language**: You MUST always communicate with the user in Bengali (Bangla).
- **Implementation Plans**: All implementation plans and documentation must also be written in Bengali (Bangla).
