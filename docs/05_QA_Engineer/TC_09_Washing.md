# Test Cases: Module 09 (Washing)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Invalid State Protection
- **Step 1:** Copy a UUID of a piece that is marked `QC_Reject` or `QC_Alter`.
- **Step 2:** Attempt to include this UUID in an Outgoing Wash Batch payload via API.
- **Expected Result:** API returns 422 Unprocessable Entity. The database update fails completely (no pieces are updated to `At Wash`).

## 2. Test Case: Wash Reject Deduction
- **Step 1:** Create a Wash Batch with 10 pieces.
- **Step 2:** Receive the batch. Mark 9 pieces as Good, 1 piece as Reject.
- **Expected Result:** Database verifies 9 rows in `single_piece_qrs` are `Wash_Pass` and 1 row is `Wash_Reject`.

## 3. Test Case: High Volume Validation
- **Step 1:** Send an API request with an array of 5,000 valid UUIDs.
- **Expected Result:** API completes the transaction and returns a 201 Created within a reasonable timeframe (e.g., < 3 seconds) without throwing a PostgreSQL query timeout or buffer memory error.
