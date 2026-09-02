# Module 03: Backend Rules (Order Management)
**Role:** Backend Developer
**Status:** Approved

## 1. Cloud Storage Architecture (Tech Packs)
- Never store PDF files in the local `storage/app/public` folder.
- Use Laravel's `Storage::disk('s3')` or `gcs` for all file uploads.
- Tech Packs are confidential. Files must be private, and the API should generate a Temporary Signed URL (`Storage::temporaryUrl`) valid for 30 minutes when downloading.

## 2. Database Transaction strictly required
- Creating a PO involves inserting 1 row into `purchase_orders` and potentially 50+ rows into `po_breakdowns`.
- This MUST be wrapped in a `DB::transaction()`. If the breakdown fails to insert, the PO header must be rolled back.

## 3. Mathematical Validation inside FormRequest
- Create a Custom Rule inside `StorePurchaseOrderRequest`.
- Before hitting the controller, loop through the `$request->breakdowns` array, sum the `qty`, and assert it equals `$request->total_qty`. If it fails, throw standard Laravel ValidationException.
