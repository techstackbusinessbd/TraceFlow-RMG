# Module 03: UI/UX Specifications (Order Management)
**Role:** Frontend Developer
**Status:** Approved

## 1. Dynamic Matrix Input Grid
- **The Challenge:** Users hate adding 50 rows one by one.
- **Solution:** Create an Excel-style dynamic grid.
  - The user selects colors (e.g., Red, Blue) using a multi-select dropdown.
  - The user selects sizes (e.g., S, M, L).
  - The UI automatically generates a grid (Rows = Colors, Columns = Sizes).
  - The user types numbers directly into the cells.
- **Live Counter:** At the bottom of the grid, show a live sum of all cells. E.g., `Total Input: 950 / 1000`. Color the text Red if it doesn't match, Green if it exactly matches.

## 2. File Upload UI
- Use a Drag-and-Drop zone (e.g., React Dropzone).
- Restrict file types strictly to `.pdf, .jpg, .png` in the HTML `accept` attribute.
- Show a progress bar indicating upload status.
