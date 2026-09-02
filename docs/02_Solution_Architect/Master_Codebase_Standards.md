# Master Codebase Standards, Folder Structure & Coding Conventions
**Project:** RMG Woven Garments Traceability Software  
**Architecture:** Domain-Driven Design (DDD) + Clean API-First + Offline-First Architecture  
**Enforcement Level:** Strict (Mandatory across all 12 modules)

---

## 1. Directory & Folder Hierarchy Standard

### 1.1. Backend Directory Structure (`/backend`)
The backend strictly follows a **Modular / Domain-Driven Design (DDD)** pattern within `app/Domains/`. No business logic or feature models may be placed inside the global `app/Models` or `app/Http/Controllers`.

```text
backend/
├── app/
│   ├── Domains/                               <-- 12 Official Business Modules
│   │   ├── AuthAdmin/                         <-- Module 01: Auth & User Administration
│   │   │   ├── Models/                        <-- Eloquent Models with HasUuids & SoftDeletes
│   │   │   │   ├── User.php
│   │   │   │   ├── Device.php
│   │   │   │   └── AuditLog.php
│   │   │   ├── Repositories/                  <-- Raw queries & Eloquent DB access
│   │   │   │   ├── UserRepository.php
│   │   │   │   └── DeviceRepository.php
│   │   │   ├── Services/                      <-- Business Rules & DB::transaction logic
│   │   │   │   ├── AuthService.php
│   │   │   │   └── DeviceAuthService.php
│   │   │   ├── Controllers/                   <-- Skinny Controllers (HTTP in -> JSON out)
│   │   │   │   ├── AuthController.php
│   │   │   │   └── UserController.php
│   │   │   ├── Requests/                      <-- Form Request Validation Rules
│   │   │   ├── Resources/                     <-- API Resource JSON Transformers
│   │   │   └── Events/ / Listeners/           <-- Domain-specific events
│   │   │
│   │   ├── MasterData/                        <-- Module 02: Buyers, Styles, Lines, Attributes
│   │   ├── Orders/                            <-- Module 03: POs & BOM Costing
│   │   ├── Planning/                          <-- Module 04: Production Loading & IE Routing
│   │   ├── Cutting/                           <-- Module 05: Lays, Bundles & Piece QRs
│   │   ├── ValueAddition/                     <-- Module 06: Print / Embroidery Dispatch
│   │   ├── Sewing/                            <-- Module 07: Offline-First Tablet Telemetry & WIP
│   │   ├── QC/                                <-- Module 08: Inspection, Body Map & DHU
│   │   ├── Washing/                           <-- Module 09: Wash Batch & Finishing QC
│   │   ├── Packing/                           <-- Module 10: Carton Packing & Shipment
│   │   ├── Store/                             <-- Module 11: Double-Entry Fabric & Trims Ledger
│   │   └── Analytics/                         <-- Module 12: Executive BI & Traceability
│   │
│   ├── Support/                               <-- Global Shared Traits, Enums & Helpers
│   │   ├── Traits/                            <-- AuditableTrait, ApiResponseTrait
│   │   └── Enums/                             <-- Global Status Enums (e.g. GarmentStatus)
│   └── Providers/                             <-- Service Providers & Route Registrars
│
├── database/
│   ├── migrations/                            <-- Versioned Timestamped Migrations
│   └── seeders/                               <-- Deterministic Database Seeders
│
├── routes/
│   └── api/
│       └── v1/                                <-- Module-specific route files
│           ├── auth.php
│           ├── master_data.php
│           ├── sewing.php
│           └── ...
└── tests/
    ├── Feature/                               <-- Domain Feature Test Suites
    └── Unit/                                  <-- Service & Isolated Logic Unit Tests
```

---

### 1.2. Frontend Directory Structure (`/frontend`)
The frontend follows a **Clean Component & Domain-Driven Modular Structure** for Desktop Web Admin and Floor Tablet interfaces.

```text
frontend/
├── src/
│   ├── components/
│   │   ├── common/                            <-- Reusable UI (DataTable.jsx, Modal.jsx, Badge.jsx)
│   │   └── layout/                            <-- App Shells (AdminLayout.jsx, TabletLayout.jsx)
│   │
│   ├── modules/ / features/                   <-- Feature-specific screens & sub-components
│   │   ├── AuthAdmin/
│   │   ├── MasterData/
│   │   ├── Orders/
│   │   ├── Cutting/
│   │   ├── Sewing/
│   │   ├── QC/
│   │   └── ...
│   │
│   ├── pages/                                 <-- Page Routing View Entrypoints
│   │   ├── HomePage.jsx                       <-- Public Portal / Discovery
│   │   ├── LoginPage.jsx                      <-- Clean Admin Login Screen
│   │   └── AdminConsolePage.jsx               <-- Hub for 12 ERP Modules
│   │
│   ├── store/                                 <-- Zustand Global State Stores
│   │   ├── authStore.js                       <-- Token, User, Multi-Identifier Auth
│   │   └── themeStore.js                      <-- Global Dark / Light Mode Sync
│   │
│   ├── api/                                   <-- Centralized Axios / TanStack API clients
│   ├── assets/                                <-- Static SVGs, logos, icons
│   └── utils/                                 <-- Date formatters, QR parsers, Number utils
```

