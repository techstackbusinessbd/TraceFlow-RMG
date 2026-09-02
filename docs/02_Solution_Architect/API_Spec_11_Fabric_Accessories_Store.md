# API Specification & Schema Details - ENTERPRISE READY
**Module:** 11 - Fabric & Accessories Store
**Author:** Solution Architect
**Status:** 100% Production Ready

## 1. Database Schema Specifications
### Primary Table Structure
| item_name | String | - |
| received_qty | Decimal | - |
| allocated_po | UUID | Foreign |
*(All tables include standard `id` (UUID), `created_at`, `updated_at`, `deleted_at`)*

## 2. API Endpoints
All endpoints are secured via JWT/Sanctum and require valid RBAC permissions.

### 2.1. Main Transaction Endpoint
**Endpoint:** `POST /api/v1/transaction/fabric-accessories-store`
**Auth Required:** Yes (Bearer Token)

**Request Body (JSON - Offline Sync Compatible):**
```json
{
  "item_code": "FAB-001",
  "received_qty": 15000.50,
  "uom": "Yards",
  "po_id": "uuid"
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
