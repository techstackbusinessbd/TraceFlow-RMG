# Backend Architecture Guidelines
**Role:** Backend Developer
**Framework:** Laravel 13 API
**Status:** Approved

## 1. Coding Standards (PSR-12)
- All controllers must be thin. Business logic must reside in `Services`.
- Direct DB calls in controllers are prohibited. Use the **Repository Pattern**.
- Example: `BundleController` -> `BundleService` -> `BundleRepository`.

## 2. Error Handling & Logging
- Every DB transaction must be wrapped in a `DB::beginTransaction()` and `DB::commit()`.
- Use global `Try-Catch`. On Exception, call `DB::rollBack()` and log the error using Laravel `Log::error()` with Context.
- Return standard HTTP codes: `200` (Success), `201` (Created), `403` (Forbidden), `422` (Validation), `500` (Server Error).

## 3. API Security
- All endpoints must use `auth:sanctum` middleware.
- Request payloads must be validated using Laravel Form Requests.
