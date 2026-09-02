# API Specification & DB Schema
**Module:** 08 - Quality Control (QC)
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `defect_types`
Master data for types of defects (Admin manages this).
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `name` | VARCHAR(100) | Not Null | E.g., "Broken Stitch", "Oil Spot" |
| `category` | ENUM | Not Null | 'Sewing', 'Fabric', 'Wash' |

### 1.2. Table: `qc_logs`
Tracks every QC scan and defect location.
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `single_piece_id`| UUID | Foreign Key | References `single_piece_qrs.id`. |
| `line_id` | UUID | Foreign Key | References `lines.id`. |
| `qc_status` | ENUM | Not Null | 'Pass', 'Alter', 'Spot', 'Reject' |
| `defect_type_id` | UUID | Nullable | References `defect_types.id`. |
| `defect_area` | VARCHAR(50)| Nullable | E.g., 'Collar', 'Left Sleeve'. |
| `created_at` | TIMESTAMP | Not Null | Scan time. |

---

## 2. API Endpoints

### 2.1. Log Single Piece QC Inspection
**Endpoint:** `POST /api/v1/qc/inspect`
**Description:** Called by the tablet when a piece is checked.

**Request Body (Pass):**
```json
{
  "single_piece_id": "uuid-piece-456",
  "line_id": "uuid-line-01",
  "qc_status": "Pass"
}
```

**Request Body (Alter/Defect):**
```json
{
  "single_piece_id": "uuid-piece-456",
  "line_id": "uuid-line-01",
  "qc_status": "Alter",
  "defect_type_id": "uuid-broken-stitch",
  "defect_area": "Collar"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Piece marked as Alter. DHU updated to 4.2%",
  "data": { "qc_log_id": "uuid" }
}
```

**Error Response (422 Unprocessable Entity - Already Passed):**
```json
{
  "status": "error",
  "message": "This piece has already been marked as Pass."
}
```
