# System Configuration Strategy (Dynamic Settings)
**Role:** Solution Architect
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
Enterprise software requires flexibility. Hardcoding business rules (like tolerance levels or threshold limits) in the code or `.env` files is a poor practice because changing them requires server redeployments. 

This document outlines the architecture for managing **Global System Settings** dynamically via the Admin Panel, without requiring any code changes.

---

## 2. Database Architecture (Key-Value Store)

### 2.1. The `system_settings` Table
We will use a generic key-value table to store all configurations.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key |
| `key` | `string` | Unique identifier (e.g., `dhu_alert_threshold`) |
| `value` | `json/text` | The actual setting value |
| `type` | `string` | Data type for frontend validation (e.g., `integer`, `boolean`, `json`) |
| `description` | `string` | Tooltip/help text for the Admin Panel |

---

## 3. Performance & Caching (Redis)

### 3.1. The Problem
If the API checks the `system_settings` table every time a Sewing Operator scans a piece to see if the DHU threshold is crossed, it will add millions of unnecessary database queries daily.

### 3.2. The Solution (Cache Forever)
- All settings must be loaded into **Redis Cache** using `Cache::rememberForever('global_settings')`.
- The application will strictly read settings from Redis, resulting in `0` database queries for configuration checks.
- **Cache Invalidation:** When a Super Admin updates a setting via the Admin Panel, the Backend API will trigger `Cache::forget('global_settings')` to refresh the data.

---

## 4. Key Configurations (Managed via Admin Panel)

The following critical parameters MUST be configurable from the Admin Panel:

### 4.1. Quality Control (QC) Settings
- **`dhu_alert_threshold`:** (Integer) e.g., `5`. If the Defects Per Hundred Units (DHU) on a sewing line exceeds this number, trigger a red alert on the UI.

### 4.2. Shipment & Packing Settings
- **`export_short_shipment_tolerance_pct`:** (Float) e.g., `2.0`. The percentage of short-shipment allowed before blocking a container load.
- **`carton_weight_tolerance_kg`:** (Float) e.g., `0.5`. Permitted variance between theoretical carton weight and actual scale weight.

### 4.3. Operational Settings
- **`factory_shift_timings`:** (JSON) Defines Morning, Evening, and Night shift start/end times. Used for daily reporting.
- **`scanner_idle_timeout_min`:** (Integer) e.g., `15`. Automatically logs out the tablet if no scans occur within this timeframe.

---
*(End of System Configuration Strategy)*
