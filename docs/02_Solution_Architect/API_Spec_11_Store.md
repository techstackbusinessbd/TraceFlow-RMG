# API Specification & DB Schema
**Module:** 11 - Inventory & Store
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `locations` (Warehouse Topology)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK (This is the Bin QR string). |
| `warehouse` | VARCHAR(50) | Not Null | E.g., 'WH-1' |
| `rack` | VARCHAR(50) | Not Null | E.g., 'Rack-A' |
| `bin` | VARCHAR(50) | Not Null | E.g., 'Bin-01' |

### 1.2. Table: `inventory_ledgers` (Raw Materials Double-Entry)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `item_id` | UUID | Foreign Key | References `items.id`. |
| `transaction_type`| ENUM | Not Null | 'GRN', 'Issue', 'Adjustment' |
| `qty_in` | DECIMAL | Default: 0 | Quantity coming in. |
| `qty_out` | DECIMAL | Default: 0 | Quantity going out. |
| `balance` | DECIMAL | Not Null | Running total (Calculated). |

---

## 2. API Endpoints

### 2.1. Putaway Carton (Location Mapping)
**Endpoint:** `POST /api/v1/store/putaway`
**Description:** Maps a sealed carton to a physical bin.

**Request Body:**
```json
{
  "carton_id": "uuid-carton-sealed",
  "bin_id": "uuid-bin-a1"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Carton successfully stored in WH-1 > Rack-A > Bin-01."
}
```

**Error Response (409 Conflict):**
```json
{
  "status": "error",
  "message": "Carton is already located in Bin-05."
}
```

### 2.2. Issue Raw Material to Production
**Endpoint:** `POST /api/v1/store/issue`
**Description:** Deducts stock via the ledger.

**Request Body:**
```json
{
  "item_id": "uuid-red-thread",
  "qty": 50,
  "department": "Sewing Line 1"
}
```
