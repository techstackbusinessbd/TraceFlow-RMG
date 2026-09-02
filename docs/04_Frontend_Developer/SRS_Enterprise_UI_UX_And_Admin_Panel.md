# SRS: Enterprise UI/UX & Custom Admin Panel Specification
**Document ID:** SRS-UIUX-001  
**Version:** 3.0 (Enterprise Benchmark: SAP Fiori / MS Dynamics 365 / Vercel Enterprise)  
**Author:** Solution Architect & Lead UI/UX Engineer  
**Status:** Approved for Implementation  
**Target Platform:** Web Portal (SPA) & Tablet/PDA Edge Clients  

---

## 1. Executive Summary & Design Philosophy

TraceFlow RMG is an industrial-grade, mission-critical Garment Traceability and ERP platform designed to track garments from raw fabric yarn/roll inward to container freight dispatch. The frontend user interface serves diverse stakeholders ranging from C-Suite Executives requiring high-level strategic BI, Merchandisers managing complex BOMs, to Factory Floor Operators scanning bundle tickets in noisy, high-paced assembly lines.

### 1.1. Core Architectural Pillars
1. **Zero-Modal Architecture (STRICT):** Modals, popups, and modal dialogs are STRICTLY PROHIBITED across all modules. Modals break browser history, hide contextual data, cause keyboard trap issues, and perform poorly on industrial tablets. All creations, edits, inspections, and reports load as **full-screen dedicated pages/views** with breadcrumbs and persistent state.
2. **Pure Server-Side Validation Standard:** Forms MUST specify `<form noValidate>` to disable native browser popup tooltips. All validation rules originate on the backend and return RFC 7807 `HTTP 422 JSON Problem Details`. Field-level errors render directly beneath the corresponding inputs.
3. **Dual Enterprise Theming:** The application natively supports **Corporate Light Mode** (daytime merchandising and office administration) and **Midnight Dark Mode** (industrial floor, TV displays, low-light environments) with instant, non-flicker toggle.
4. **Flat, Crisp Solid Styling (ZERO Gradients):** Buttons and action controls MUST use solid, flat colors (`#2563EB` blue, `#16A34A` emerald, `#DC2626` rose). Gradient buttons are strictly prohibited.
5. **100% English UI:** All labels, button texts, table headers, validation error strings, and telemetry tags MUST be in 100% English.
6. **Sub-100ms Interaction Latency:** Instant response to user keystrokes, tab navigation, and hardware barcode scans.

---

## 2. Navigation Architecture V3.0 (Topbar + Contextual 2-Level Sidebar)

```
+---------------------------------------------------------------------------------------------------------+
| [LOGO] TraceFlow RMG  | [MOD-01 Admin] [MOD-02 Master] ... [MOD-14 Warehouse] [MOD-15 Comm] | [Sun/Moon] [User] [Sign Out] | (H-16 Topbar)
+---------------------------------------------------------------------------------------------------------+
|  CONTEXTUAL SIDEBAR   |  BREADCRUMBS: TraceFlow > Warehouse > Fabric Inward > Material Receiving (MRR)   | (H-10 Breadcrumb)
|  (Dynamic per Module) +---------------------------------------------------------------------------------+
|                       |                                                                                 |
|  [LEVEL 1: CATEGORY]  |  [IN-PAGE HORIZONTAL TABS]: [Overview] [Active MRRs] [New Receiving] [Ledger]  |
|  Fabric Inward        |                                                                                 |
|  - MRR Entry          |  MAIN FULL-SCREEN WORKSPACE VIEWPORT                                            |
|  - Roll Barcode Reg   |  - High-Density Data Grid / Form                                                |
|  - ASTM 4-Point QC    |  - Dedicated Master-Detail Panels (No Modals)                                  |
|  - Relaxation Matrix  |  - Pure Server Validation Real-Time Error Display                               |
|                       |                                                                                 |
|  [LEVEL 1: CATEGORY]  |                                                                                 |
|  Trims Management     |                                                                                 |
|  - Stock Ledger       |                                                                                 |
|  - Bin Putaway        |                                                                                 |
+---------------------------------------------------------------------------------------------------------+
```

