# Module 09: Backend Rules (Washing)
**Role:** Backend Developer
**Status:** Approved

## 1. Bulk State Update (Performance)
- **Problem:** Updating 5000 rows in the `single_piece_qrs` table one by one will take too long and cause DB locks.
- **Solution:** 
  - Validate all UUIDs first: `whereIn('id', $ids)->where('status', 'QC_Pass')->count()`. If the count doesn't match the input array length, throw an error.
  - Perform a single bulk UPDATE query: `DB::table('single_piece_qrs')->whereIn('id', $ids)->update(['status' => 'At Wash'])`.
  - Use Laravel's `chunk()` if the array size exceeds database limits (e.g., chunk by 1000).

## 2. Transaction Integrity
- When receiving pieces, you must insert rows into `wash_transactions` AND update the `single_piece_qrs` statuses (to `Wash_Pass` or `Wash_Reject`) AND update `wash_batches.status` to 'Received'.
- ALL of these operations MUST be wrapped in a `DB::transaction()`.
