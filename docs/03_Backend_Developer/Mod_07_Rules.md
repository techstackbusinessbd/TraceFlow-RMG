# Module 07: Backend Rules (Sewing)
**Role:** Backend Developer
**Status:** Approved

## 1. High Concurrency Architecture (Redis Queues)
- **Problem:** If 100 sewing lines each scan a bundle at the exact same second, firing 100 DB Transactions simultaneously to update `bundles` and insert `sewing_logs` will cause DB deadlocks and timeouts.
- **Solution:** 
  - The `POST /api/v1/sewing/sync` endpoint MUST NOT write directly to the database.
  - It must dispatch a Laravel Job (e.g., `ProcessSewingScansJob`) to a Redis Queue.
  - Return `202 Accepted` immediately to the tablet so the operator can keep scanning.
  - A background Queue Worker (`php artisan queue:work`) will process the jobs sequentially, updating the database safely.

## 2. Hourly Aggregation
- Do not run `SUM()` queries on `sewing_logs` for the real-time TV dashboard; it will crash the server.
- The Queue Worker that processes the scan must increment the `hourly_productions` table using `upsert()` or `increment()`.
