# QA Test Cases Master Guideline
**Role:** QA Engineer
**Status:** Approved

## 1. Positive Testing
- Verify standard workflow: PO Create -> Plan -> Cut -> Scan In -> Scan Out -> QC Pass -> Pack.
- Ensure Mathematical accuracy: DHU and SMV targets match manual formulas.

## 2. Negative Testing (Boundary & Bypass)
- **Bypass Test:** Scan a bundle directly into "Packing" without it passing "Sewing" or "QC". System MUST block it.
- **Double Scan Test:** Scan the exact same QR code twice within 1 second. System MUST block the second request.

## 3. Offline Scenario Testing
- Turn Wi-Fi OFF on tablet.
- Scan 10 bundles.
- Turn Wi-Fi ON.
- Assert that exactly 10 bundles hit the backend API sequentially.
