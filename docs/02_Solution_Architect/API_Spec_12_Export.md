# API Specification & DB Schema
**Module:** 12 - Export & Shipment
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `shipments` (The Master Document)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `shipment_no` | VARCHAR(50) | Unique, Not Null | E.g., EXP-2026-001 |
| `buyer_id` | UUID | Foreign Key | References `buyers.id`. |
| `container_no` | VARCHAR(50) | Nullable | E.g., MSKU1234567 |
| `destination` | VARCHAR(100)| Not Null | Port of delivery. |
| `status` | ENUM | Default: 'Loading'| 'Loading', 'Dispatched'. |

### 1.2. Table: `shipment_cartons` (The Scan Log)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `shipment_id` | UUID | Foreign Key | References `shipments.id`. |
| `carton_id` | UUID | Foreign Key | References `cartons.id`. UNIQUE. |
| `scanned_at` | TIMESTAMP | Not Null | Exact time of loading. |

---

## 2. API Endpoints

### 2.1. Scan Carton into Container
**Endpoint:** `POST /api/v1/export/load-carton`
**Description:** Validates and adds a carton to the shipment.

**Request Body:**
```json
{
  "shipment_id": "uuid-shipment-active",
  "carton_id": "uuid-carton-master-qr"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Carton loaded into container.",
  "data": { 
    "total_cartons_loaded": 450,
    "remaining_target": 50 
  }
}
```

**Error Response (422 Unprocessable Entity - Mismatch):**
```json
{
  "status": "error",
  "message": "CRITICAL: This carton belongs to a different buyer/PO."
}
```
