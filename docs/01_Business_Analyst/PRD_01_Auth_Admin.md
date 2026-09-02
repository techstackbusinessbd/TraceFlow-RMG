# Product Requirements Document (PRD)
**Module:** 01 - System Admin & User Management (Auth)
**Document Version:** 4.0 (Enterprise Detailed Edition)
**Author:** AI Business Analyst
**Status:** Approved for Architectural Design

---

## 1. Executive Summary
This module acts as the gatekeeper for the entire RMG Traceability Software. It handles User Authentication, Role-Based Access Control (RBAC), and physical Device Authorization (Tablets on the factory floor). Security is the highest priority here.

---

## 2. Target Personas
1. **Super Admin:** Has absolute bypass authority. Can create roles and assign permissions.
2. **Managers / Executives:** Web dashboard users with specific module access (e.g., Planning Manager only accesses Mod 2 and 3).
3. **Floor Operators:** Tablet users. They do not log in with passwords. Their tablets are pre-authenticated and locked to a specific Production Line.

---

## 3. Sub-Module & Feature Details

### 3.1. Sub-module: Role-Based Access Control (RBAC)
Controls what a user can see and do.

#### 3.1.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Role Name` | String | Yes | Unique. e.g., "QC Manager", "Line Chief" | Text Input |
| `Permissions` | Array | Yes | Must be a JSON array of valid route names (e.g., `["view-dashboard", "create-po"]`) | Checkbox Grid |

#### 3.1.2. Business Rules & Edge Cases
- **Rule 1 (Super Admin Immunity):** The role `Super Admin` cannot be edited or deleted. It automatically bypasses all permission checks.
- **Rule 2 (Dynamic UI):** If a user does not have the `view-master-data` permission, the Master Data menu item must be completely hidden from the Frontend Sidebar.

---

### 3.2. Sub-module: User Management
Managing the human accounts.

#### 3.2.1. Field Level Validations
| Field Name | Type | Mandatory | Validation Rules | UI Component |
|---|---|---|---|---|
| `Name` | String | Yes | Min 3 chars. | Text Input |
| `Email` | String | Yes | Must be unique. Valid email format. | Email Input |
| `Password` | String | Yes | Min 8 chars, 1 uppercase, 1 number, 1 symbol. | Password Input |
| `Role_ID` | UUID | Yes | Must be an active role. | Dropdown |

#### 3.2.2. Edge Cases
- **Rule 1 (Self-Lockout):** A user cannot change their own role or deactivate their own account.
- **Rule 2 (Password Reset):** Must use secure Bcrypt hashing. No plaintext passwords allowed in the DB.

---

### 3.3. Sub-module: Tablet Device Authentication (Factory Floor)
Tablets do not have keyboards for operators to type complex passwords.

#### 3.3.1. Business Rules
- **Rule 1 (Device Registration):** Admin creates a "Device Profile" generating a unique 6-digit PIN.
- **Rule 2 (Line Locking):** The device is locked to a specific `Line_ID` (e.g., Sewing Line 1). 
- **Rule 3 (Login Flow):** The IT Admin enters the PIN on the tablet *once*. The backend issues a long-lived JWT token. The tablet is now permanently logged in as "Device: Line 1".

---

## 4. Non-Functional Requirements (NFRs)

### 4.1. Security
- **Token Expiry (Web):** Web dashboard JWT tokens expire after 2 hours of inactivity.
- **Token Expiry (Tablet):** Tablet tokens expire after 1 year (or until manually revoked by Admin).
- **Brute Force Protection:** Maximum 5 failed login attempts per minute per IP. Account locks for 15 minutes.

---
*(End of PRD for Module 01)*
