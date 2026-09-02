# Test Cases: Module 08 (QC & Rework)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: The Rework Lifecycle
- **Step 1:** Scan Piece A. Mark as `Alter` -> `Broken Stitch` -> `Collar`.
- **Expected Result 1:** DB status is `QC_Alter`.
- **Step 2:** Operator fixes the garment. Scan Piece A again.
- **Expected Result 2:** UI recognizes it as a rework piece.
- **Step 3:** Mark as `Pass`.
- **Expected Result 3:** DB status changes to `QC_Pass`.

## 2. Test Case: Permanent Reject Protection
- **Step 1:** Scan Piece B. Mark as `Reject`.
- **Step 2:** Scan Piece B again (someone trying to sneak a reject into good stock).
- **Expected Result:** API blocks the request with a loud error beep and 422 Error: "Piece is permanently rejected."

## 3. Test Case: Real-time Traffic Light (DHU)
- **Step 1:** Log 94 Pass scans and 6 Alter scans on Line 01 for the current hour.
- **Expected Result:** The DHU is exactly 6%. The Dashboard UI must turn Red via WebSocket instantly on the 6th Alter scan.
