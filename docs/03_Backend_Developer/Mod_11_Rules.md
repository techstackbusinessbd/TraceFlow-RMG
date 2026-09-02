# Module 11: Backend Rules (Inventory & Store)
**Role:** Backend Developer
**Status:** Approved

## 1. Double-Entry Ledger Logic (Raw Materials)
Never store inventory balances as a simple integer that you just update (`qty = qty - 5`). This leads to data corruption during concurrent requests.
- **Rule:** Every movement must INSERT a new row into `inventory_ledgers`.
- **Calculation:** To find the current balance for an item, the backend must calculate:
  `$balance = Ledger::where('item_id', $id)->sum('qty_in') - Ledger::where('item_id', $id)->sum('qty_out');`
- Or, store the running `$balance` in the ledger row itself, but wrap the insert in an exclusive database lock (`lockForUpdate()`) to prevent race conditions when two operators issue the same item at the same millisecond.

## 2. Location Mapping Validation
Before updating `cartons.location_id`:
- Ensure `cartons.status` === 'Sealed'. (You cannot store an open carton).
- Check if `location_id` is already set. If yes, throw a 409 Conflict (prevent accidental overwriting of location).
