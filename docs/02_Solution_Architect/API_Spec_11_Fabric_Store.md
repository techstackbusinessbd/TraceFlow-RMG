# API Specification & Schema Details
**Module:** 10 - Store

### Table: `inventory`
- `id` UUID PK
- `item_code` String
- `balance` Decimal
- `allocated_po_id` UUID FK
