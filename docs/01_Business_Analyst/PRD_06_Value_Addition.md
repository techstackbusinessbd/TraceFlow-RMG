# Product Requirements Document (PRD)
**Module:** 06 - Value Addition (Print & Embroidery)
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
After fabric is cut into bundles (Module 04), some styles require printing or embroidery before sewing. This module tracks the physical movement of QR bundles out of the cutting floor, into the printing section (or external vendor), and back again. 

---

## 2. Target Personas
1. **Gatepass Issuer:** Scans bundles and creates outgoing Delivery Challans.
2. **Receiving Officer:** Scans bundles coming back from the print section.
3. **Quality Checker (Print):** Records if any piece inside a bundle was ruined during printing.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Outgoing Delivery (Send to Print)
Moving bundles from Cutting to Value Addition.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Process Type` | Enum | Yes | Print, Embroidery, Wash. | Dropdown |
| `Vendor Name` | String | Yes | Internal Dept or External Factory. | Text Input |
| `Scanned QR` | UUID | Yes | Must exist in `bundles` table. | Barcode Scanner |

#### 3.1.2. Business Rules
- **Rule 1 (Valid State):** A bundle can only be sent to Print if its current status is `Cut`.
- **Rule 2 (Double Scan Prevention):** If a user accidentally scans the same QR code twice for the same Challan, the system MUST emit a specific beep sound (error) and show a Red Error: "Bundle Already Added".

---

### 3.2. Sub-module: Receiving & Reject Handling
Receiving the bundles back. This is where inventory gets deducted if printing went wrong.

#### 3.2.1. Feature Details
- User scans the bundle to receive it. 
- If all 50 pieces in the bundle are perfectly printed, user proceeds.
- If 2 pieces got smeared with ink, the user enters `Reject Qty: 2`.

#### 3.2.2. The Math & State Logic
- **Rule 1 (Bundle Deduction):** If Bundle QR-123 had 50 pcs, and 2 are rejected, the system MUST update the `bundles` table `qty = 48`.
- **Rule 2 (Status Upgrade):** Once received, the bundle status updates from `At Print` to `Ready for Sewing`.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-05.1:** Scanning a bundle with status `Sewing` to send it to Print must throw a `422 Error: Invalid State`.
- [ ] **AC-05.2:** Receiving a bundle with a reject quantity of 2 correctly deducts the total bundle quantity in the database.
- [ ] **AC-05.3:** Attempting to reject 55 pieces from a bundle that only has 50 pieces throws a Validation Error.

---
*(End of PRD for Module 06)*
