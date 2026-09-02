# Product Requirements Document (PRD)
**Module:** 12 - Export & Shipment
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
This is the final stage of the traceability lifecycle. Finished goods (Cartons) stored in the warehouse are loaded into shipping containers bound for the Buyer's port. This module generates the Packing List, Commercial Invoice, and formally closes the Purchase Order (PO).

---

## 2. Target Personas
1. **Commercial Manager:** Creates the Shipment plan and generates export documents.
2. **Loading Dock Operator:** Scans cartons as they are physically loaded into the container.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Shipment Creation
Planning which POs and how many cartons will go into a specific container.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Container No` | String | Yes | E.g., "MSKU1234567". | Text Input |
| `Buyer ID` | UUID | Yes | Must match the PO's buyer. | Dropdown |
| `Destination` | String | Yes | E.g., "New York Port". | Text Input |
| `PO IDs` | UUID Array| Yes | The POs being shipped. | Multi-Select |

### 3.2. Sub-module: Container Loading (Scan Out)
The physical execution of the shipment plan.

#### 3.2.1. Feature Details
- The operator selects the active `Shipment ID` on their tablet.
- They scan the Master Carton QRs as they are loaded onto the truck/container.

#### 3.2.2. Business Rules & Logic
- **Rule 1 (Destination Lock):** If the shipment is created for `Buyer: H&M`, scanning a carton that belongs to `Buyer: Zara` MUST trigger a critical error and reject the scan.
- **Rule 2 (Inventory Deduction):** Loading a carton changes its status to `Shipped` and removes it from the active `carton_stock` (Store inventory).
- **Rule 3 (PO Closure):** If the total shipped quantity of a PO matches the ordered quantity (including allowed tolerances), the PO status automatically changes to `Closed`.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-12.1:** Scanning a carton that belongs to a different PO/Buyer than the active shipment throws a `422 Error: Shipment Mismatch`.
- [ ] **AC-12.2:** Generating a Packing List must accurately reflect exactly the cartons scanned during the loading phase.
- [ ] **AC-12.3:** Attempting to scan a carton whose status is NOT `In_Store` (e.g., still `Open` in packing) throws an Invalid State error.

---
*(End of PRD for Module 12)*
