# Product Requirements Document (PRD)
**Module:** 11 - Inventory & Store
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
This module manages the physical storage of both Raw Materials (Fabric, Accessories) and Finished Goods (Packed Cartons). It ensures 100% accuracy in stock levels and physical locations (Racks/Bins) so items can be found instantly.

---

## 2. Target Personas
1. **Store Keeper (Raw Materials):** Receives GRN (Goods Receipt Note) and issues materials to Production.
2. **Forklift Operator (Finished Goods):** Scans cartons coming from packing and places them into specific warehouse bins.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Finished Goods Putaway (Carton Location Mapping)
When a sealed carton arrives from the packing floor, it must be mapped to a physical location.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Scanned Carton QR` | UUID | Yes | Status must be `Sealed`. | Scanner |
| `Scanned Bin QR` | UUID | Yes | Must exist in `locations` table. | Scanner |

#### 3.1.2. Business Rules & Logic
- **Rule 1 (The 2-Step Scan):** The operator first scans the Carton QR. Then they drive the forklift to a rack and scan the Rack/Bin QR attached to the shelf.
- **Rule 2 (State Change):** This action changes the carton status to `In_Store` and maps it to the `bin_id`.

---

### 3.2. Sub-module: Raw Material Ledger
Managing bulk materials (e.g., KGs of fabric, pieces of buttons).

#### 3.2.1. Feature Details
- Uses a double-entry ledger system. Every transaction has an `In` or `Out` direction.
- **GRN:** Receiving goods increases stock (`In`).
- **Issue to Production:** Sending goods to the cutting floor decreases stock (`Out`).

#### 3.2.2. Edge Cases (Stock Out Prevention)
- **Rule 1:** If the current stock of "Red Cotton Thread" is 100 Cones, attempting to issue 105 Cones to the sewing line MUST throw a validation error. Stock cannot go negative.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-10.1:** Scanning a Carton QR that is already mapped to a Bin throws a `409 Conflict: Carton already stored`.
- [ ] **AC-10.2:** Issuing 50 KG of fabric when the balance is 40 KG throws a `422 Error: Insufficient Stock`.
- [ ] **AC-10.3:** Successfully scanning a Carton QR and then a Bin QR updates the `cartons` table with the correct `location_id`.

---
*(End of PRD for Module 11)*
