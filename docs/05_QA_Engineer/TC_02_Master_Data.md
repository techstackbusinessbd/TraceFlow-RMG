# Test Cases: Module 02 (Master Data)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Create Buyer (Positive)
- **Step 1:** Click "Add Buyer".
- **Step 2:** Enter Name "Zara", Country "Spain", Email "info@zara.com".
- **Step 3:** Click Save.
- **Expected Result:** Success toast appears. "Zara" is visible in the Data Table. DB `buyers` table has a new UUID record.

## 2. Test Case: Duplicate Buyer (Negative)
- **Step 1:** Click "Add Buyer".
- **Step 2:** Enter Name "zara" (lowercase), Country "Spain".
- **Step 3:** Click Save.
- **Expected Result:** API returns 422. Form displays validation error: "Buyer name already exists."

## 3. Test Case: Soft Delete Validation (Boundary)
- **Step 1:** Identify a Style (e.g., "Denim 101") that is already linked to a Confirmed Purchase Order in Module 02.
- **Step 2:** Click the Delete icon next to "Denim 101".
- **Step 3:** Confirm the deletion modal.
- **Expected Result:** System blocks deletion. Shows error modal: "Cannot delete style. It is currently associated with active Purchase Orders." DB `deleted_at` column must remain `NULL`.

## 4. Test Case: Redis Cache Clear
- **Step 1:** Call `GET /api/v1/master-data/buyers/active`. Note response time (e.g., 50ms).
- **Step 2:** Add a new buyer "Uniqlo".
- **Step 3:** Call `GET /api/v1/master-data/buyers/active` again.
- **Expected Result:** "Uniqlo" must appear in the list immediately (proving the cache was invalidated and refreshed).
