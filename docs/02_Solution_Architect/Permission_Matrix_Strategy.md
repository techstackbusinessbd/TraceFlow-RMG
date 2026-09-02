# Permission Matrix & Hierarchy Strategy
**Role:** Solution Architect / Database Engineer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
In an enterprise ERP, controlling access is not just about "Admin vs User". Access must be granular down to specific Sidebars, Sub-menus, Pages, and Buttons. This document defines the Database Schema modifications and the strict Naming Conventions for Permissions to make them manageable via the Admin Panel UI.

---

## 2. Database Hierarchy (Modifying Spatie)

By default, the `permissions` table in Spatie is flat. To show a grouped checklist in the Admin Panel (e.g., Master Data > Buyers > Edit), we must extend the table.

### 2.1. Migration Update
Add `module_name` and `submodule_name` to the `permissions` table.

```php
Schema::create('permissions', function (Blueprint $table) {
    $table->bigIncrements('id');
    $table->string('name');       // e.g., 'click_btn_delete_po'
    $table->string('guard_name');
    
    // Custom Columns for Admin Panel Grouping
    $table->string('module_name');    // e.g., 'Master Data'
    $table->string('submodule_name'); // e.g., 'Purchase Orders'
    
    $table->timestamps();
});
```

---

## 3. Strict Naming Convention

Developers MUST follow this syntax when creating a new permission in the database.
**Syntax:** `[action]_[type]_[resource]`

### 3.1. Menu & Page Level Permissions (`view_menu_`)
Controls visibility of the Left Sidebar menus in React.
- `view_menu_master_data`
- `view_menu_quality_control`

### 3.2. Action & Button Level Permissions (`click_btn_`)
Controls visibility of specific buttons inside a page.
- `click_btn_create_po` (Shows the "Add PO" button)
- `click_btn_delete_po` (Shows the Delete icon in the table)
- `click_btn_export_excel` (Shows the Export button)

### 3.3. API Route Level Permissions (`access_api_`)
If a backend endpoint doesn't directly map to a UI button, or it's a background process trigger.
- `access_api_force_sync`

---

## 4. Admin Panel UI Mapping

When the Super Admin opens the **"Role Management"** page, the API will group the permissions using the custom columns.

**UI Representation:**
```text
[ ] Master Data (Module)
    [ ] Purchase Orders (Submodule)
        [x] View Menu (view_menu_po)
        [x] Create PO (click_btn_create_po)
        [ ] Delete PO (click_btn_delete_po)
    [ ] Buyers (Submodule)
        [x] View Menu (view_menu_buyers)
```

By organizing permissions this way, the Super Admin can easily understand exactly what they are granting access to, without needing to understand code.

---
*(End of Permission Matrix Strategy)*
