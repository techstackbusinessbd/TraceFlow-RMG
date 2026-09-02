# Module 02: Backend Rules (Master Data)
**Role:** Backend Developer
**Status:** Approved

## 1. Repository Pattern Implementation
- Do NOT inject Eloquent Models directly into the Controller.
- Create `BuyerRepositoryInterface` and `BuyerRepository`.
- **Reason:** If we switch from PostgreSQL to MongoDB for any reason, controllers remain untouched.

## 2. API Caching Strategy (Redis)
- Endpoint: `GET /api/v1/master-data/buyers/active`
- Cache Key: `master_data:buyers:active`
- Cache Duration: `3600 seconds` (1 hour).
- **Invalidation:** Listen to `BuyerCreated`, `BuyerUpdated`, `BuyerDeleted` events. Inside the listener, call `Cache::forget('master_data:buyers:active')`.

## 3. Database Transactions
- When creating a Buyer, wrap the query in `DB::transaction(function() { ... })`.
- If an exception occurs, Laravel automatically rolls back.
- Log error: `Log::error('Failed to create buyer', ['data' => $request->all(), 'error' => $e->getMessage()]);`
