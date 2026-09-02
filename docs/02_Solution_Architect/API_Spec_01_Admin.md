# API Specification & Schema Details
**Module:** 01 - System Admin
**Author:** Solution Architect

## 1. Database Schema Specifications

### Table: `users`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique Identifier |
| role_id | UUID | Foreign Key (roles.id) | RBAC Role Link |
| name | String(150) | Not Null | User's full name |
| email | String(150) | Unique, Not Null | Login ID |
| password | String(255) | Not Null | Bcrypt Encrypted |
| status | Boolean | Default: True | Active/Inactive |
| created_at | Timestamp | - | - |
| updated_at | Timestamp | - | - |

### Table: `roles`
| Column Name | Data Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique Identifier |
| name | String(50) | Unique, Not Null | E.g. Admin, QA |
| permissions | JSON | Nullable | Array of allowed modules |
| created_at | Timestamp | - | - |
| updated_at | Timestamp | - | - |

## 2. API Endpoints

### 2.1. User Login
**Endpoint:** `POST /api/v1/auth/login`
**Auth Required:** No

**Request Body (JSON):**
```json
{
  "email": "admin@rmg.com",
  "password": "secretpassword"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "1|LaravelSanctumTokenXYZ...",
    "user": {
      "id": "abc...",
      "name": "Super Admin",
      "role": "Admin",
      "permissions": ["all"]
    }
  }
}
```

### 2.2. Error Response (Invalid Login or Inactive User)
**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "message": "Invalid credentials or account is inactive."
}
```

---
*Status: Ready for Backend Developer to start coding based on this schema & API spec.*
