# API Specification & DB Schema
**Module:** 01 - System Admin & User Management
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Database Schema Specifications

### 1.1. Table: `roles`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `name` | VARCHAR(50) | Unique, Not Null | e.g. "Super Admin" |
| `permissions` | JSONB | Not Null | Array of permission strings. |
| `created_at`, `updated_at` | TIMESTAMP | - | - |

### 1.2. Table: `users`
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `name` | VARCHAR(100) | Not Null | User's full name. |
| `email` | VARCHAR(150) | Unique, Not Null | Login email. |
| `password` | VARCHAR(255) | Not Null | Bcrypt hashed. |
| `role_id` | UUID | Foreign Key | References `roles.id`. |
| `is_active` | BOOLEAN | Default: true | Soft deactivation. |
| `created_at`, `updated_at`, `deleted_at` | TIMESTAMP | - | Soft Deletes. |

### 1.3. Table: `devices` (For Tablets)
| Column Name | Data Type | Modifiers | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | PK |
| `device_name` | VARCHAR(100) | Unique, Not Null | e.g. "Tablet-Sewing-01" |
| `pin_code` | VARCHAR(10) | Unique, Not Null | Hashed PIN. |
| `line_id` | UUID | Foreign Key | Locked to Module 1 Line. |
| `is_active` | BOOLEAN | Default: true | Can be revoked. |

---

## 2. API Endpoints

### 2.1. Web Login (POST `/api/v1/auth/login`)
**Description:** Authenticates user and returns a Sanctum Bearer token.
*No Bearer token required for this route.*

**Request Body (JSON):**
```json
{
  "email": "admin@factory.com",
  "password": "Password123!"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "System Admin",
      "role": "Super Admin",
      "permissions": ["*"]
    },
    "token": "1|laravel_sanctum_token_string_here"
  }
}
```

**Error Response (401 Unauthorized - Invalid Credentials):**
```json
{
  "status": "error",
  "message": "Invalid email or password."
}
```

### 2.2. Get Current User Profile (GET `/api/v1/auth/me`)
**Headers:** `Authorization: Bearer <token>`
**Description:** Validates the token and returns the user's current permissions. Frontend calls this on page load to hydrate Redux state.

**Success Response (200 OK):**
*(Same user object as login response).*

### 2.3. Logout (POST `/api/v1/auth/logout`)
**Headers:** `Authorization: Bearer <token>`
**Description:** Revokes the current token.

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Logged out successfully."
}
```
