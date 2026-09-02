# API Specification & DB Schema
**Module:** 09 - Washing
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `wash_batches` (The Challans)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `batch_no` | VARCHAR(50) | Unique, Not Null | E.g., WASH-2608-001 |
| `wash_type` | VARCHAR(50) | Not Null | E.g., 'Enzyme', 'Silicone' |
| `plant_name` | VARCHAR(100)| Not Null | Destination plant. |
| `status` | ENUM | Default: 'Sent'| 'Sent', 'Received' |
| `created_by` | UUID | Foreign Key | References `users.id`. |

### 1.2. Table: `wash_transactions` (Audit Trail)
Tracks which exact pieces were in which batch.
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `wash_batch_id`| UUID | Foreign Key | References `wash_batches.id`. |
| `single_piece_id`| UUID | Foreign Key | References `single_piece_qrs.id`. |
| `is_rejected` | BOOLEAN | Default: false | True if ruined in wash. |

---

## 2. API Endpoints

### 2.1. Send to Wash (Bulk Create)
**Endpoint:** `POST /api/v1/washing/send`
**Description:** Creates a wash batch and updates the status of thousands of pieces.

**Request Body:**
```json
{
  "wash_type": "Enzyme",
  "plant_name": "Mega Wash Ltd",
  "single_piece_ids": [
    "uuid-piece-1",
    "uuid-piece-2",
    "... up to 5000 uuids ..."
  ]
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Wash Batch WASH-2608-001 created.",
  "data": { "total_pieces": 5000 }
}
```

### 2.2. Receive from Wash (Bulk Receive & Reject)
**Endpoint:** `POST /api/v1/washing/receive`
**Description:** Processes returning pieces, marking some as Wash_Pass and some as Wash_Reject.

**Request Body:**
```json
{
  "wash_batch_id": "uuid-wash-batch",
  "received_pieces": [
    { "single_piece_id": "uuid-piece-1", "is_rejected": false },
    { "single_piece_id": "uuid-piece-2", "is_rejected": true }
  ]
}
```