---

## 2. Strict Naming Conventions

### 2.1. Backend (PHP / Laravel 13)
| Artifact Type | Convention | Example | Description |
| :--- | :--- | :--- | :--- |
| **Database Table** | `snake_case` (Plural) | `users`, `single_piece_qrs`, `sewing_logs` | All tables use UUID primary keys & timestamps |
| **Model Class** | `PascalCase` (Singular) | `User`, `SinglePieceQr`, `Buyer` | Extends Eloquent with HasUuids |
| **Controller** | `PascalCase` + `Controller` | `UserController`, `StyleController` | Skinny controller pattern |
| **Service Class** | `PascalCase` + `Service` | `AuthService`, `CuttingService` | Holds all core business logic & transactions |
| **Repository Class** | `PascalCase` + `Repository` | `UserRepository`, `PoRepository` | Holds direct DB / query builder logic |
| **Form Request** | `PascalCase` + `Request` | `CreateUserRequest`, `StorePoRequest` | Form validation & authorization rules |
| **API Endpoints** | `kebab-case` (Plural) | `GET /api/v1/master-buyers`, `POST /api/v1/users` | RESTful API standard |
| **Migration File** | `YYYY_MM_DD_HHMMSS_action_table.php` | `2026_08_31_130453_add_emp_id_to_users_table.php` | Strictly version-controlled |

### 2.2. Frontend (React / JavaScript / Tailwind)
| Artifact Type | Convention | Example | Description |
| :--- | :--- | :--- | :--- |
| **Component File** | `PascalCase.jsx` | `DataTable.jsx`, `AdminLayout.jsx`, `LoginPage.jsx` | Functional React components |
| **Zustand Store** | `camelCaseStore.js` | `authStore.js`, `themeStore.js` | State management stores |
| **Hook Function** | `use` + `PascalCase` | `useAuthStore()`, `useDebounce()` | Custom React hooks |
| **Utility Helper** | `camelCase.js` | `formatCurrency()`, `parseBarcode()` | Pure helper functions |
| **CSS Classes** | `kebab-case` | `bg-slate-950`, `text-blue-600` | TailwindCSS utility classes |

---

## 3. Mandatory Architectural Patterns & Best Practices

### 3.1. Skinny Controllers, Fat Services & Repositories
1. **Controllers MUST NOT execute raw database queries or complex calculations.**
2. **Services handle orchestration:** Validation checking, firing events, and business rules.
3. **Strict DB Transactions:** Any operation modifying multiple tables MUST be wrapped in `DB::transaction()` to ensure strict integrity.

```php
// Good Practice (Service Example):
public function createOrder(array $data, User $actor): Order
{
    return DB::transaction(function () use ($data, $actor) {
        $order = $this->orderRepo->create($data);
        $this->bomRepo->generateDefaultBom($order->id);
        $this->auditRepo->log('CREATE_ORDER', $actor, ['order_id' => $order->id]);
        return $order;
    });
}
```

### 3.2. Mandatory Soft Deletes & UUIDs
- Every domain table in PostgreSQL uses **UUID Primary Keys (`$table->uuid('id')->primary()`)**.
- Master data and core records must include **`$table->softDeletes()`** to prevent irreversible data loss.

### 3.3. Standardized JSON API Response Format
All backend API responses must adhere to the standard envelope:
```json
{
  "status": "success",
  "message": "Resource created successfully",
  "data": { ... }
}
```
Validation errors return HTTP 422:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "emp_id": ["The employee ID has already been taken."]
  }
}
```

### 3.4. Frontend UI/UX Standards
1. **No Gradient Buttons:** Buttons MUST use flat, crisp, solid colors (e.g. `bg-blue-600 hover:bg-blue-700 text-white`).
2. **Unified Data Table:** Tabular data MUST be rendered through [`DataTable.jsx`](file:///g:/ERP/rmg-tracibility/frontend/src/components/common/DataTable.jsx).
3. **No Full Page Reloads for Feedback:** Feedback MUST be given using `react-hot-toast` notifications.
4. **All UI Text in English:** All labels, buttons, tooltips, and table headers MUST be in English.
5. **Multi-Identifier Authentication:** Support Employee ID, Username, and Email.

---

*(End of Master Standards Document)*
