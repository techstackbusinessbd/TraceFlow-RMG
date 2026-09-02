# Module 06: Backend Rules (Value Addition)
**Role:** Backend Developer
**Status:** Approved

## 1. Bundle State Machine
The `bundles` table has a strict `status` enum.
- Rule: A bundle must flow sequentially: `Cut` -> `At Print` -> `Ready for Sewing`.
- You MUST enforce this in the Service class.
  ```php
  if ($bundle->status !== 'Cut') {
      throw new Exception("Bundle is in invalid state: " . $bundle->status);
  }
  ```

## 2. Reject Quantity Deduction (Transaction)
When receiving bundles back:
- If `reject_qty > 0`, you must UPDATE the `bundles` table to decrement `qty` (e.g., `qty = qty - reject_qty`).
- You must INSERT a row into `bundle_transactions` tracking the exact reject amount.
- This MUST be wrapped in a `DB::transaction()` to prevent phantom deductions.
