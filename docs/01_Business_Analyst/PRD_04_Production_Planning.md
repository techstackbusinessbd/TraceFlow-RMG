# Product Requirements Document (PRD)
**Module:** 04 - IE & Production Planning
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
This module connects the Confirmed POs from Merchandising (Module 03) to the physical Factory Floor. The Industrial Engineering (IE) team allocates the PO to specific Sewing Lines based on mathematical capacity. 

---

## 2. Target Personas
1. **IE Manager:** Full CRUD access. Plans POs, inputs SMV, and sets targets.
2. **Production Manager:** Views plans to prepare the floor.
3. **Store Manager:** Receives automated alerts if materials are short for an upcoming plan.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Line Allocation & Capacity Math
IE assigns a PO to a line and calculates the Hourly Target (Target DHU).

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `PO ID` | UUID | Yes | Must be a `Confirmed` PO from Mod 02. | Searchable Dropdown |
| `Line ID` | UUID | Yes | Active Lines only (from Mod 01). | Searchable Dropdown |
| `Start Date` | Date | Yes | Cannot be in the past. | Date Picker |
| `End Date` | Date | Yes | Must be >= Start Date. | Date Picker |
| `SMV` | Decimal| Yes | Standard Minute Value. Max 2 Decimals. | Number Input |
| `Manpower` | Integer| Yes | Operators assigned. Max 100. | Number Input |
| `Target Eff %`| Decimal| Yes | e.g. 60.00% | Number Input |

#### 3.1.2. Business Rules (The Math)
- **Rule 1 (Target Calculation):** As soon as the user types SMV, Manpower, and Target Eff %, the system MUST auto-calculate the `Hourly Target` using this strict formula:
  `Hourly Target = ((Manpower * 60) / SMV) * (Target Eff % / 100)`
  - *Example:* `((30 * 60) / 15) * (60 / 100) = 72 pcs/hour`.
- **Rule 2 (Schedule Conflict):** If Line 01 is already booked from Sept 1 to Sept 5, the system MUST block any attempt to assign a new PO to Line 01 during those exact dates.

---

### 3.2. Sub-module: Material Readiness Check
You cannot start sewing if the fabric is not in the store.

#### 3.2.1. Feature Details
- When the IE Manager clicks "Lock Plan", the Planning Module internally queries the Store Module (Module 11) for the required materials.

#### 3.2.2. Edge Cases
- **Rule 1 (Shortage Warning):** If `Store Balance < Total PO Qty`, the system throws a Red Modal: "Warning: Material Shortage. Balance is 80%. Do you still want to proceed at risk?"
- **Rule 2 (Manager Override):** Proceeding despite a shortage requires a higher-level Manager PIN to override.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-03.1:** Auto-calculation matches the manual formula exactly. e.g. 30 manpower, 15 SMV, 60% eff = 72.
- [ ] **AC-03.2:** Attempting to double-book Line 01 for the same dates triggers a 409 Conflict error.
- [ ] **AC-03.3:** Locking a plan with 0 fabric in the store shows the Material Shortage Modal and prevents saving unless a PIN is entered.

---
*(End of PRD for Module 04)*
