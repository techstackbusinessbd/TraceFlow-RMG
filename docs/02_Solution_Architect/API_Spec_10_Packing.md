# API Specification & DB Schema
**Module:** 10 - Finishing & Packing
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `cartons` (The Master QR)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK (This is the Master QR string). |
| `po_id` | UUID | Foreign Key | References `purchase_orders.id`. |
| `carton_no` | INTEGER | Not Null | E.g., 1, 2, 3... Auto-increment per PO. |
| `capacity` | INTEGER | Not Null | Max pieces allowed. |
| `status` | ENUM | Default: 'Open' | 'Open', 'Sealed', 'Shipped'. |

### 1.2. Table: `carton_contents` (Mapping)
Links single pieces to a specific carton.
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `carton_id` | UUID | Foreign Key | References `cartons.id`. |
| `single_piece_id`| UUID | Foreign Key | References `single_piece_qrs.id`. UNIQUE. |

---

## 2. API Endpoints

### 2.1. Scan Piece into Carton
**Endpoint:** `POST /api/v1/packing/scan`
**Description:** Adds a piece to an open carton. If the carton hits capacity, it seals it.

**Request Body:**
```json
{
  "carton_id": "uuid-carton-open",
  "single_piece_id": "uuid-piece-123"
}
```

**Success Response (Piece Added - Still Open):**
```json
{
  "status": "success",
  "message": "Piece added to carton.",
  "data": { 
    "current_count": 15,
    "capacity": 20,
    "is_sealed": false
  }
}
```

**Success Response (Carton Filled & Sealed):**
```json
{
  "status": "success",
  "message": "Carton sealed. Generating Master QR.",
  "data": { 
    "current_count": 20,
    "capacity": 20,
    "is_sealed": true,
    "master_qr": "uuid-carton-open" 
  }
}
```
