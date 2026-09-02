# Product Requirements Document (PRD)
**Module:** 10 - Finishing & Packing
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
This module tracks the final stages of physical production: ironing, polybagging, and packing into cartons. It bridges the gap between `single_piece_qrs` (individual garments) and `cartons` (Master QRs).

---

## 2. Target Personas
1. **Packing Operator:** Scans single pieces and puts them into a carton.
2. **Finishing Manager:** Monitors packing progress against the PO total.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Carton Packing
Grouping single pieces into a physical box based on Buyer requirements.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `PO ID` | UUID | Yes | Active PO. | Dropdown |
| `Packing Type`| Enum | Yes | `Solid` (Same color/size) or `Blister` (Mixed). | Radio |
| `Pieces/Carton`| Int | Yes | E.g., 20. | Read-only from PO |
| `Scanned QR` | UUID | Yes | Must exist in `single_piece_qrs`. | Scanner Input |

#### 3.1.2. Business Rules & Logic
- **Rule 1 (Valid State):** A piece can ONLY be packed if its status is `QC_Pass` (or `Wash_Pass` if applicable).
- **Rule 2 (Mismatch Prevention - Solid Pack):** If the carton is designated for `Red-M`, scanning a piece that belongs to `Blue-L` MUST trigger a loud error beep and reject the scan.
- **Rule 3 (Auto-Seal):** If the carton capacity is 20, immediately upon scanning the 20th valid piece, the carton status changes to `Sealed`. The system auto-generates a `Master Carton QR` and prompts the printer.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-09.1:** Scanning a piece whose status is `QC_Reject` throws a `422 Error: Invalid State`.
- [ ] **AC-09.2:** Scanning a piece that is already linked to another `carton_id` throws a `409 Conflict: Already Packed`.
- [ ] **AC-09.3:** Upon reaching the 20th scan for a 20-piece carton, the API returns a `Carton QR` UUID and `is_sealed = true`.

---
*(End of PRD for Module 10)*
