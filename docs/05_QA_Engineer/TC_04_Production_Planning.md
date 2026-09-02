# Test Cases: Module 04 (Production Planning)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Formula Calculation Accuracy
- **Step 1:** Enter Manpower = 40, SMV = 20, Target Eff = 50%.
- **Step 2:** Click Calculate.
- **Expected Result:** API returns Hourly Target = 60. (Formula: (40*60)/20 * 50% = 60). Any deviation is a critical bug.

## 2. Test Case: Schedule Overlap Block (Negative)
- **Step 1:** Book Line 01 from Sept 10 to Sept 15 for PO-A.
- **Step 2:** Try to book Line 01 from Sept 14 to Sept 20 for PO-B.
- **Expected Result:** Save fails. 409 Conflict. Message: "Line 01 is already booked on overlapping dates."

## 3. Test Case: Material Shortage Override
- **Step 1:** Click Lock Plan for a PO that has 0 fabric in Mod 11.
- **Expected Result:** Warning Modal appears asking for PIN.
- **Step 2:** Enter incorrect PIN "0000".
- **Expected Result:** API returns 401 Unauthorized. Modal stays open.
- **Step 3:** Enter correct PIN "123456".
- **Expected Result:** Plan successfully locks despite shortage. `is_locked` becomes true.
