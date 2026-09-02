# Design System & Styling Tokens
**Role:** Frontend Developer / UI Designer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To prevent UI fragmentation and ensure a premium, SaaS-level aesthetic for the Custom Admin Panel, all Frontend Developers MUST strictly adhere to these Design Tokens. We will utilize **TailwindCSS** as our utility framework. Do not use random hex codes or arbitrary spacing classes.

---

## 2. Typography

### 2.1. Font Family
- **Primary Font:** `Inter` (Google Fonts). It provides a clean, highly legible interface suitable for data-heavy dashboards.
- *Tailwind Config:* Add `'Inter', sans-serif` as the default `sans` font.

### 2.2. Font Sizes & Weights
Because the admin panel is data-dense, our base font size is slightly smaller than a standard marketing website.
- **Base Text (Body/Tables):** `text-sm` (14px), `font-normal`.
- **Small Text (Labels/Hints):** `text-xs` (12px), `font-medium`.
- **Card Titles:** `text-lg` (18px), `font-semibold`.
- **Page Titles:** `text-2xl` (24px), `font-bold`.

### 2.3. UI/UX Language Standard (Strict 100% English Rule)
- **Mandatory UI Language:** All User Interfaces (UI/UX) across Web, Tablets, Mobile and PDA scanners MUST use **100% English** for:
  - Button texts, Navigation menus, Table headers, Form labels, Validation errors, Placeholders, KPI widgets, Tooltips, and Toast notifications.
- **Prohibition:** No Bengali/Bangla text should appear inside the user-facing application UI components, headers, or buttons. (Conversations with project stakeholders remain in Bengali, but all codebase UI copy is English-only).

---

## 3. Color Palette (Tailwind Tokens)

### 3.1. Primary Brand & Action Buttons (Solid Colors Only)
All buttons throughout the application MUST use flat, crisp, solid colors. **Gradients (e.g., `bg-gradient-to-r`) are strictly prohibited** for buttons across all pages and modules.
- **Primary Button (Default):** `bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium`
- **Secondary Button:** `bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700` (Dark) / `bg-white hover:bg-slate-100 text-slate-800 border border-slate-300` (Light)
- **Active Menu Item:** `bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400`
- **Focus Ring:** `focus:ring-2 focus:ring-blue-500 focus:outline-none`
- **🚫 Button Rule:** No gradient fills (`bg-gradient-to-*`) on any interactive buttons. Keep styling clean, industrial, and enterprise-grade.

### 3.2. Surface & Backgrounds (Slate/White)
- **App Background:** `bg-slate-50` (Off-white/light gray to reduce eye strain).
- **Cards & Modals:** `bg-white` (Pure white to contrast against the app background).
- **Table Headers:** `bg-slate-100`.

### 3.3. Text Colors
- **Headings (H1-H6):** `text-slate-900` (Almost black).
- **Body / Subtitles:** `text-slate-600` (Dark gray).
- **Disabled Text:** `text-slate-400`.

### 3.4. Semantic / Status Colors
Used strictly for Badges, Alerts, and Toasts.
- **Success (Pass/Complete):** `text-emerald-700 bg-emerald-100` (Buttons: `bg-emerald-600`).
- **Danger (Fail/Reject/Delete):** `text-red-700 bg-red-100` (Buttons: `bg-red-600`).
- **Warning (Pending/Hold):** `text-amber-700 bg-amber-100`.

---

## 4. Spacing, Layout & Shapes

### 4.1. Spacing (Paddings & Gaps)
- **Card Padding:** `p-6` (24px) for desktop, `p-4` (16px) for mobile.
- **Element Gap:** `gap-4` (16px) between buttons or form fields.

### 4.2. Borders & Corner Radius (Strict Industrial Standard)
To ensure a compact, sharp, enterprise-grade industrial ERP appearance:
- **Buttons, Badges & Small Inputs:** `rounded` (4px) or `rounded-md` (6px).
- **Cards, KPI Blocks, Tables & Containers:** `rounded-md` (6px) or `rounded-lg` (8px max).
- **Border Color:** `border border-slate-200/90`.
- **🚫 Prohibited:** `rounded-xl`, `rounded-2xl`, `rounded-3xl` (24px+) are strictly banned on Web UI to avoid toyish/overly rounded look.

### 4.3. Shadows
- **Cards & Tables:** `shadow-2xs` or `shadow-xs`.
- **Modals & Dropdowns:** `shadow-md`.

---
*(End of Design System Tokens)*
