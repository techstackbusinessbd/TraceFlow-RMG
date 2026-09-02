# API Specification & DB Schema
**Module:** 07 - Sewing & Line Tracking
**Author:** Solution Architect
**Status:** Approved for Development (Single Piece Tracking Refactor)

---

## 1. Database Schema Specifications

### 1.1. Table: `sewing_logs`
Tracks every single scan event (Both Bundle and Single Piece).
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `qr_type` | ENUM | Not Null | 'Bundle' or 'Single_Piece' |
| `scanned_id` | UUID | Not Null | ID of the Bundle OR Single Piece. |
| `line_id` | UUID | Foreign Key | References `lines.id`. |
| `scan_type` | ENUM | Not Null | 'Line In', 'Line Out' |
| `scanned_at`| TIMESTAMP | Not Null | Time of scan (from device). |

### 1.2. Table: `hourly_productions`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `line_id` | UUID | Foreign Key | References `lines.id`. |
| `date` | DATE | Not Null | Current date. |
| `hour_block`| INTEGER | Not Null | e.g. 9 (for 9AM-10AM). |
| `qty_produced`| INTEGER| Default: 0 | Number of SINGLE PIECE scans for this hour. |

---

## 2. API Endpoints

### 2.1. Submit Scans (Bulk Offline Sync)
**Endpoint:** `POST /api/v1/sewing/sync`
**Headers:** `Authorization: Bearer <device_token>`
**Description:** Mixed payload of Bundle Scans (Line In) and Single Piece Scans (Line Out). Handled by Redis Queues.

**Request Body:**
```json
{
  "device_id": "uuid-device",
  "scans": [
    {
      "qr_type": "Bundle",
      "scanned_id": "uuid-bundle-1",
      "scan_type": "Line In",
      "scanned_at": "2026-08-28T10:05:00Z"
    },
    {
      "qr_type": "Single_Piece",
      "scanned_id": "uuid-single-piece-56",
      "scan_type": "Line Out",
      "scanned_at": "2026-08-28T11:05:00Z"
    }
  ]
}
```

**Success Response (202 Accepted - Queued):**
```json
{
  "status": "success",
  "message": "Scans received and queued for processing.",
  "data": { "received_count": 2 }
}
```
