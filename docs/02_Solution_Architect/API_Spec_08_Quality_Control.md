# API Specification & Schema Details
**Module:** 08 - QC

### Table: `qc_inspections`
- `id` UUID PK
- `bundle_id` UUID FK
- `status` Enum (Pass, Alter, Reject)
- `dhu` Decimal

### API Endpoints
`POST /api/v1/qc/inspect`
Payload:
```json
{
  "bundle_id": "uuid",
  "pass_qty": 48,
  "defects": [{"type": "Stitch", "qty": 2}]
}
```
