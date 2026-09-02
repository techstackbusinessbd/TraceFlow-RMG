# API Specification & Schema Details - ENTERPRISE READY
**Module:** 12 - BI & Analytics Dashboard
**Author:** Solution Architect
**Status:** 100% Production Ready

## 1. Database Schema Specifications
### Primary Table Structure
| metric_name | String | - |
| metric_value | Decimal | - |
| calculated_at | Timestamp | - |
*(All tables include standard `id` (UUID), `created_at`, `updated_at`, `deleted_at`)*

## 2. API Endpoints
All endpoints are secured via JWT/Sanctum and require valid RBAC permissions.

### 2.1. Main Transaction Endpoint
**Endpoint:** `POST /api/v1/transaction/bi-analytics-dashboard`
**Auth Required:** Yes (Bearer Token)

**Request Body (JSON - Offline Sync Compatible):**
```json
{
  "dashboard_type": "Management",
  "date_range": "Today"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Transaction recorded successfully.",
  "sync_id": "sync-req-5542"
}
```
