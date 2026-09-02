# Module 12: Backend Rules (Export & Shipment)
**Role:** Backend Developer
**Status:** Approved

## 1. Destination/Buyer Mismatch (The Hard Block)
Before allowing a carton to be linked to a shipment:
1. Lookup the `shipments.buyer_id`.
2. Lookup the scanned `cartons.po_id` -> `purchase_orders.buyer_id`.
3. If they do NOT match exactly, immediately abort the transaction and throw a `422 Exception`. This prevents sending thousands of dollars of garments to the wrong customer.

## 2. PO Closure Logic (Event Driven)
- When the `shipments` status is changed from `Loading` to `Dispatched`:
  - Update `cartons` status to `Shipped`.
  - Calculate total shipped pieces for the related POs.
  - If `Shipped Qty >= (Ordered Qty - Tolerance)`, automatically update the `purchase_orders` status to `Closed`. This officially ends the traceability lifecycle for that PO.
