# Custom Admin Panel UI/UX Specification
**Role:** Frontend Developer / UI/UX Designer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
Since we are building a 100% Custom React Admin Panel (avoiding third-party tools like Filament), this document serves as the strict design blueprint. The goal is to create a clean, modern SaaS-like dashboard (inspired by Vercel/Stripe) that is highly performant and user-friendly for Factory Managers and Super Admins.

---

## 2. Layout Structure

### 2.1. The App Shell (Topbar-Module & Contextual 2-Level Sidebar)
- **Background:** The main content area must have a soft off-white background (`bg-gray-50` or `bg-slate-50`) to reduce eye strain, with content cards being pure white (`bg-white`).
- **Top Navbar (Horizontal Main Module Bar):**
  - Fixed at the top (`h-16 w-full bg-slate-900 border-b border-slate-800 z-40`).
  - Houses the **Main Modules** horizontally (e.g. Orders & BOM, Warehouse, Cutting, Sewing, QC, Finishing, Packing, Export, Admin).
  - Highlights active module with crisp solid blue (`bg-blue-600 text-white font-bold`).
  - Right utilities: Breadcrumbs, Global Omni-Search (`Ctrl+K`), Alerts bell, and User profile dropdown.
- **Left Sidebar (Contextual Sub-Modules & Features):** 
  - Fixed on the left (`w-64 h-[calc(100vh-64px)] top-16 bg-slate-950 text-slate-100`).
  - Dynamically renders **only the submodules and features belonging to the selected Topbar Module**.
  - **Strictly 2-Level Supported Structure:**
    1. **Level 1 (Sub-Module / Feature Group):** e.g., `Material Receiving`, `Fabric Quality (QC)`, `Trims Inventory`. Clicking expands/collapses the group.
    2. **Level 2 (Leaf Action / Page Route):** e.g., `ASTM 4-Point QC`, `Relaxation Chamber`, `Shade Banding`. Clicking navigates directly to that full-screen page.
  - **No 3rd-Level Dropdowns:** To avoid dropdown fatigue and maintain touch-friendliness, deep sub-views are handled strictly via **In-Page Horizontal Tabs** inside the page.
  - Active route highlighted in solid blue (`bg-blue-600 text-white font-semibold`).

### 2.2. Responsiveness
- On screens smaller than `1024px` (Tablets/Mobiles), the Left Sidebar hides automatically and converts into a "Hamburger Drawer" triggered from the Top Navbar.
- Touch target height: Minimum 44px for tablet floor operators.

---

## 3. Data Tables (Custom React Tables)
Tables are the heart of the Admin Panel. We will use a library like `@tanstack/react-table` styled with TailwindCSS.

### 3.1. Required Table Features
Every data table (e.g., Buyers List, PO List, User List) MUST have:
1. **Global Search:** A search bar at the top right of the table.
2. **Column Sorting:** Clicking on column headers (e.g., "Created At") toggles ASC/DESC sorting.
3. **Pagination:** Server-side pagination at the bottom (`Show 10/25/50 per page`).
4. **Action Menu:** Instead of cluttering the table with "Edit" and "Delete" buttons, place a `Three-dot (⋮)` dropdown menu on the far-right column of every row.

---

## 4. Forms & Modals

### 4.1. Modals (Slide-overs / Dialogs)
- **Rule:** For simple data entry (e.g., adding a new Color, Size, or Factory Line), do NOT navigate to a new page.
- **Action:** Open a Centered Modal or a Right-Side Slide-over. This keeps the user in their current context.

### 4.2. Full-Page Forms
- **Rule:** For complex data entry (e.g., creating a new PO with multiple nested fields like BOM), navigate to a dedicated full-page form (`/admin/po/create`).

### 4.3. Form Validation & Feedback
- **Validation Errors:** Must appear immediately below the input field in red text (`text-red-500 text-sm`). The input border should also turn red.
- **Success Toasts:** Upon successful submission, show a green Toast notification at the top-right corner (e.g., "Buyer created successfully") and automatically close the modal.

---
*(End of Admin Panel UI/UX Spec)*
