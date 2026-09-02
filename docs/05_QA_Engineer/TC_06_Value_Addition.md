# Test Cases: Module 06 (Value Addition)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Valid State Transition (Positive)
- **Step 1:** Scan a bundle that is currently in `Cut` status.
- **Step 2:** Submit the Send Challan.
- **Expected Result:** Database `bundles.status` changes to `At Print`.

## 2. Test Case: Invalid State Transition (Negative)
- **Step 1:** Use Postman to attempt sending a bundle that is already in `Sewing` status.
- **Expected Result:** API throws 422 Unprocessable Entity. Message: "Bundle is in invalid state."

## 3. Test Case: Exceeding Reject Quantity (Boundary)
- **Step 1:** Scan a returning bundle that originally had 50 pieces.
- **Step 2:** Enter `Reject Qty: 55`.
- **Step 3:** Submit.
- **Expected Result:** UI and API block the request. Error: "Reject quantity cannot exceed the bundle's total quantity."

## 4. Test Case: Double Scan Prevention UI
- **Step 1:** Open the Scanner UI.
- **Step 2:** Scan Bundle A.
- **Step 3:** Scan Bundle A again.
- **Expected Result:** The UI does not duplicate the entry in the list. An error beep sound plays.
