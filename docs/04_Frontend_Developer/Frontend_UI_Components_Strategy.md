# Frontend UI Components Strategy (React)
**Role:** Frontend Developer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To maintain a 100% consistent User Experience (UX) across all 12 modules, all frontend developers MUST use the exact same libraries and implementations for Data Tables, Notifications, and Confirmation Modals. Do not introduce custom plugins without architect approval.

---

## 2. Standard Enterprise DataTable (`src/components/common/DataTable.jsx`)

To ensure 100% uniformity across all 12 modules, all tabular data (Buyers, Styles, Orders, Bundles, Sewing Telemetry, QC Logs, Users, etc.) **MUST** use the unified `<DataTable />` component. Hardcoding raw `<table>` tags is strictly prohibited.

### 2.1. Core Features of `<DataTable />`
1. **Interactive Column Sorting:** Clicking on sortable column headers toggles `Ascending (▲)` -> `Descending (▼)` -> `Default` with visible icon indicators.
2. **Dynamic Pagination:** Supports configurable page sizes (`5`, `10`, `25`, `50`, `100` rows per page), page number indicators, and `Prev`/`Next` controls.
3. **Instant Search & Custom Filters:** Real-time multi-field search input with support for custom dropdown filter slots (e.g. Buyer filter, Role filter, Date range).
4. **1-Click CSV Export:** Built-in spreadsheet export generating timestamped `.csv` files matching filtered data.
5. **Loading & Empty State:** Unified spinner loader and customizable empty state messages.
6. **Strict Micro Corner Radius:** Strictly uses `rounded-md` (6px) and `border-slate-200/90` to maintain a sharp enterprise industrial look.

### 2.2. Component Props Interface & Example Usage

```jsx
import { DataTable } from '../../components/common/DataTable';

const columns = [
  { key: 'style_no', label: 'Style No', sortable: true, className: 'font-bold text-slate-900' },
  { key: 'buyer_name', label: 'Buyer', sortable: true, render: (row) => row.buyer?.name || '—' },
  { key: 'category', label: 'Category', sortable: true, render: (row) => <Badge variant="primary">{row.category}</Badge> },
  { key: 'base_smv', label: 'Base SMV', sortable: true, align: 'right', render: (row) => `${row.base_smv} min` },
  { key: 'actions', label: 'Actions', sortable: false, align: 'right', render: (row) => (
      <button onClick={() => handleEdit(row)}>Edit</button>
    ) 
  },
];

<DataTable
  columns={columns}
  data={stylesList}
  loading={isLoading}
  searchPlaceholder="Search style no, buyer, category..."
  exportFileName="rmg-styles-catalog"
  customFilters={<BuyerFilterDropdown />}
  customActions={<AddNewButton />}
/>
```

---

## 3. Toast Notifications (`react-hot-toast`)
Whenever a user performs an action (e.g., Saves a PO, Scans a Carton), they must receive immediate visual feedback.

### 3.1. Rules
- **Library:** Use `react-hot-toast`.
- **Position:** `top-right` for desktop dashboard, `top-center` for Factory Tablets.
- **Duration:** Auto-hide after 3000ms (3 seconds).

### 3.2. Types of Toasts
- **Success:** `toast.success('PO Created Successfully!')` -> Shows a green checkmark icon.
- **Error:** `toast.error('Scan Failed: Wrong Destination')` -> Shows a red cross icon.
- **Promise:** Use `toast.promise` for async API calls so the user sees a loading spinner while waiting for the server response.

---

## 4. Confirmation Modals (`SweetAlert2` / Custom Dialog)
Critical actions must NEVER happen with a single click.

### 4.1. The "Are You Sure?" Rule
If a user clicks a "Delete", "Reject", or "Force Close" button, the system MUST intercept the click and show a Confirmation Modal.

### 4.2. Implementation
- **Library:** Use `SweetAlert2` (React version) for quick, beautiful alerts, or Headless UI `<Dialog>`.
- **Warning Color:** The confirm button on the modal MUST be Red (`bg-red-600`) to indicate a destructive action.
- **Example Flow:**
  1. User clicks "Delete Buyer".
  2. SweetAlert modal pops up: *"Are you sure you want to delete this buyer? This action cannot be undone."*
  3. User clicks "Yes, Delete" -> Triggers API call -> Shows Success Toast.

---

## 5. Form Validation (`React Hook Form` + `Zod`)
- Do not use standard React controlled inputs (e.g., `useState` for every field) as it causes excessive re-renders on large forms.
- Use `React Hook Form` for performance.
- Use `Zod` (or `Yup`) for schema validation. Error messages must appear directly beneath the input field in red (`text-red-500`).

---
*(End of UI Components Strategy)*