### 2.1. Topbar (Horizontal Master Module Switcher)
- **Dimensions:** Fixed height of `64px` (`h-16`), sticky at top (`z-50`).
- **Brand Identity:** High-contrast shield icon with company branding.
- **15 Dedicated Module Tabs:**
  1. `MOD-01`: System Admin & Auth
  2. `MOD-02`: Master Data
  3. `MOD-03`: Order Management
  4. `MOD-04`: Production Planning
  5. `MOD-05`: Cutting & CAD
  6. `MOD-06`: Printing Plant
  7. `MOD-07`: Embroidery Plant
  8. `MOD-08`: Subcontracting Governance
  9. `MOD-09`: Sewing Floor Tracking
  10. `MOD-10`: Quality Control (AQL & DHU)
  11. `MOD-11`: Washing Plant
  12. `MOD-12`: Garment Finishing
  13. `MOD-13`: Packing & PSI Inspection
  14. `MOD-14`: Fabric & Trims Warehouse
  15. `MOD-15`: Commercial Export & BI
- **Visual State:**
  - Inactive: `bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800`
  - Active: Flat solid blue `bg-blue-600 text-white font-semibold shadow-sm`
- **Right Utilities:**
  - Instant Theme Toggle Switch (Sun/Moon).
  - User identity badge (Employee Name + Assigned Role).
  - Solid Flat Red Sign Out button (`btn-solid-red`).

### 2.2. Contextual 2-Level Left Sidebar
- **Behavior:** The sidebar dynamically populates **only the submodules and routes belonging to the currently selected Topbar module**.
- **Strict 2-Level Hierarchy:**
  - **Level 1 (Submodule / Feature Group):** Bold uppercase category header (`text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider`).
  - **Level 2 (Direct Page Link):** Direct navigational link leading to a full-screen dedicated page (`text-xs font-medium px-2.5 py-2 rounded-md`). Active item highlighted with `bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-500`.
- **Elimination of Deep Dropdown Fatigue:** Dropdowns nested beyond 2 levels are strictly prohibited. Deeper sub-routes are handled by **In-Page Horizontal Tabs**.

### 2.3. Global Omni-Search Command Palette (`Ctrl + K` / `Cmd + K`)
- Keystroke shortcut `Ctrl + K` triggers an enterprise omni-search palette.
- Real-time indexing across:
  - Buyer Names & PO Numbers (e.g., `PO-2026-HNM-001`).
  - Bundle Ticket Barcodes (e.g., `BND-05-00192`).
  - Fabric Roll Numbers & MRR IDs (e.g., `MRR-2026-0045`).
  - Navigation Pages (e.g., "Jump to DHU Board").

---

## 3. Enterprise Data Grid Engine Specification

Tables represent the primary operational interface for industrial ERP workflows. All tables must implement the TraceFlow Enterprise Data Grid pattern.

```
+---------------------------------------------------------------------------------------------------------+
| [ Search records...        ] | Filter: [All Buyers v] [Status: Active v] | Columns [v] | Export: [Excel][PDF] |
+---------------------------------------------------------------------------------------------------------+
| [x] | PO NUMBER    | BUYER       | STYLE NO   | ORDER QTY | SEWING WIP | SHIP DATE   | STATUS   | ACTIONS   |
+-----+--------------+-------------+------------+-----------+------------+-------------+----------+-----------+
| [ ] | PO-2026-0881 | H&M Sweden  | HM-DENIM-9 | 15,000    | 8,420      | 2026-10-15  | RUNNING  | [View][>] |
| [ ] | PO-2026-0882 | Zara Spain  | ZR-JACKET-2| 8,500     | 2,100      | 2026-11-01  | PLANNED  | [View][>] |
+---------------------------------------------------------------------------------------------------------+
| Showing 1 - 25 of 1,480 orders | Rows per page: [25 v]                     | Page: [< Prev] [1] [2] [Next >] |
+---------------------------------------------------------------------------------------------------------+
```

### 3.1. Grid Capabilities & Standards
1. **Density Modes:**
   - **Compact Density:** Row height `36px`, font size `12px` (for high-volume inventory ledgers & roll lists).
   - **Standard Density:** Row height `48px`, font size `13px` (for commercial orders & user tables).
2. **Freeze Panes (Sticky Columns):**
   - Leftmost columns (`Checkbox`, `Identifier/PO #`) freeze horizontally during wide scrolling.
   - Rightmost column (`Actions`) freezes to ensure row operations are always accessible.
