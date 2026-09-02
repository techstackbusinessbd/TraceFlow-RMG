# Module 10: Backend Rules (Finishing & Packing)
**Role:** Backend Developer
**Status:** Approved

## 1. Mismatch Prevention Logic (Strict)
When a single piece QR is scanned:
1. Lookup the `single_piece_id` to find its `po_id`, `color_id`, and `size_id`.
2. Lookup the active `carton_id` requirements.
3. Compare them. If the carton is meant for `Red-M` and the scanned piece is `Blue-L`, throw a hard `Exception` (422 Unprocessable Entity).
4. Do NOT insert into `carton_contents`.

## 2. Auto-Seal Transaction
When the scanned piece is valid:
- Insert into `carton_contents`.
- Count total items in the carton: `carton_contents()->count()`.
- If `count == capacity`:
  - Update `cartons` status to `Sealed`.
  - Update all `single_piece_qrs` inside this carton to `status = Packed`.
- ALL of these checks and updates MUST occur inside a `DB::transaction()` to prevent race conditions where 21 pieces get packed into a 20-capacity carton.
