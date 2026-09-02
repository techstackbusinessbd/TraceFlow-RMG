# Enterprise Folder & Code Structure Guidelines
**Project:** RMG Traceability Software
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Architectural Pattern (Domain-Driven Design)
Because this system encompasses 12 distinct modules, a standard MVC structure will quickly become unmaintainable. We will use a **Modular / Domain-Driven Design (DDD)** approach for the Backend (Laravel) and a **Feature-Based** structure for the Frontend (React).

---

## 2. Backend Structure (Laravel 13)

### 2.1. The `app/Domains` Directory
Instead of putting all models in `app/Models` and controllers in `app/Http/Controllers`, we group them by Business Domain (Module).

```text
app/
├── Domains/
│   ├── MasterData/
│   │   ├── Models/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Repositories/
│   │   └── Requests/
│   ├── Sewing/
│   │   ├── Models/
│   │   ├── Controllers/
│   │   ├── Services/      <-- Complex logic (e.g. Redis queues) goes here
│   │   └── Jobs/          <-- Background workers for fast scanning
│   └── QC/
├── Support/               <-- Global helpers, traits, and utilities
```

### 2.2. The Service-Repository Pattern
- **Controllers:** Must be "Skinny". They only handle HTTP requests, call a Service, and return a JSON response. NO business logic in controllers.
- **Services:** Contain the actual business rules (e.g., checking if DHU is > 5%).
- **Repositories:** Contain the raw Database Queries (`DB::table(...)` or Eloquent calls).

### 2.3. API Routing Versioning
```text
routes/
├── api/
│   ├── v1/
│   │   ├── master_data.php
│   │   ├── sewing.php
│   │   ├── packing.php
│   │   └── export.php
```

---

## 3. Frontend Structure (React)

### 3.1. Feature-Based Architecture
Group files by feature rather than type. This keeps related code together.

```text
src/
├── features/
│   ├── Dashboard/
│   ├── QualityControl/
│   │   ├── components/      <-- UI components specific to QC (e.g., SVG Body Map)
│   │   ├── hooks/           <-- Custom hooks (e.g., useDefectScanner)
│   │   ├── api/             <-- API calls using TanStack Query
│   │   └── index.jsx        <-- Main Entry Point
│   └── Packing/
├── components/
│   └── ui/                  <-- Reusable global UI (Buttons, Modals, Inputs)
├── store/                   <-- Zustand / Redux global states
├── utils/                   <-- Helper functions (e.g., formatCurrency, dateUtils)
└── assets/                  <-- Images, global CSS
```

---

## 4. Naming Conventions (Strict)

### 4.1. Database & Backend
- **Database Tables:** `snake_case`, plural. (e.g., `single_piece_qrs`, `sewing_logs`).
- **Models:** `PascalCase`, singular. (e.g., `SinglePieceQr`, `SewingLog`).
- **Controllers:** `PascalCase` ending with `Controller`. (e.g., `QCScanController`).
- **API Endpoints:** `kebab-case`, plural nouns. (e.g., `POST /api/v1/sewing-logs`).

### 4.2. Frontend
- **Components:** `PascalCase`. (e.g., `DefectMap.jsx`, `ScannerInput.tsx`).
- **Functions/Hooks:** `camelCase`. (e.g., `useScanner()`, `submitBatch()`).
- **CSS Classes:** `kebab-case` (standard Tailwind format).

---

## 5. Coding Principles
1. **Fat Models, Skinny Controllers:** Keep HTTP logic separate from business rules.
2. **Fail Fast:** Always validate inputs at the very beginning of the Controller/Service. If wrong, throw a `422 Unprocessable Entity` immediately.
3. **Database Transactions:** Any operation touching more than one table (e.g., Packing a Carton, Issuing Inventory) MUST be wrapped in a `DB::transaction()`.
