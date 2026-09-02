# Module 11: UI/UX Specifications (Store Tablet App)
**Role:** Frontend Developer
**Status:** Approved

## 1. The 2-Step Forklift UI
- **The Challenge:** Operators driving forklifts have limited attention. The UI must guide them sequentially.
- **Step 1:** Big prompt: "Scan Carton QR".
  - (User scans carton). UI shows a green checkmark and loads Step 2.
- **Step 2:** Big prompt: "Scan Bin QR".
  - (User scans rack sticker). 
- **Confirmation:** UI flashes green: "Stored in Rack-A!" and immediately resets to Step 1.

## 2. Inventory Alert UI
- In the Raw Materials issue screen, if the user types a quantity greater than the available balance, the input field border turns red, and the "Issue" button disables automatically (client-side validation before hitting the API).
