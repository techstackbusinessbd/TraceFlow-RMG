# Module 01: UI/UX Specifications (Auth)
**Role:** Frontend Developer
**Status:** Approved

## 1. Login Interface
- Clean, minimalist design. Centered login card with Factory Logo.
- **Form Fields:** Email (input type `email`), Password (input type `password` with eye-toggle to show/hide).
- **Error Handling:** If API returns `401`, display a red alert box: "Incorrect email or password."

## 2. Token Storage & State
- **Web App:** Store token in `HttpOnly` cookies (preferred) or `localStorage`. 
- **Zustand/Redux State:** Store the user profile and permissions array globally.
- **App Hydration:** On page refresh, dispatch an action to call `GET /api/v1/auth/me`. Show a full-screen loading spinner while hydrating. If `401` is returned, redirect to `/login`.

## 3. RBAC Route Guarding (React Router)
- Create a `<ProtectedRoute requiredPermission="create-po">` wrapper component.
- If user does not have permission:
  - If navigating via URL: Render a `403 Forbidden` page.
  - If viewing a menu: The menu item itself should not render.
