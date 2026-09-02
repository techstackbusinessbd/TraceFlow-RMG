# Product Requirements Document (PRD)
**Module:** 09 - Washing
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
Many garments (especially Denim or heavy knit) require industrial washing after sewing. This module tracks the bulk movement of Single Piece QRs from the factory floor to the Washing Plant and back. It also handles wash-related defects (e.g., Color Bleeding).

---

## 2. Target Personas
1. **Wash Dispatcher:** Scans thousands of single pieces and creates an Outgoing Wash Batch/Challan.
2. **Wash Receiver:** Scans garments returning from the washing plant.
3. **Wash QC:** Identifies pieces ruined during the wash process.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Outgoing Wash Batch (Send to Wash)
The factory loads trucks with garments to send to the washing plant.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Wash Type` | Enum | Yes | E.g., Enzyme, Silicone, Normal. | Dropdown |
| `Washing Plant` | String | Yes | Internal or External Vendor Name. | Text Input |
| `Scanned QRs` | UUID Array| Yes | Must exist in `single_piece_qrs`. | Bulk Scanner Input |

#### 3.1.2. Business Rules
- **Rule 1 (Valid State):** A piece can ONLY be sent to Wash if its status is `QC_Pass`. 
  - *Edge Case:* If an operator accidentally scans a piece that was marked `QC_Reject` or `Sewn` (bypassed QC), the system MUST throw an error and exclude it from the batch.
- **Rule 2 (Batch Creation):** Submitting the scanned QRs creates a `Wash Batch` document with a unique ID (e.g., WB-001).

---

### 3.2. Sub-module: Receive & Wash QC
Garments return from washing. The wet process can cause damage.

#### 3.2.1. Feature Details
- Operator scans the returning QRs.
- If a piece is damaged (e.g., fabric torn in the machine, color bleeding), the operator presses a "Wash Reject" toggle before scanning that specific piece.

#### 3.2.2. The Logic
- **Rule 1 (State Upgrade):** Successfully received pieces upgrade their status from `At Wash` to `Wash_Pass`.
- **Rule 2 (Wash Reject):** Damaged pieces are marked as `Wash_Reject`. This permanently removes them from the good inventory flow.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-08.1:** Scanning a piece with status `QC_Alter` into an Outgoing Wash Batch throws a `422 Error: Invalid State`.
- [ ] **AC-08.2:** Receiving 500 pieces from Wash updates exactly 500 rows in the `single_piece_qrs` table to `Wash_Pass` (or `Wash_Reject`).
- [ ] **AC-08.3:** Sending 1000 pieces to the washing plant reduces the factory's "Ready to Pack" virtual inventory by 1000 until they are received back.

---
*(End of PRD for Module 09)*
