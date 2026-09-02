# Module 04: Backend Rules (Production Planning)
**Role:** Backend Developer
**Status:** Approved

## 1. Domain-Driven Design (Service-to-Service Calls)
- The `PlanningController` MUST NOT write raw SQL queries targeting the `store_inventories` table. 
- You must create a `StoreService` (or interface) that the `PlanningService` calls to check material readiness.
- Example: `$storeService->checkMaterialAvailability($po_id);`
- This ensures loose coupling. If the Store module is ever refactored into a microservice, the Planning module won't break.

## 2. Schedule Conflict Logic
- When inserting a new plan, use PostgreSQL 17 Date Overlap queries (or tsrange / GiST exclusion constraints).
- Do NOT pull all records into PHP and check with loops (Memory Leak risk).
- Laravel Query Example:
  ```php
  $conflict = ProductionPlan::where('line_id', $request->line_id)
    ->where(function ($query) use ($request) {
        $query->whereBetween('start_date', [$request->start_date, $request->end_date])
              ->orWhereBetween('end_date', [$request->start_date, $request->end_date]);
    })->exists();
  ```
