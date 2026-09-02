# Test Cases: Module 01 (Auth & Admin)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Valid Web Login (Positive)
- **Step 1:** Navigate to `/login`.
- **Step 2:** Enter valid admin email and password.
- **Step 3:** Click "Sign In".
- **Expected Result:** API returns 200 OK with token. UI redirects to Dashboard. LocalStorage/Cookie contains the token.

## 2. Test Case: Rate Limiting (Negative)
- **Step 1:** Enter incorrect password 5 times rapidly.
- **Step 2:** Try to login with the *correct* password on the 6th attempt.
- **Expected Result:** API returns `429 Too Many Requests`. Message reads "Too many login attempts. Please try again in 15 minutes."

## 3. Test Case: RBAC Enforcement (Security Guard)
- **Step 1:** Login as a user with ONLY `view-dashboard` permission.
- **Step 2:** Attempt to manually navigate to the URL `/master-data/buyers/create`.
- **Expected Result:** UI renders a `403 Access Denied` screen.
- **Step 3:** Use Postman with this user's token and call `POST /api/v1/master-data/buyers`.
- **Expected Result:** API strictly returns `403 Forbidden` regardless of UI bypass.

## 4. Test Case: Token Revocation
- **Step 1:** User A logs into their account on a browser.
- **Step 2:** Super Admin deactivates User A (`is_active = false`).
- **Step 3:** User A attempts to click any link or refresh the page.
- **Expected Result:** The API returns `401 Unauthorized` (because tokens were flushed). The frontend catches the 401 and forces User A back to the Login screen.