3. **Multi-Column Sorting:**
   - Single click: Ascending (`▲`).
   - Second click: Descending (`▼`).
   - Third click: Clear sort.
   - Shift + Click: Secondary sort column.
4. **Column Visibility & Reordering:**
   - A dropdown button `Columns [v]` allows users to show/hide optional columns. Preferences persist in `localStorage`.
5. **Batch Bulk Actions Bar:**
   - Selecting row checkboxes reveals an elevated batch action bar:
     - `Bulk Print QR Codes`
     - `Bulk Status Transition (e.g., Approve Selected)`
     - `Bulk Export Selected (Excel / CSV)`
6. **Streaming Server-Side Pagination:**
   - Selector for `10`, `25`, `50`, `100` items per page.
   - Total records count and current offset displayed clearly.
   - Jump-to-page input for fast navigation.

---

## 4. Forms, Validation & Pure Server-Side Standard

### 4.1. The Zero-Modal Creation/Edit Workflow
- When a user clicks `+ Create New Purchase Order` or `Edit Supplier`:
  - The application navigates to a dedicated page: `/orders/create` or `/master-data/suppliers/:id/edit`.
  - The page displays a persistent header with:
    - Clear title (`Create Purchase Order`).
    - Breadcrumb navigation (`Orders > PO Directory > Create`).
    - Fixed top-right action bar with `[Discard / Cancel]` and `[Save Purchase Order]` solid buttons.
  - **No modal overlay or slide-over drawer may be used.**

### 4.2. Pure Server-Side Validation Protocol
- Forms MUST specify `<form noValidate onSubmit={handleSubmit}>`.
- Browser native popup tooltips (HTML5 `required`, `pattern`) are strictly blocked.
- Form inputs bind directly to error states received via HTTP 422:

```tsx
// Standard Input Component Implementation
<div className="space-y-1">
  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
    Order Reference Number <span className="text-rose-500">*</span>
  </label>
  <input
    type="text"
    value={form.po_number}
    onChange={(e) => setField('po_number', e.target.value)}
    className={`w-full bg-slate-50 dark:bg-slate-950 border ${
      errors.po_number ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 dark:border-slate-800'
    } rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100`}
  />
  {errors.po_number && (
    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
      {errors.po_number[0]}
    </p>
  )}
</div>
```

### 4.3. Dirty Form Guard & Auto-Draft
- If a user modifies form fields and attempts to navigate away, the browser prompts:  
  `"You have unsaved changes. Are you sure you want to discard this record?"`
- Large forms (such as BOM entry) automatically cache unsaved inputs in `sessionStorage` every 10 seconds to prevent accidental data loss.

---

## 5. Universal Login & Role-Based Landing Architecture

### 5.1. Tri-Identifier Authentication
The universal login screen (`/login`) allows any user in the enterprise to log in using:
1. **Employee ID:** e.g., `EMP-0001`
2. **System Username:** e.g., `super.admin`
3. **Corporate Email:** e.g., `admin@traceflow.com`

### 5.2. Post-Login Dynamic Landing Precedence
Upon receiving HTTP 200 with JWT/Sanctum bearer token, the `RoleLandingEngine.ts` immediately routes the user to their functional station:

| Role Priority | Assigned Role(s) | Default Landing Workspace | Primary Activity |
| :---: | :--- | :--- | :--- |
| **P1** | `Super Admin`, `Platform Owner` | `/admin/platform-overview` | System telemetry, audit logs & fleet management |
| **P2** | `Managing Director`, `CEO`, `Chairman` | `/commercial/bi/dashboard` | Executive KPIs, revenue, OTD %, buyer margins |
| **P3** | `General Manager`, `Plant Head` | `/planning/dashboard` | Factory cut-sew schedules, capacity loading |
| **P4** | `Head of QA`, `Quality Manager` | `/qc/dhu-board` | Defect traffic lights, DHU %, alter routing |
| **P5** | `Warehouse Head`, `Fabric Store Mgr` | `/warehouse/dashboard` | Roll inventory, ASTM 4-point inspection, relaxation |
| **P6** | `CFO`, `Commercial Manager` | `/commercial/dashboard` | L/C tracking, commercial invoices, export status |
| **P7** | `Cutting Master` | `/cutting/station/bundles` | Lay planning, QR bundle ticket generation |
| **P8** | `Sewing Supervisor` | `/sewing/station/line-in` | Bundle feeding & line balancing |
| **P9** | `Floor Operator` | `/sewing/station/line-out` | Garment piece scanning & piece-rate tracking |
| **P10** | `End-Line QC Inspector` | `/qc/station/end-line` | Defect tagging & alter barcode issuance |
| **P11** | `Floor TV Device` | `/sewing/andon-display` | Full-screen live line output & DHU display |

