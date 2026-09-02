# API Specification & DB Schema
**Module:** 02 - Master Data
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `buyers`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique global identifier. |
| `name` | VARCHAR(100) | Unique, Not Null | Name of the buyer (e.g., Zara). |
| `country` | VARCHAR(100) | Not Null | ISO country name. |
| `contact_email` | VARCHAR(150) | Nullable | Primary contact email. |
| `is_active` | BOOLEAN | Default: true | Soft deactivation flag. |
| `created_by`| UUID | Foreign Key | References `users.id`. |
| `created_at`| TIMESTAMP | - | - |
| `updated_at`| TIMESTAMP | - | - |
| `deleted_at`| TIMESTAMP | Nullable | For Soft Deletes. |

### 1.2. Table: `styles`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique global identifier. |
| `buyer_id` | UUID | Foreign Key | References `buyers.id`. |
| `style_no` | VARCHAR(50) | Not Null | Style number/code. |
| `category` | ENUM | Not Null | Knit, Woven, Sweater, Denim. |
| `base_smv` | DECIMAL(5,2)| Nullable | e.g. 15.50. |
| `is_active` | BOOLEAN | Default: true | Soft deactivation flag. |
*Composite Unique Key:* `UNIQUE(buyer_id, style_no, deleted_at)` to prevent duplicate styles for the same buyer unless deleted.

*(Tables for colors, sizes, and lines follow the exact same UUID and SoftDelete pattern).*

---

## 2. API Endpoints

All endpoints are protected by Laravel Sanctum Middleware (`auth:sanctum`).

### 2.1. Create Buyer
**Endpoint:** `POST /api/v1/master-data/buyers`
**Description:** Creates a new buyer record.

**Request Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

**Request Body (JSON):**
```json
{
  "name": "H&M",
  "country": "Sweden",
  "contact_email": "sourcing@hm.com",
  "is_active": true
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Buyer created successfully.",
  "data": {
    "id": "9b1d3f...",
    "name": "H&M",
    "country": "Sweden",
    "is_active": true
  }
}
```

**Validation Error Response (422 Unprocessable Entity):**
```json
{
  "status": "error",
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name has already been taken."],
    "country": ["The country field is required."]
  }
}
```

### 2.2. Get All Active Buyers (Dropdown)
**Endpoint:** `GET /api/v1/master-data/buyers/active`
**Description:** Returns a lightweight array of active buyers for frontend dropdowns. Uses Redis caching.

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    { "value": "uuid-1", "label": "H&M" },
    { "value": "uuid-2", "label": "Zara" }
  ]
}
```

### 2.3. Delete (Soft Delete) Style
**Endpoint:** `DELETE /api/v1/master-data/styles/{id}`
**Description:** Soft deletes a style. Fails if style is used in a Purchase Order.

**Error Response (409 Conflict):**
```json
{
  "status": "error",
  "message": "Cannot delete style. It is currently associated with 2 active Purchase Orders."
}
```
