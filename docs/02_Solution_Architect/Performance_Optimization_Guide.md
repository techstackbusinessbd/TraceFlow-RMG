# Performance Optimization Strategy
**Role:** Solution Architect / Tech Lead
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Executive Summary
The RMG Traceability Software tracks every single garment piece individually. In a factory with 20 sewing lines, this means handling up to **200+ scans per second**. To prevent database lockups, API timeouts, and slow UIs, all developers MUST adhere to this Performance Optimization Strategy.

---

## 2. Database Optimization (PostgreSQL)

### 2.1. Strict Indexing Rules
- **Foreign Keys:** Every column ending in `_id` (e.g., `po_id`, `bundle_id`) MUST have a database index.
- **Searchable Strings:** Columns frequently searched (e.g., `qr_code_string`, `carton_no`, `shipment_no`) MUST be indexed.
- **UUIDs:** Since we use UUIDs instead of auto-incrementing integers, ensure PostgreSQL is configured to handle UUID indexing efficiently.

### 2.2. Query Constraints
- **N+1 Prevention:** Developers must use Laravel's `with()` method (Eager Loading) in the Repository. Do not run queries inside loops.
- **Chunking Large Datasets:** When exporting reports or syncing large offline payloads, NEVER load thousands of records into memory at once. Use `DB::table('table')->chunk(500, function ($records) { ... })`.

---

## 3. Caching Strategy (Redis)
Do not hit the database for static data.

### 3.1. Master Data Caching
Data that rarely changes (Module 02: Buyers, Colors, Styles, Lines) must be cached using Laravel's `Cache::remember()`.

**Example:**
```php
$buyers = Cache::remember('all_buyers', 3600, function () {
    return Buyer::all();
});
```
*Note: Ensure cache is cleared when a new Buyer is created (Cache Invalidation).*

---

## 4. Background Processing (Laravel Horizon)
Heavy processing must not block the API response to the user's tablet.

### 4.1. Queue Usage
- **Sewing Scans:** When a tablet syncs 50 scans, the API must save the raw payload to Redis and immediately return `202 Accepted`. A background `ProcessSewingScansJob` will handle the actual DB inserts.
- **Notifications:** WebSocket broadcasts (Reverb) or Email notifications must be queued.

---

## 5. Frontend Optimization (React / Vite)

### 5.1. Lazy Loading Components
Do not bundle massive UI components into the initial page load. Use `React.lazy()` for heavy features.
- Example: The SVG Body Map in the QC Module should only load when the user navigates to the QC screen.

### 5.2. Network Requests (TanStack Query)
- Use `TanStack Query` (React Query) to cache API responses on the client side. 
- Prevents re-fetching the "List of Active POs" every time the user navigates back to the Dashboard.
- Implement **Optimistic UI Updates** so the tablet feels instantly responsive during scans, even if the network is slightly delayed.

---
*(End of Performance Strategy)*
