# API Specification & DB Schema
**Module:** 04 - Production Planning
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `production_plans`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `po_id` | UUID | Foreign Key | References `purchase_orders.id`. |
| `line_id` | UUID | Foreign Key | References `lines.id`. |
| `start_date` | DATE | Not Null | - |
| `end_date` | DATE | Not Null | - |
| `smv` | DECIMAL(5,2) | Not Null | e.g. 15.50 |
| `manpower` | INTEGER | Not Null | Total operators |
| `efficiency_target`| DECIMAL(5,2) | Not Null | e.g. 65.00 |
| `hourly_target` | INTEGER | Computed | Cached result of the math. |
| `is_locked` | BOOLEAN | Default: false | True if material check passed. |
| `created_by` | UUID | Foreign Key | References `users.id`. |
| `created_at`, `updated_at` | TIMESTAMP | - | - |

---

## 2. API Endpoints

### 2.1. Calculate & Validate Plan
**Endpoint:** `POST /api/v1/planning/calculate`
**Description:** Calculates Hourly Target and checks for Line Schedule Conflicts (dry-run).

**Request Body:**
```json
{
  "po_id": "uuid-here",
  "line_id": "uuid-here",
  "start_date": "2026-09-01",
  "end_date": "2026-09-10",
  "smv": 15.0,
  "manpower": 30,
  "efficiency_target": 60
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "hourly_target": 72,
    "has_conflict": false
  }
}
```

**Conflict Error (409 Conflict):**
```json
{
  "status": "error",
  "message": "Schedule Conflict: Line-01 is already booked from 2026-09-02 to 2026-09-05."
}
```

### 2.2. Lock Plan & Material Check
**Endpoint:** `POST /api/v1/planning/{id}/lock`
**Description:** Internally hits Store Service. Locks the plan if materials are ready.

**Warning Response (200 OK - Needs Override):**
```json
{
  "status": "warning",
  "message": "Material Shortage! Fabric is only 80% available. Require Manager PIN to proceed.",
  "requires_override": true
}
```

**Request Body for Override:**
```json
{
  "override_pin": "123456"
}
```
