# Custom Admin Panel UI/UX Specification (Superceded by SRS-UIUX-001)
**Role:** Frontend Developer / UI/UX Designer  
**Project:** RMG Traceability Software  
**Status:** Superseded by [SRS_Enterprise_UI_UX_And_Admin_Panel.md](file:///g:/ERP/TraceFlow-RMG/docs/04_Frontend_Developer/SRS_Enterprise_UI_UX_And_Admin_Panel.md)  

---

> [!IMPORTANT]
> This legacy specification has been upgraded to **Enterprise Tier-1 Standard (Version 3.0)**.
> For the authoritative specification covering the **STRICT No Modals Rule**, **Pure Server-Side Validation**, **High-Density Data Grids**, **Omni-Search Command Palette (`Ctrl + K`)**, and **Dual Theming Engine**, refer directly to:  
> 📄 [SRS_Enterprise_UI_UX_And_Admin_Panel.md](file:///g:/ERP/TraceFlow-RMG/docs/04_Frontend_Developer/SRS_Enterprise_UI_UX_And_Admin_Panel.md)

---

## 1. Core Directives Summary
1. **Zero-Modal Architecture:** All modal/dialog references from earlier iterations are strictly voided. All creation flows, edits, and details render as full-screen dedicated pages with breadcrumbs.
2. **Pure Server-Side Validation:** All forms use `<form noValidate>` with field errors received via HTTP 422 JSON Problem Details.
3. **Dual Theming Engine:** Corporate Light Mode and Midnight Dark Mode with instant toggle.
4. **Button Styling:** Flat crisp solid colors only (`btn-solid-blue`, `btn-solid-green`, `btn-solid-red`). Gradients strictly prohibited.
5. **Navigation:** Topbar 15-module selector + Contextual 2-Level Left Sidebar + In-Page Horizontal Tabs.

*(Refer to master SRS document for full implementation blueprints and code tokens)*
