# Product Requirements Document (PRD)
**Module:** 02 - Master Data (Global Library)
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
Master Data is the foundational module of the RMG Traceability Software. It acts as the central repository for all global configurations. Without setting up the Master Data, no other module (Merchandising, Planning, Sewing, etc.) can function, as they strictly rely on the relational IDs generated here.

The system will enforce **"Create Once, Use Everywhere"** to prevent data duplication and typographical errors across the factory.

---

## 2. Target Personas
1. **System Admin:** Full CRUD (Create, Read, Update, Delete) access to all Master Data.
2. **Merchandising Manager:** Can Create/Update Buyers and Styles.
3. **IE Manager:** Can Create/Update Production Lines, Colors, and Sizes.
4. **General Users:** Read-Only access (Dropdown selections) across other modules.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Buyer Library
Buyers are the international brands (e.g., H&M, Zara) giving orders to the factory.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Buyer Name` | String | Yes | Min: 3, Max: 100 chars. Must be globally unique (Case-insensitive). | Text Input |
| `Country` | String | Yes | Must be selected from a predefined ISO standard list of 195 countries. | Searchable Dropdown |
| `Contact Email`| String | No | Must be valid email format (RFC 5322). | Email Input |
| `Status` | Boolean| Yes | Default: `Active`. | Toggle Switch |

#### 3.1.2. Business Rules & Edge Cases
- **Rule 1 (Soft Delete):** If a Buyer has an existing Purchase Order (PO) in Module 02, the Buyer **CANNOT** be hard-deleted. It can only be marked as `Inactive`.
- **Rule 2 (Inactive Behavior):** `Inactive` buyers will not appear in the dropdown when creating a *new* PO, but will still display correctly in *historical* reports.
- **Rule 3 (Duplicate Check):** Trying to add "H&M" when "h&m" exists must throw a duplication error.

---

### 3.2. Sub-module: Style Library
Styles are the specific garment designs (e.g., Slim Fit Denim Jeans) assigned to a Buyer.

#### 3.2.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Style No` | String | Yes | Min: 2, Max: 50 chars. Alphanumeric. Unique per Buyer. | Text Input |
| `Buyer_ID` | UUID | Yes | Must exist in `buyers` table and be Active. | Searchable Dropdown |
| `Category` | Enum | Yes | Options: Knit, Woven, Sweater, Denim. | Select Box |
| `Base SMV` | Decimal| No | Must be > 0. Max 2 decimal places (e.g. 15.50). | Number Input |

#### 3.2.2. Business Rules & Edge Cases
- **Rule 1 (Unique Constraint):** Style Number "101" can exist for both "Zara" and "H&M", but cannot exist twice for "Zara". The unique key is a composite of `(Buyer_ID, Style_No)`.

---

### 3.3. Sub-module: Color Library
Global colors used for fabrics and garments.

#### 3.3.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Color Name` | String | Yes | Min: 2, Max: 50 chars. Globally unique. | Text Input |
| `HEX Code` | String | No | Must start with '#' followed by 6 valid hex chars. | Color Picker |

---

### 3.4. Sub-module: Size Library
Standard sizes (e.g., S, M, L or 32, 34, 36).

#### 3.4.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Size Label` | String | Yes | Min: 1, Max: 10 chars. Globally unique. | Text Input |
| `Sort Order` | Integer| Yes | Used for sorting sizes logically in dropdowns (e.g. S=1, M=2, L=3). | Number Input |

---

### 3.5. Sub-module: Production Line Library
The physical layout of the factory where sewing happens.

#### 3.5.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Line Name` | String | Yes | Unique. e.g. "Line-01". | Text Input |
| `Floor No` | String | Yes | e.g. "Ground Floor", "2nd Floor". | Select Box |
| `Max Capacity`| Integer| No | Maximum machine operators. Max: 100. | Number Input |
| `Is_Active` | Boolean| Yes | Default: `Active`. | Toggle Switch |

#### 3.5.2. Business Rules
- **Rule 1 (Tablet Mapping):** When configuring an Android Tablet in Module 01, it must be mapped to an Active `Line_ID`. If a line is marked `Inactive`, the tablet mapped to it will force log out.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1. Performance & Caching
- **Redis Caching:** As Master Data is read frequently but updated rarely, all `GET` API endpoints for Dropdowns must be cached using Redis.
- **Cache Invalidation:** If an Admin updates a Buyer's name, the Redis cache for `buyers_list` must be cleared immediately via Event Listeners.
- **Latency:** API response for Master Data dropdowns must be under **100ms** at the 95th percentile.

### 4.2. Security & Audit Logging
- **Audit Trails:** Every Insert/Update/Delete action must log the `User_ID`, `IP_Address`, `Timestamp`, and the JSON `Changes (Old vs New)` into an `audit_logs` table.

---

## 5. Acceptance Criteria (For QA Team)

- [ ] **AC-01.1:** Creating a Buyer with name "  ZARA  " should trim spaces and save as "ZARA".
- [ ] **AC-01.2:** Creating a Buyer with "ZARA" when "zara" exists returns a `422 Unprocessable Entity` with message "Buyer name already exists."
- [ ] **AC-01.3:** Attempting to delete a Size that is used in `po_breakdowns` fails gracefully with a user-friendly error modal.
- [ ] **AC-01.4:** API `/api/v1/master/lines` returns data from Redis cache within 100ms.

---
*(End of PRD for Module 02)*
