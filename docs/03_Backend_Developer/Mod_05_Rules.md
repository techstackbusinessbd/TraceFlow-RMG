# Module 05: Backend Rules (Cutting)
**Role:** Backend Developer
**Status:** Approved

## 1. Mass Insert Optimization (Crucial)
- **Problem:** If `Cut Qty` is 100,000 and `Pcs per Bundle` is 10, the system needs to generate 10,000 QR codes (UUIDs) instantly. Looping `Bundle::create()` 10,000 times will cause a PHP Memory Exhaustion and 504 Gateway Timeout.
- **Solution:** 
  - Generate a flat array of data in PHP.
  - Use Laravel's `insert()` method.
  - Use `array_chunk()` to insert 1000 records per DB query.
  ```php
  $bundles = []; // Fill array with 10,000 arrays
  $chunks = array_chunk($bundles, 1000);
  foreach($chunks as $chunk) {
      Bundle::insert($chunk);
  }
  ```
- **Constraint:** All of this MUST happen inside a `DB::transaction()`.

## 2. Tolerance Validation Check
- Query the `po_breakdowns` table for the specific Color & Size to get the Original Qty.
- Query the `cut_registers` table (SUM) for the same Color & Size to get Already Cut Qty.
- Math: `(Original Qty * 1.05) - Already Cut Qty`. If the new `Cut Qty` is greater than this, throw Validation Exception.
