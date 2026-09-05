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
- **Mandatory Golden List Page Standard (STRICT & FINAL)**: Every data list management page across the entire system MUST strictly adhere to the approved 3-tier layout:
  1. **Tier 1: Sleek Header Row**: Single-line clean layout (`<PageHeader>`) with direct, concise Title on the left (e.g. `User Directory`, `Sister Companies`) paired with an item counter `<Badge variant="neutral">` (e.g. `4 Users`), and primary/secondary action buttons on the far right (`<Button variant="primary">`, `<Button variant="secondary">`). Redundant large icons, decorative icon boxes, verbose subtitle paragraphs, and page-level duplicate breadcrumbs are strictly prohibited (breadcrumbs belong exclusively to the global top pinned bar).
  2. **Tier 2: Unified Filter Toolbar**: Mandatory `<FilterToolbar>` primitive featuring a full-width search input with magnifying glass on the left, filter selects in the middle, and flat "Filter" submit button + "Reset" icon button on the right. Subline shows active sort pill on left and "Show per page" dropdown (10, 15, 25, 50) on right.
  3. **Tier 3: Standard DataTable Shell**: Mandatory `<DataTable<T>>` primitive with fixed enterprise table shell, alternating row highlights, clean borders, dynamic typed `ColumnDef<T>[]`, and fixed footer pagination (`Showing X to Y of Z records` + `< Previous` / `> Next`).
- **Enterprise Filter Toolbar Standard (STRICT)**: All data list/management pages MUST use the unified Enterprise Filter Toolbar pattern:
  1. **Top Row**: Search input on the left (`UI_TOKENS.input.base` with search icon), followed by select filters (`UI_TOKENS.input.select`), and on the far right a primary flat "Filter" submit button alongside a secondary "Reset" icon button (`RotateCcw`).
  2. **Bottom Subline**: A standardized info row (`UI_TOKENS.filter.subline`) containing the active sort indicator on the left (`Sorted by: FIELD (DIR)` with icon) and the page size selector on the far right ("Show per page:" dropdown: 10, 15, 25, 50).
  3. Ad-hoc search layouts or loose standalone inputs are strictly prohibited; pages must wrap filter controls in the standardized container (`UI_TOKENS.filter.container`) or use the standardized `<FilterToolbar>` primitive.
- **Enterprise DataTable Consistency Standard (STRICT)**: The DataTable component shell, layout, and footer pagination controls are 100% fixed and immutable across the entire application, while the table contents (columns, data cells, badges, and actions) dynamically adapt to each specific page:
  1. **Standard Reusable Primitive**: All data tables MUST strictly render via the standard `<DataTable<T>>` primitive (`frontend/src/components/common/DataTable.tsx`). Manual `<table>` tags or custom ad-hoc table layouts in pages are strictly prohibited.
  2. **Uniform Shell & Typography**: Header row styling, border-colors, hover transitions, and alternating background tokens must strictly come from `UI_TOKENS.table.*`.
  3. **Standard Footer & Pagination**: Every table must feature the fixed footer showing record range summary on the left ("Showing X to Y of Z records", per-page selector) and pagination on the right ("Page X of Y", `< Previous`, `> Next` flat buttons).
  4. **Dynamic Column Definitions**: Each page specifies its domain-specific data through strongly-typed `ColumnDef<T>[]` (e.g., entity codes in mono font, status pills using `<Badge>`, avatars/identifiers, and actions using `<TableActionButton>`).
- **Git Branching**: All development commits MUST go to `develop` branch. `main` is reserved for production releases.

## Communication Rules
- **Language**: You MUST always communicate with the user in Bengali (Bangla).
- **Implementation Plans**: All implementation plans and documentation must also be written in Bengali (Bangla).
