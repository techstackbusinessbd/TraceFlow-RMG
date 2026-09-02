# API Specification & Schema Details
**Module:** 07 - Sewing

### Table: `sewing_transactions`
- `id` UUID PK
- `bundle_id` UUID FK
- `line_id` UUID FK
- `operation_type` Enum (Input, Output)
- `scanned_at` Timestamp

### API Endpoints
`POST /api/v1/sewing/scan`
Payload:
```json
{
  "line_id": "uuid",
  "scans": [
    {"qr": "BNDL-001", "type": "Input", "time": "2026-08-28T10:00:00"}
  ]
}
```
