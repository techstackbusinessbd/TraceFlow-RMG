# Zero-Hardcode Architecture & Dynamic System Policy
**Project:** RMG Traceability Software  
**Standard:** Strict Zero-Hardcode Engineering Standard  
**Status:** Mandatory Across All 12 Modules  

---

## 1. Executive Summary & Policy Statement
**"Hardcoding business rules, master lists, operational thresholds, role definitions, or static select options in the codebase is strictly prohibited."**

All manufacturing rules, master catalogs, workflow tolerances, operational parameters, and UI options MUST be:
1. Driven from database-backed domain models or the `system_settings` key-value store.
2. Cached in **Redis** with high-throughput in-memory reads (`Cache::rememberForever`).
3. Fully manageable and editable by Super Admin and Admin through the Web Admin Console.

---

## 2. Zero-Hardcode Taxonomy (The 5 Rules)

### Rule 1: Dynamic Operational Thresholds & Business Tolerances
- **Prohibited:** Writing `if ($dhu > 5.0)` or `if ($variance > 0.5)` directly in controllers or services.
- **Mandatory:** Injecting the `SystemSettingService` or querying the Redis configuration store.
```php
// ❌ STRICTLY FORBIDDEN:
if ($dhu > 5.0) { ... }

// ✅ MANDATORY STANDARD:
$threshold = (float) $this->settingService->get('dhu_alert_threshold', 5.0);
if ($dhu > $threshold) { ... }
```

### Rule 2: Dynamic Roles, Scopes & Authorization
- **Prohibited:** Hardcoding static array options for user roles in React forms or controllers (e.g. `<option>Line Supervisor</option>`).
- **Mandatory:** Reading dynamically from Spatie's `roles` and `permissions` tables via the `/api/v1/admin/roles` endpoint.

### Rule 3: Dynamic Master Data Relations
- **Prohibited:** Storing hardcoded strings for Buyers, Brands, Production Lines, Stations, Colors, Sizes, or Garment Types.
- **Mandatory:** Normalizing into Master Data tables (`buyers`, `brands`, `styles`, `lines`, `colors`, `sizes`) with UUID foreign keys and REST CRUD operations.

### Rule 4: Dynamic Factory Floor Terminals & Tablet Locks
- **Prohibited:** Hardcoding line numbers (e.g. `"Line 01"`) into tablet authentication logic.
- **Mandatory:** Resolving tablet device locks from the `devices` table with dynamic line associations (`line_id`).

### Rule 5: Dynamic Shift & Working Hour Calculations
- **Prohibited:** Hardcoding 8-hour or 10-hour shift lengths into IE SMV or worker efficiency math.
- **Mandatory:** Fetching `factory_shift_hours` and `factory_shift_timings` from system settings.

---

## 3. High-Performance Caching Architecture (Redis Cache-Aside)

To prevent performance degradation during thousands of real-time shop floor scans:
1. **0-DB Query Reads:** All system parameters are read exclusively from Redis.
2. **Instant Cache Invalidation:** Any administrative change dispatches `Cache::forget()` and synchronizes all connected floor tablets via WebSocket / SSE broadcasts.

```text
[Web Admin / Floor Tablet]
          │
          ▼
   [Redis In-Memory] ──(Cache Hit: 0.1ms)──► [Immediate Scan Validation]
          │
     (Cache Miss)
          ▼
   [PostgreSQL DB] ──► [Cache::rememberForever]
```

---

## 4. Developer Compliance & Code Review Checklist
Before any Pull Request is approved for the `develop` branch:
- [ ] No hardcoded thresholds or magic numbers found in Services or Controllers.
- [ ] All select dropdown options in React components are loaded from API endpoints.
- [ ] All database queries rely on dynamic Eloquent models and foreign keys.
- [ ] Any new system-wide parameter is added to `SystemSettingService::seedDefaults()`.

---

*(End of Zero-Hardcode Architecture Specification)*
