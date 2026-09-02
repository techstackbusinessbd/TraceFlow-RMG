# Enterprise Architecture & Tech Stack Guidelines
**Project:** RMG Traceability Software
**Author:** Solution Architect
**Status:** Approved for Development

---

## 1. Core Technologies
As per the Product Owner's directive, the system will be built using the latest, most robust technologies available:

| Component | Technology | Rationale |
|---|---|---|
| **Backend Framework** | **Laravel 13** | Enterprise-grade PHP framework for robust REST APIs and background job processing. |
| **Frontend Library** | **React (Latest)** | Component-based UI for fast, reactive, and reusable interfaces on both Web and Tablet. |
| **Database** | **PostgreSQL (Latest)** | Highly advanced relational database, superior for handling millions of UUIDs and concurrent transactions securely. |

---

## 2. Authorized 3rd Party Packages (Laravel)

To ensure consistency, security, and performance, only the following pre-approved packages will be used during backend development.

### 2.1. Authentication & Security
- **`laravel/sanctum`**: 
  - **Use Case:** Token-based API authentication for the Tablet Apps (React) used on the factory floor (Cutting, Sewing, QC, Packing).
- **`spatie/laravel-permission`**: 
  - **Use Case:** Role-Based Access Control (RBAC). Managing Super Admin, QA Manager, Store Keeper, etc. (Module 02).

### 2.2. Traceability & Barcoding
- **`simplesoftwareio/simple-qrcode`**: 
  - **Use Case:** Generating the Master Carton QRs (Module 09) and Single Piece Sub-QRs (Module 04).

### 2.3. Performance & High Traffic
- **`laravel/horizon` & Redis**: 
  - **Use Case:** Processing background queues. Essential for the Sewing Line (Module 06) where 200+ scans hit the server every second. The API accepts the scan instantly and Redis processes the DB updates in the background.

### 2.4. Real-time Features
- **`laravel/reverb` (or Pusher)**: 
  - **Use Case:** WebSockets for real-time dashboards. For example, in QC (Module 07), if DHU exceeds 5%, Reverb pushes an event to the QA Manager's React dashboard to turn the screen Red without a page refresh.

### 2.5. Reporting & Document Generation
- **`maatwebsite/excel`**: 
  - **Use Case:** Importing initial Master Data (Module 02) and exporting Production Reports.
- **`barryvdh/laravel-dompdf`**: 
  - **Use Case:** Generating the Commercial Invoice and Packing List PDFs for Export (Module 12).

---

## 3. Frontend Packages (React)
- **State Management:** `Zustand` or `Redux Toolkit` (For managing complex offline-sync states in Tablet UI).
- **Routing:** `React Router v6+`
- **Data Fetching:** `TanStack Query (React Query)` (Crucial for caching API responses and handling offline mutations during floor scans).
- **UI Framework:** `TailwindCSS` (For rapid, highly customizable UI styling, especially for the high-contrast Dock Loading UI).

---
*(End of Architecture Document)*
