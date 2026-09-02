# Module 02: UI/UX Specifications (Master Data)
**Role:** Frontend Developer
**Status:** Approved

## 1. Web Admin Interface (React.js)
- **Data Table:** Use a server-side paginated Data Grid (e.g., TanStack Table). 
- **Columns:** Buyer Name, Country, Status, Actions (Edit, Delete).
- **Search & Filter:** Global search input with 300ms debounce. Dropdown filter for `Status` (Active/Inactive).

## 2. Form UI (Modals)
- "Add Buyer" should open in a sliding side-drawer or a centered Modal, NOT a new page.
- **Validation UI:** 
  - Show red border around inputs with errors.
  - Display error messages exactly as returned from the API `422` response.
- **Save Button:** Must show a spinning loader while the API call is in progress. Disable the button to prevent double-clicks.

## 3. Offline Mode Note
- Master data forms do NOT need offline support. They require a stable internet connection as they are configured from the central office, not the factory floor.