---

## 6. Industrial Floor UX & Edge Client Specification

### 6.1. 10.1" Tablet Kiosk UI
- **Minimum Touch Targets:** `48px x 48px` for all interactive buttons and inputs.
- **High-Contrast Typography:** Large text sizes (labels `14px`, scan inputs `18px`, status counters `32px`).
- **Hardware Laser Scanner Hook:** Instant listener on hardware barcode input (WebHID / USB Wedge / Broadcast Intent). On scanning, the audio feedback sounds immediately:
  - **Success Chime (High Pitch):** Valid bundle scan (Green flash).
  - **Rejection Buzzer (Low Buzz):** Out-of-sequence scan or duplicate bundle (Red flash).
- **Offline Storage Indicator:** Displays cached records count with an amber sync indicator (`"14 scans stored locally - Syncing..."`).

### 6.2. Floor TV / Andon Display Mode
- **Zero Interactive Chrome:** Topbar and sidebar automatically collapse into 100% full-screen display mode.
- **Auto-Refresh Engine:** WebSocket listener via Laravel Reverb + 5-second polling fallback.
- **Traffic Light Alerting:**
  - **Green:** Line output on target ($\ge 95\%$).
  - **Yellow:** Line output lagging ($80\% - 94\%$).
  - **Red Flashing:** Line starved or severe defect spike ($< 80\%$ or DHU $> 5\%$).

---

## 7. WORM Visual Diff & Audit Trail Inspection UI

### 7.1. Visual Diff Viewer
Whenever an authorized auditor or manager views an audit record in `/admin/audit-vault`:
- The interface renders a side-by-side Visual Diff:

```
+-----------------------------------+-----------------------------------+
| PREVIOUS VALUE (Before Update)    | NEW VALUE (After Update)          |
+-----------------------------------+-----------------------------------+
| "order_qty": 10000                | "order_qty": 12500                |
| "unit_price": 4.50                | "unit_price": 4.50                |
| "ship_date": "2026-10-01"         | "ship_date": "2026-10-15" (RED)   |
+-----------------------------------+-----------------------------------+
```
- Immutability tag stamped on screen: `"Verified WORM Record • Cryptographically Sealed"`.

---

## 8. Enterprise Design Tokens & Palette

### 8.1. Semantic Color Tokens

| Token Name | Light Mode Value | Dark Mode Value | Usage |
| :--- | :--- | :--- | :--- |
| `surface-bg` | `#F8FAFC` (slate-50) | `#020617` (slate-950) | Main viewport background |
| `card-bg` | `#FFFFFF` (pure white) | `#0F172A` (slate-900) | Content cards, data tables |
| `border-primary` | `#E2E8F0` (slate-200) | `#1E293B` (slate-800) | Container and grid borders |
| `text-primary` | `#0F172A` (slate-900) | `#F8FAFC` (slate-50) | Primary titles and body copy |
| `text-muted` | `#64748B` (slate-500) | `#94A3B8` (slate-400) | Secondary metadata and labels |
| `accent-primary` | `#2563EB` (blue-600) | `#3B82F6` (blue-500) | Active modules, primary buttons |
| `accent-success` | `#16A34A` (emerald-600)| `#22C55E` (emerald-500)| Passed inspection, in-stock |
| `accent-danger` | `#DC2626` (rose-600) | `#EF4444` (rose-500) | Rejection, critical error |
| `accent-warning` | `#D97706` (amber-600) | `#F59E0B` (amber-500) | Alter rework, approaching delay |

### 8.2. Button Rules
- **Prohibited:** `bg-gradient-to-r`, drop-shadow glows, animated color shifts.
- **Mandatory:** Flat, crisp, high-contrast solid buttons with rounded corners (`rounded-md` or `rounded-lg`).

---

*(End of Enterprise UI/UX & Custom Admin Panel SRS Document)*
