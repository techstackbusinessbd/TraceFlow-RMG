# Test Cases: Module 10 (Finishing & Packing)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Color/Size Mismatch (Negative)
- **Step 1:** Open a carton designated for PO-123, Red, Size M.
- **Step 2:** Scan a piece belonging to PO-123, Red, Size L.
- **Expected Result:** API returns 422 Unprocessable Entity: "Size mismatch. Expected M, got L." UI flashes red.

## 2. Test Case: Auto-Seal Boundary (Positive)
- **Step 1:** Open a carton with capacity = 5.
- **Step 2:** Scan 4 valid pieces. (API returns `is_sealed = false`).
- **Step 3:** Scan the 5th valid piece.
- **Expected Result:** API returns 201 Created with `is_sealed = true`. Database verifies carton status is now `Sealed` and all 5 pieces are updated to `Packed`.

## 3. Test Case: Overfill Prevention (Negative)
- **Step 1:** Try to scan a 6th piece into the already Sealed carton from Test 2.
- **Expected Result:** API returns 422 Unprocessable Entity: "Carton is already sealed."
