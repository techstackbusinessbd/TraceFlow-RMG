# Test Cases: Module 12 (Export & Shipment)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: The Buyer Mismatch Block
- **Step 1:** Create Shipment A assigned to Buyer X (e.g., H&M).
- **Step 2:** Operator attempts to scan a Carton Master QR that belongs to a PO from Buyer Y (e.g., Zara).
- **Expected Result:** API returns a 422 Unprocessable Entity ("Buyer Mismatch"). Tablet UI flashes solid red with an alarm. Carton is NOT added to the shipment.

## 2. Test Case: Auto PO Closure
- **Step 1:** PO-101 has an order quantity of 1000 pcs (Tolerance 0%).
- **Step 2:** Operator creates a shipment and scans cartons totaling 1000 pcs for PO-101.
- **Step 3:** Commercial Manager clicks "Dispatch Shipment".
- **Expected Result:** PO-101 status automatically changes to `Closed`.

## 3. Test Case: Invalid State Prevention
- **Step 1:** Operator attempts to load a carton that is currently in `Packing` state (not yet putaway in the store).
- **Expected Result:** API blocks the scan. Only `In_Store` cartons can be loaded onto a shipment.
