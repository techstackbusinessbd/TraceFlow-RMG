# Product Requirements Document (PRD)
**Module:** 07 - Sewing & Line Tracking
**Document Version:** 4.1 (Enterprise Detailed Edition - Single Piece Tracking Refactor)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
Sewing is the core production activity. This module tracks the real-time flow of garments through the sewing lines. 
**CRITICAL ARCHITECTURE:** The line input is tracked via **Bundle QRs**. However, once the bundle is opened and body joining occurs, the output is tracked via **Single Piece QRs**. This provides 100% granular traceability at the piece level.

---

## 2. Target Personas
1. **Line Input Operator (Tablet):** Scans **Bundle QRs** entering the line.
2. **Line Output Operator (Tablet):** Scans **Single Piece QRs** exiting the line (Completed).
3. **Production Manager (Web):** Views real-time Hourly Production Dashboard.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Tablet QR Scanning (Input/Output)

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules |
|---|---|---|---|
| `Scanned QR` | UUID | Yes | For Line In: Must exist in `bundles`. For Line Out: Must exist in `single_piece_qrs`. |
| `Scan Type` | Enum | Yes | `Line In` or `Line Out`. |

#### 3.1.2. Business Rules
- **Rule 1 (State Check):** A single piece QR can only be scanned as `Line Out` if its parent bundle was already scanned as `Line In`.
- **Rule 2 (Double Scan):** Scanning the exact same single piece QR twice throws a "Already Scanned" error beep.
- **Rule 3 (Offline Mode):** Factory internet is unstable. The tablet MUST save scans locally to an SQLite database and sync to the server in the background when WiFi is restored.

---

### 3.2. Sub-module: Hourly Production Dashboard
A TV monitor displays real-time piece-level data.

#### 3.2.1. Edge Cases (The Red Zone)
- **Rule 1:** `Actual Production` is calculated ONLY by summing the `Line Out` single piece scans.
- **Rule 2:** If `Actual` < `Target` by more than 10%, the row on the dashboard turns Red.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-06.1:** Attempting to scan a `Single Piece QR` at `Line In` throws a Validation Error ("Line In expects Bundle QR").
- [ ] **AC-06.2:** Scanning 50 single piece QRs increments the Hourly Dashboard by exactly 50 pieces.
- [ ] **AC-06.3:** Scanning a single piece QR whose parent bundle is NOT marked as `Line In` throws an error ("Parent bundle not started").

---
*(End of PRD for Module 07)*
