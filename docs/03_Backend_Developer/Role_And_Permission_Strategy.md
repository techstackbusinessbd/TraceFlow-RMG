# Role, Permission & Policy Management Strategy
**Role:** Backend Developer / Frontend Developer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To ensure strict data security across all 12 modules, we will use the `spatie/laravel-permission` package for Role-Based Access Control (RBAC). This document outlines how developers must implement and check permissions in both the Laravel Backend and the React Frontend.

---

## 2. Super Admin Bypass (Backend)
The `Super Admin` role must have access to everything without explicitly assigning hundreds of permissions.
**Implementation:** In the `AuthServiceProvider` (or `AppServiceProvider`), add a `Gate::before` rule.

```php
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::before(function ($user, $ability) {
        return $user->hasRole('Super Admin') ? true : null;
    });
}
```

---

## 3. Backend Implementation (Laravel)

### 3.1. Route Protection (Middleware)
Do not check permissions inside the Controller logic. Protect the API routes directly using Spatie's middleware.

```php
// routes/api.php
Route::group(['middleware' => ['auth:sanctum']], function () {
    
    // Only users with 'delete_po' permission can hit this endpoint
    Route::delete('/purchase-orders/{id}', [PurchaseOrderController::class, 'destroy'])
         ->middleware('permission:delete_po');
});
```

### 3.2. Granular Data Protection (Laravel Policies)
Sometimes a user has the "delete_po" permission, but they should only be allowed to delete POs created by their own factory. Use Laravel Policies for this.

```php
// app/Policies/PurchaseOrderPolicy.php
public function delete(User $user, PurchaseOrder $po): bool
{
    // Check if the PO belongs to the user's assigned factory
    return $user->factory_id === $po->factory_id;
}
```
*Usage in Controller:* `$this->authorize('delete', $po);`

---

## 4. Frontend Implementation (React)

### 4.1. The Auth Payload
When a user logs in, the backend must return their roles and permissions in the JSON payload.

```json
{
  "user": {
    "id": 1,
    "name": "Khaled",
    "roles": ["Factory Manager"],
    "permissions": ["view_po", "create_po", "edit_po"]
  }
}
```
*The React app will store this in a Global State (Zustand or Context).*

### 4.2. Hiding UI Elements (The `<HasPermission>` Component)
Developers must not show buttons to users who cannot use them. Create a reusable wrapper component.

```jsx
// src/components/HasPermission.jsx
const HasPermission = ({ permission, children }) => {
  const { user } = useAuth(); // Custom hook pulling from Zustand
  
  if (user.roles.includes('Super Admin') || user.permissions.includes(permission)) {
    return <>{children}</>;
  }
  return null;
};
```

**Usage Example:**
```jsx
<HasPermission permission="delete_po">
   <button className="bg-red-500">Delete PO</button>
</HasPermission>
```

---
*(End of RBAC Strategy)*
