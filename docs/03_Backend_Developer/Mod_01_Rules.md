# Module 01: Backend Rules (Auth & Admin)
**Role:** Backend Developer
**Status:** Approved

## 1. Middleware Architecture
- **Global Auth:** All routes EXCEPT `/api/v1/auth/login` must be wrapped in `Route::middleware('auth:sanctum')`.
- **Role Permissions:** Use Laravel Gates for checking JSON permissions.
  - Example in `AuthServiceProvider.php`:
    ```php
    Gate::define('create-po', function ($user) {
        if ($user->role->name === 'Super Admin') return true;
        return in_array('create-po', $user->role->permissions);
    });
    ```
- **Controller Enforcement:** Controllers must call `$this->authorize('create-po');` on specific actions. Throws `403 Forbidden` automatically if unauthorized.

## 2. Password Security
- Do not log passwords in `Log::error`. Ensure `password` is added to `$dontFlash` in `Exceptions/Handler.php`.
- Strictly enforce `Hash::make()` before saving to the database.

## 3. Token Revocation
- When a user's role is updated or they are marked `is_active = false` by an admin, the system MUST revoke all their existing Sanctum tokens using `$user->tokens()->delete();`.
