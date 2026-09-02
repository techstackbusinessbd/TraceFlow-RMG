# Database Optimization Rules
**Role:** Backend Developer
**Status:** Approved

## 1. Query Optimization
- N+1 Query problem must be avoided using Eloquent `with()`.
- Use `chunk()` or `cursor()` for generating large reports (e.g., Exporting 100,000 bundles).
- Avoid `SELECT *`. Always select specific columns.

## 2. Indexing Strategy
- Foreign keys (`buyer_id`, `style_id`, `po_id`) MUST be indexed.
- Columns used frequently in WHERE clauses (e.g., `qr_code`, `status`) must have indexes.

## 3. Caching (Redis)
- Static Master Data (Buyers, Styles, Colors) must be cached via Redis.
- Analytics endpoints (Mod 12) must return cached data. Cache should clear every 5 mins.
