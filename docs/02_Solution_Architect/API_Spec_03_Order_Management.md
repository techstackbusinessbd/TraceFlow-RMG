# API Specification & DB Schema
**Module:** 03 - Order Management (Merchandising)
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `purchase_orders`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `po_number` | VARCHAR(100) | Unique, Not Null | e.g. PO-88992 |
| `buyer_id` | UUID | Foreign Key | References `buyers.id`. |
| `style_id` | UUID | Foreign Key | References `styles.id`. |
| `total_qty` | INTEGER | Not Null | Total order quantity. |
| `delivery_date` | DATE | Not Null | Shipment target date. |
| `techpack_url` | VARCHAR(255) | Nullable | Cloud Storage URL. |
| `status` | ENUM | Default: 'Draft' | 'Draft', 'Confirmed', 'Shipped'. |
| `created_by` | UUID | Foreign Key | References `users.id`. |
| `created_at`, `updated_at`, `deleted_at` | TIMESTAMP | - | - |

### 1.2. Table: `po_breakdowns`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `po_id` | UUID | Foreign Key | References `purchase_orders.id`. |
| `color_id` | UUID | Foreign Key | References `colors.id`. |
| `size_id` | UUID | Foreign Key | References `sizes.id`. |
| `qty` | INTEGER | Not Null | Number of pieces for this ratio. |
*Constraints:* `po_id` Cascade on delete.

---

## 2. API Endpoints

### 2.1. Create Purchase Order with Breakdown
**Endpoint:** `POST /api/v1/orders`
**Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body:**
```json
{
  "po_number": "PO-12345",
  "buyer_id": "9b1d3f-buyer-uuid",
  "style_id": "9b1d3f-style-uuid",
  "total_qty": 1000,
  "delivery_date": "2026-10-15",
  "breakdowns": [
    { "color_id": "uuid-red", "size_id": "uuid-s", "qty": 300 },
    { "color_id": "uuid-red", "size_id": "uuid-m", "qty": 700 }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "PO Created Successfully",
  "data": { "id": "new-po-uuid" }
}
```

**Validation Error Response (422 Unprocessable Entity - Mismatch):**
```json
{
  "status": "error",
  "message": "Validation Failed",
  "errors": {
    "total_qty": ["The sum of breakdowns (1000) does not match total_qty (1001)."]
  }
}
```

### 2.2. Upload Tech Pack (File Upload)
**Endpoint:** `POST /api/v1/orders/{id}/techpack`
**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body:**
- `file`: (Binary PDF/JPG file)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "File uploaded successfully.",
  "data": { "techpack_url": "https://s3.aws.com/.../TechPack_v1.pdf" }
}
```
