# Module 04: UI/UX Specifications (Production Planning)
**Role:** Frontend Developer
**Status:** Approved

## 1. Gantt Chart / Calendar View
- IE teams visualize planning on a timeline. Use a library like `FullCalendar` or `Frappe Gantt`.
- **Y-Axis:** Sewing Lines (Line 1, Line 2, Line 3).
- **X-Axis:** Dates.
- **Blocks:** PO Numbers span across the dates.
- **Interactivity:** IE Manager can drag and drop a PO block to change dates. Dropping triggers the `POST /api/v1/planning/calculate` API to check for conflicts instantly.

## 2. Material Shortage Warning Modal
- When locking a plan, if the API returns `status: "warning"`, immediately pop open a Red Warning Modal.
- The Modal must have an input field: "Enter Manager PIN to Override".
- Submit button text: "Force Lock Plan". Color: Danger Red.
