# Product Requirements Document (PRD)
**Module:** 08 - Quality Control (QC) & Rework
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
After a garment exits the sewing line (Module 06 Line Out), it must pass strict Quality Control (QC). Because we use **Single Piece Tracking**, the QC Inspector scans the exact piece, identifies if it is good or defective, and pinpoints the exact location of the defect.

---

## 2. Target Personas
1. **QC Inspector (Tablet User):** Scans the garment, marks it Pass, Alter, Spot, or Reject.
2. **Quality Manager (Web User):** Monitors the "Traffic Light System" on the dashboard.
3. **Rework Operator:** Fixes "Alter" garments and sends them back to QC.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Tablet Defect Logging
The core interface where QC inspects the single piece.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Scanned QR` | UUID | Yes | Must exist in `single_piece_qrs`. | Scanner Input |
| `QC Status` | Enum | Yes | `Pass`, `Alter`, `Spot`, `Reject`. | Big Colored Buttons |
| `Defect Type`| UUID | If Alter/Reject | E.g., "Skip Stitch". | Dropdown/Grid |
| `Defect Area`| Enum | If Alter/Reject | E.g., "Left Sleeve". | Image Grid Map |

#### 3.1.2. Business Rules & Rework Flow
- **Rule 1 (Valid State):** A piece can only be QC scanned if its status is `Sewn` (i.e., it passed Line Out).
- **Rule 2 (Rework Loop):** 
  - If a piece is marked `Alter`, its status changes to `In Rework`.
  - Once fixed, it must be scanned again. The system must recognize it is coming from rework and allow it to be marked `Pass`.
- **Rule 3 (Permanent Reject):** If marked `Reject`, the QR is killed. It can never be scanned again.

---

### 3.2. Sub-module: Traffic Light Dashboard (DHU Tracker)
Defects Per Hundred Units (DHU) is the standard KPI for garments quality.

#### 3.2.1. Feature Details
- System calculates DHU real-time for each line: `(Total Defects / Total Checked) * 100`.
- **Green (Normal):** DHU < 3%.
- **Yellow (Warning):** DHU between 3% and 5%.
- **Red (Critical):** DHU > 5%. The system flashes a red alert on the QA Manager's TV dashboard.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-07.1:** Scanning a QR that is already marked `Pass` throws a "Duplicate Pass" error.
- [ ] **AC-07.2:** Marking a piece as `Reject` immediately deducts 1 from the total good inventory count.
- [ ] **AC-07.3:** If 100 pieces are checked and 6 are marked Alter, the Line Dashboard instantly turns Red (DHU = 6%).

---
*(End of PRD for Module 08)*
