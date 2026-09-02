# API Specification & DB Schema
**Module:** 05 - Cutting & Bundle Ticket Generation
**Author:** Solution Architect
**Status:** Approved for Development (Single Piece Tracking Refactor)

---

## 1. Database Schema Specifications

### 1.1. Table: `cut_registers`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `po_id` | UUID | Foreign Key | References `purchase_orders.id`. |
| `cut_no` | INTEGER | Not Null | Auto increment per PO. |
| `total_cut_qty`| INTEGER | Not Null | Total pieces cut. |

### 1.2. Table: `bundles` (The Parent QR Codes)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK (This is the Bundle QR String). |
| `cut_register_id`| UUID | Foreign Key | References `cut_registers.id`. |
| `bundle_no` | INTEGER | Not Null | e.g. 1, 2, 3... |
| `qty` | INTEGER | Not Null | Number of pieces in bundle. |
| `status` | ENUM | Default: 'Cut'| 'Cut', 'Sewing', 'Packed'. |

### 1.3. Table: `single_piece_qrs` (The Child QR Codes) [NEW]
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK (This is the Single Piece QR String). |
| `bundle_id` | UUID | Foreign Key | References `bundles.id`. |
| `piece_no` | INTEGER | Not Null | e.g. 1 to 50 inside the bundle. |
| `status` | ENUM | Default: 'Pending'| 'Pending', 'Sewn', 'QC_Pass', 'Reject'. |

---

## 2. API Endpoints

### 2.1. Create Cut Register & Bulk Generate QRs
**Endpoint:** `POST /api/v1/cutting/registers`
**Description:** Records cut quantity and bulk generates BOTH bundle records AND single piece records using chunks to prevent memory limits.

**Request Body:**
```json
{
  "po_id": "uuid-here",
  "cut_qty": 520,
  "pcs_per_bundle": 50
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Cut registered. 11 Bundles and 520 Single Pieces generated.",
  "data": {
    "cut_register_id": "uuid",
    "total_bundles": 11,
    "total_single_pieces": 520
  }
}
```
