# API Specification & Schema Details
**Module:** 02 - Master Data
**Author:** Solution Architect

## 1. Database Schema Specifications

### Table: `buyers`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique Identifier |
| name | String(100) | Not Null, Unique | Buyer Name (e.g. H&M) |
| country | String(50) | Nullable | Origin Country |
| status | Boolean | Default: True | Active/Inactive status |
| created_at | Timestamp | - | - |
| updated_at | Timestamp | - | - |

### Table: `styles`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique Identifier |
| buyer_id | UUID | Foreign Key (buyers.id) | Linked Buyer |
| style_no | String(100) | Not Null | E.g. HM-2023 |
| description | Text | Nullable | Style details |
| created_at | Timestamp | - | - |
| updated_at | Timestamp | - | Unique Index on (buyer_id, style_no) |

*(Note: ProductionLine, Color, Size tables follow similar standard UUID, Name, and timestamps format).*

## 2. API Endpoints

### 2.1. Create Buyer
**Endpoint:** `POST /api/v1/master-data/buyers`
**Auth Required:** Yes (JWT/Sanctum)

**Request Body (JSON):**
```json
{
  "name": "Zara",
  "country": "Spain"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Buyer created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Zara",
    "country": "Spain",
    "status": true
  }
}
```

### 2.2. Get Active Buyers
**Endpoint:** `GET /api/v1/master-data/buyers`
**Auth Required:** Yes

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "123e4567...",
      "name": "Zara",
      "country": "Spain"
    }
  ]
}
```

---
*Status: Ready for Backend Developer to start coding based on this schema & API spec.*
