# API Specification & DB Schema
**Module:** 06 - Value Addition
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `challans` (Delivery Notes)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `challan_no` | VARCHAR(50) | Unique, Not Null | e.g., CHL-PRINT-001 |
| `process_type` | ENUM | Not Null | 'Print', 'Embroidery' |
| `vendor_name` | VARCHAR(100) | Not Null | Destination. |
| `type` | ENUM | Not Null | 'Outgoing', 'Incoming' |
| `created_by` | UUID | Foreign Key | References `users.id`. |
| `created_at` | TIMESTAMP | - | - |

### 1.2. Table: `bundle_transactions` (Audit Trail)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `challan_id` | UUID | Foreign Key | References `challans.id`. |
| `bundle_id` | UUID | Foreign Key | References `bundles.id`. |
| `reject_qty` | INTEGER | Default: 0 | Number of defective pcs. |

---

## 2. API Endpoints

### 2.1. Create Outgoing Challan (Send Bundles)
**Endpoint:** `POST /api/v1/value-addition/send`
**Description:** Takes an array of scanned QR UUIDs and updates their status.

**Request Body:**
```json
{
  "process_type": "Print",
  "vendor_name": "In-house Printing Ltd",
  "bundle_ids": [
    "uuid-bundle-1",
    "uuid-bundle-2"
  ]
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Challan created successfully.",
  "data": { "challan_no": "CHL-OUT-998" }
}
```

**Error Response (422 Unprocessable Entity - Invalid State):**
```json
{
  "status": "error",
  "message": "Bundle uuid-bundle-2 is not in 'Cut' state."
}
```

### 2.2. Receive Bundles & Log Rejects
**Endpoint:** `POST /api/v1/value-addition/receive`
**Description:** Receives bundles back and deducts rejects.

**Request Body:**
```json
{
  "vendor_name": "In-house Printing Ltd",
  "bundles": [
    { "bundle_id": "uuid-bundle-1", "reject_qty": 0 },
    { "bundle_id": "uuid-bundle-2", "reject_qty": 2 }
  ]
}
```
