# Product Requirements Document (PRD)
**Module:** 05 - Cutting & Bundle Ticket Generation
**Document Version:** 4.1 (Enterprise Detailed Edition - Single Piece Tracking Refactor)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
The Cutting module is the birth of physical traceability in the factory. Large rolls of fabric are cut into thousands of small pieces. This module records the Lay Chart and generates unique QR Code Bundle Tickets. 

**CRITICAL ARCHITECTURE:** To support modern single-piece tracking, generating a Bundle QR will simultaneously generate **Single Piece Sub-QRs** for every piece of garment inside that bundle. These single-piece QRs are printed on a sticker sheet and attached to individual garments at the sewing assembly point.

---

## 2. Target Personas
1. **Cutting In-Charge:** Inputs Lay Chart data and Cut Quantity.
2. **CAD/Marker Maker:** Provides marker ratios.
3. **Data Entry Operator:** Prints Bundle QR stickers AND Single Piece QR sticker sheets.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Cut Register & Lay Chart
Logs the total quantity of fabric cut for a specific PO, Color, and Size.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `PO ID` | UUID | Yes | Must be a Confirmed PO. | Searchable Dropdown |
| `Cut Number` | Integer| Yes | Auto-incremented per PO. | Read-only Text |
| `Color ID` | UUID | Yes | Must exist in the PO Breakdown. | Dropdown |
| `Size ID` | UUID | Yes | Must exist in the PO Breakdown. | Dropdown |
| `Cut Qty` | Integer| Yes | Actual pieces cut. Must be > 0. | Number Input |
| `Pcs per Bundle`| Integer| Yes | e.g. 50. | Number Input |

#### 3.1.2. Business Rules & Tolerance
- **Rule 1 (Cutting Tolerance):** Factories often cut slightly more than the order quantity to adjust for defects (e.g., 5% extra).
- **Rule 2 (Validation):** If the PO requires 1000 pcs and tolerance is 5%, maximum allowed `Cut Qty` is 1050.

---

### 3.2. Sub-module: Bundle & Single Piece QR Generation
System mathematically divides the `Cut Qty` into smaller bundles AND single pieces.

#### 3.2.1. Feature Details
- User specifies `Pcs per Bundle` (e.g., 50).
- If `Cut Qty` = 520:
  - System creates 11 **Bundle QRs** (10 bundles of 50, 1 bundle of 20).
  - System concurrently creates **520 Single Piece QRs** mapped to their respective parent bundles.

#### 3.2.2. QR Code Payload
- Both Bundle QRs and Single Piece QRs must be non-guessable UUIDs mapping to their respective database tables.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-04.1:** Submitting Cut Qty = 520 with Pcs/Bundle = 50 accurately generates 11 rows in the `bundles` table AND 520 rows in the `single_piece_qrs` table.
- [ ] **AC-04.2:** Deleting a bundle must Cascade Delete its associated single piece QRs.
- [ ] **AC-04.3:** Printing options include "Print Bundle Ticket" and "Print Single Piece Sticker Sheet".

---
*(End of PRD for Module 05)*
