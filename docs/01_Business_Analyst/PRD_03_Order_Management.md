# Product Requirements Document (PRD)
**Module:** 03 - Order Management (Merchandising)
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
The Order Management module is where commercial data enters the traceability system. Merchandisers log the Buyer Purchase Orders (PO) here. Crucially, this module breaks down the gross PO quantity into highly specific **Color-Size Ratios** (e.g., Red-XL: 500 pcs). This breakdown dictates the exact number of QR codes the Cutting module will generate later. 

---

## 2. Target Personas
1. **Merchandiser / Commercial Officer:** Full CRUD access to POs. Uploads Tech Packs.
2. **IE / Planning Manager (Read-Only):** Needs to view Confirmed POs to schedule production.
3. **Cutting In-Charge (Read-Only):** Needs the exact size/color breakdown to lay fabric.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: PO Header (Basic Details)
The top-level commercial information of the order.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `PO Number` | String | Yes | Min: 3, Max: 100 chars. Must be Unique. | Text Input |
| `Buyer` | UUID | Yes | Pulled from Master Data (Module 02). | Searchable Dropdown|
| `Style` | UUID | Yes | Pulled from Master Data. Must belong to the selected Buyer. | Searchable Dropdown|
| `Total Quantity`| Integer| Yes | Must be > 0. (e.g., 50000) | Number Input |
| `Shipment Date` | Date | Yes | Must be >= Today's Date. | Date Picker |
| `Status` | Enum | Yes | Draft -> Confirmed -> Shipped. | System Auto/Toggle|

#### 3.1.2. Business Rules
- **Rule 1 (Status Lock):** A PO in `Confirmed` status cannot have its `Total Quantity` or `Breakdown` edited if the Cutting Module (Mod 04) has already started cutting against this PO.
- **Rule 2 (Cascading Dropdown):** The `Style` dropdown must remain disabled until a `Buyer` is selected. Once a Buyer is selected, it must only show styles mapped to that specific buyer.

---

### 3.2. Sub-module: PO Ratio Breakdown (The Matrix)
This is the most mathematically critical part of the system.

#### 3.2.1. Feature Details
The user must define exactly how the `Total Quantity` is divided.
- **Y-Axis:** Colors (e.g., Red, Blue)
- **X-Axis:** Sizes (e.g., S, M, L)
- **Intersection:** Quantity in Pieces.

#### 3.2.2. Strict Mathematical Validation (Edge Case)
- **Rule 1 (The Golden Rule):** `SUM(All Breakdown Quantities) MUST EXACTLY EQUAL Total Quantity`.
- **Example:** If Total Qty = 1000. Red-S(200) + Red-M(500) + Blue-L(300) = 1000. System allows Save.
- **Example Error:** If the user enters Red-S(200) + Red-M(500) + Blue-L(301) = 1001. System completely blocks the Save and highlights the mismatch.

---

### 3.3. Sub-module: Tech Pack & File Upload
Merchandisers upload the physical garment specifications (PDF).

#### 3.3.1. Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Tech Pack File`| File | No | Allowed: PDF, JPG, PNG. Max Size: 10MB. | Drag & Drop |

#### 3.3.2. Edge Cases
- **Rule 1 (File Replace):** If a new Tech Pack is uploaded, the old file must be retained with a version number appended (e.g., `TechPack_v1.pdf`, `TechPack_v2.pdf`) for auditing purposes.

---

## 4. Acceptance Criteria (For QA Team)

- [ ] **AC-02.1:** Selecting "Buyer A" correctly filters the Style dropdown to only show styles belonging to "Buyer A".
- [ ] **AC-02.2:** Attempting to save a PO where the matrix sum is 999 but Total Qty is 1000 triggers a `422 Validation Error`.
- [ ] **AC-02.3:** Uploading an 11MB PDF file triggers a client-side validation error before hitting the API.
- [ ] **AC-02.4:** Editing a `Confirmed` PO throws a 403 Forbidden error if `cut_registers` table already has entries for this PO ID.

---
*(End of PRD for Module 03)*
