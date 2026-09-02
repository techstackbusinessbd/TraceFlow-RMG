# Error Handling & Logging SOP
**Role:** Backend Developer / Solution Architect
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Global Exception Handling
In Laravel 13, error handling is configured directly in `bootstrap/app.php`. 
We MUST ensure that all API errors return a standardized JSON response. HTML error pages should NEVER be exposed to the React frontend or Android app.

### 1.1. Standardized API Error Response
All API exceptions must be caught and transformed into this exact JSON structure:

```json
{
    "success": false,
    "message": "A human-readable error message.",
    "error_code": "ERR_VALIDATION", 
    "details": {
        "field_name": ["Specific validation error"]
    }
}
```

### 1.2. `bootstrap/app.php` Configuration
```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (Throwable $e, Request $request) {
        if ($request->is('api/*')) {
            // Handle Validation Errors
            if ($e instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Failed',
                    'error_code' => 'ERR_VALIDATION',
                    'details' => $e->errors(),
                ], 422);
            }

            // Handle Unauthorized
            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                    'error_code' => 'ERR_UNAUTHORIZED',
                ], 401);
            }

            // Generic Fallback
            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'Internal Server Error',
                'error_code' => 'ERR_SERVER',
            ], 500);
        }
    });
})
```

---

## 2. Structured Logging
Since this is an Enterprise ERP, tracing issues (like a failed bulk barcode scan) is critical.

### 2.1. Log Channels
Do not use the default `single` log channel for everything. We will configure specific channels in `config/logging.php`:
- `daily`: For general application logs (kept for 30 days).
- `api_requests`: For logging all incoming API payloads (critical for debugging tablet scanner issues).
- `database`: For logging slow queries (> 500ms).

### 2.2. Contextual Logging Rule
Never write a log with just a string message. You MUST include context (User ID, IP, Request Payload).

❌ **BAD:**
`Log::error('Scanner failed to save piece.');`

✅ **GOOD:**
```php
Log::channel('daily')->error('Scanner failed to save piece.', [
    'user_id' => auth()->id(),
    'device_id' => $request->header('X-Device-ID'),
    'payload' => $request->all(),
    'error' => $e->getMessage()
]);
```

---

## 3. Frontend Error Handling (React)
- **Axios Interceptor:** The React app MUST use a global Axios interceptor to catch `401 Unauthorized` (to redirect to login) and `500 Server Error` (to show a generic Toast notification).
- **Error Boundaries:** Wrap critical React modules (like the Barcode Scanner component) in an Error Boundary so if it crashes, it doesn't break the entire Admin Panel.
