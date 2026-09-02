# API Specification & Schema Details
**Module:** 05 - Cutting & Bundle Ticket
**Version:** 2.0 (In-depth Enterprise)
**Author:** Solution Architect
**Status:** 100% Production Ready

## 1. Database Schema Specifications

### Table: `cut_registers`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | PK |
| po_id | UUID | Foreign Key | - |
| color_id | UUID | Foreign Key | - |
| cut_no | Integer | Auto-increment per PO | E.g. Cut-01 |
| shade | String(20) | Nullable | A, B, C etc. |
| table_no | String(50) | Nullable | - |

### Table: `bundles`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | PK |
| cut_id | UUID | Foreign Key | Linked to cut |
| size_id | UUID | Foreign Key | Linked to size |
| qr_code | String(100) | Unique, Indexed | The actual barcode text |
| pcs_qty | Integer | Not Null | Number of garments |
| status | Enum | Default 'Cut' | Cut, Sewing, QC, Packed |

## 2. API Endpoints

### 2.1. Save Cut & Dispatch Queue (POST `/api/v1/cutting`)
**Request Body:**
```json
{
  "po_id": "uuid",
  "color_id": "uuid",
  "table_no": "Table-2",
  "shade": "Shade-A",
  "sizes": [
    { "size_id": "uuid", "plies": 100, "ratio": 1, "bundle_size_limit": 50 }
  ]
}
```

**Success Response (202 Accepted):**
```json
{
  "status": "queued",
  "message": "Cut saved. Bundle generation running in background.",
  "job_id": "redis-job-xyz"
}
```

### 2.2. Print QR Tags (GET `/api/v1/cutting/{cut_id}/print`)
**Response:** Generates and returns a downloadable PDF stream containing the QR codes.
