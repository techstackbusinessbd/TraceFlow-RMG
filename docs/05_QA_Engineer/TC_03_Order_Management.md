# Test Cases: Module 03 (Order Management)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: PO Mathematical Validation (Negative Boundary)
- **Step 1:** Start creating a new PO. Total Quantity = 5000.
- **Step 2:** Fill the color/size breakdown grid where the sum equals 4999.
- **Step 3:** Click Save.
- **Expected Result:** API returns 422. Form blocks saving. Error message: "The sum of breakdowns (4999) does not match total_qty (5000)."

## 2. Test Case: Cascading Dropdowns (Positive)
- **Step 1:** Select "H&M" from the Buyer dropdown.
- **Expected Result:** The Style dropdown unlocks and ONLY shows styles registered under H&M. Zara styles must not be visible.

## 3. Test Case: File Upload Limit (Negative)
- **Step 1:** Select a 12MB PDF file in the Tech Pack uploader.
- **Expected Result:** UI blocks the upload immediately before calling the API. Error toast: "File size exceeds 10MB limit."

## 4. Test Case: Status Lock Enforcement (Security Bypass)
- **Step 1:** Using Postman, take a PO ID that has the status `Confirmed` AND has existing entries in the `cut_registers` table.
- **Step 2:** Send a PUT request attempting to change the `total_qty`.
- **Expected Result:** API strictly returns `403 Forbidden` with message "Cannot edit PO. Cutting process has already started."
