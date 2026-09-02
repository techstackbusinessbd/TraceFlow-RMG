# Test Cases: Module 05 (Cutting)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: 5% Tolerance Boundary (Negative)
- **Step 1:** Create PO (Mod 02) with 1000 pcs (Red-M).
- **Step 2:** Go to Mod 04. Try to register Cut Qty = 1051.
- **Expected Result:** API returns 422 Unprocessable Entity. Save blocked.
- **Step 3:** Try to register Cut Qty = 1050.
- **Expected Result:** API returns 201 Created. Save successful.

## 2. Test Case: Bundle Division Math (Positive)
- **Step 1:** Enter Cut Qty = 520, Pcs/Bundle = 50.
- **Step 2:** Generate.
- **Expected Result:** Database `bundles` table has exactly 11 new rows.
  - Rows 1-10 have `qty` = 50.
  - Row 11 has `qty` = 20.

## 3. Test Case: Mass Generation Performance
- **Step 1:** Enter Cut Qty = 100,000, Pcs/Bundle = 10 (Generates 10,000 bundles).
- **Step 2:** Click Generate.
- **Expected Result:** API must respond with 201 Created within **5.0 seconds**. If it throws 504 Timeout or 500 Memory Limit, it is a critical architectural failure (Backend team failed to use chunks).
