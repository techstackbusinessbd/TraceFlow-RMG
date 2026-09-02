# Test Cases: Module 11 (Inventory & Store)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Stock Out Prevention (Raw Material)
- **Step 1:** Verify stock of `Item A` is 100 kg.
- **Step 2:** Open two browser tabs (Tab 1 and Tab 2).
- **Step 3:** In Tab 1, attempt to issue 60 kg. In Tab 2, attempt to issue 50 kg exactly at the same time.
- **Expected Result:** Due to DB locking, one request succeeds, and the other fails with a `422 Error: Insufficient Stock` (since 100 - 60 = 40, and 40 < 50). Balance cannot drop below 0.

## 2. Test Case: Carton Putaway Flow (Finished Goods)
- **Step 1:** Scan a valid Carton QR (Sealed status).
- **Step 2:** Scan a valid Bin QR.
- **Expected Result:** API returns 200 OK.
- **Step 3:** Scan the EXACT SAME Carton QR and Bin QR again.
- **Expected Result:** API returns 409 Conflict ("Carton already stored").
