# Global UI/UX Design System & Guidelines
**Role:** Frontend Developer / UI/UX Designer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
The RMG Traceability Software has two completely different user bases: 
1. **Factory Floor Operators** (Sewing, QC, Packing) using 10-inch Android Tablets in harsh, bright environments.
2. **Management & Buyers** (HQ) using high-resolution desktop monitors to view dense analytics.
This document ensures a consistent, accessible, and fast UI across all 12 modules.

---

## 2. Global Design System (TailwindCSS)

### 2.1. Color Palette
We will use a strict, limited color palette to reduce cognitive load.
- **Primary Brand Color:** Indigo (`bg-indigo-600` for buttons, `text-indigo-900` for headings).
- **Success (Pass):** Green (`bg-emerald-500`). Used when a QR scan is successful or a piece passes QC.
- **Error (Reject/Mismatch):** Red (`bg-red-600`). Used for critical errors, rejected pieces, or wrong destination scans.
- **Warning (Alter):** Yellow/Amber (`bg-amber-500`). Used for garments needing alteration.

### 2.2. Typography
- **Font Family:** `Inter` or `Roboto` (sans-serif) for high legibility on small tablet screens.
- **Data Tables:** Must use tabular/monospaced numbers so digits align perfectly vertically.

---

## 3. Tablet-First UI Rules (Factory Floor)
Modules like 04 (Cutting), 06 (Sewing), 07 (QC), 09 (Packing), and 12 (Export) rely heavily on Tablets.

### 3.1. Touch Targets & Accessibility
- **Rule:** ALL clickable elements (Buttons, Dropdowns, Toggles) MUST have a minimum size of **44x44 pixels**. Operators wear gloves or are moving fast; tiny buttons cause misclicks.
- **Spacing:** Use generous padding (`p-4` or `p-6` in Tailwind) around interactive elements.

### 3.2. Extreme Visual Feedback
In a noisy factory, operators might not look closely at the screen.
- **Success Scan:** The screen borders flash Green for 0.5 seconds.
- **Critical Error (e.g., Wrong Buyer Carton):** The ENTIRE SCREEN background turns solid Red, accompanied by a loud siren noise. The operator must physically tap an "Acknowledge" button to dismiss the red screen.

### 3.3. High-Contrast / Dark Mode
- The Export Loading Dock (Module 12) is often under bright sunlight. The UI must support a High-Contrast Dark Mode (White text on Pitch Black background) to ensure readability.

---

## 4. Web Dashboard UI Rules (Management / HQ)
Modules like 01 (Master Data), 02 (Order Mgmt), and BI Analytics.

### 4.1. Data Density
- Use data tables with dense padding (`py-2 px-3`) to show as much information (POs, Quantities, Status) as possible on a single 1080p screen without excessive scrolling.
- Use Sticky Headers for all tables.

### 4.2. Action Placement
- "Create" or "Export" buttons always go on the Top-Right of the page header.
- "Edit" or "Delete" actions go on the far-right column of a data table.

---
*(End of UI/UX Guidelines)*
