# TraceFlow RMG — Woven Garments Traceability Software

![Project Status](https://img.shields.io/badge/status-active-success.svg) 
![Tech Stack](https://img.shields.io/badge/Laravel-13-red) 
![Tech Stack](https://img.shields.io/badge/React-Vite-blue)

**TraceFlow RMG** is an Enterprise-grade Factory Floor Traceability and ERP System designed for Woven Garments Manufacturing. This system tracks every single garment piece from the cutting floor to shipment using QR/Barcode scanning on Android tablets. Precision Fabric-to-Freight Garment Intelligence.

## 🚀 Core Enterprise Modules (15 Dedicated Engines)

This software is composed of 15 dedicated enterprise domains built using **Domain-Driven Design (DDD)**:

1. **Module 01:** System Admin & Auth (RBAC, TOTP 2FA, WORM Vault)
2. **Module 02:** Master Data Management (Global Manufacturing Library)
3. **Module 03:** Order Management & Merchandising (2D Matrix, BOM, T&A)
4. **Module 04:** Production Planning & IE (Unified Cut-Sew Pipeline, PCD)
5. **Module 05:** Pre-Cut CAD, Marker & Dual-Tier QR Ticketing
6. **Module 06:** Screen & Digital Printing Management Engine
7. **Module 07:** Computerized Embroidery Management Engine
8. **Module 08:** Subcontracting & Job-Work Governance (NBR Mushak-6.3)
9. **Module 09:** Sewing Floor Tracking & Station Assembly (Dual QR)
10. **Module 10:** Quality Control (QC), AQL Audits & Defect Mapping
11. **Module 11:** Industrial Garment Washing Plant Engine
12. **Module 12:** Garment Finishing Engine (90N Pull Test, Broken Needle Gate)
13. **Module 13:** Packing, Carton QR & Final Pre-Shipment Inspection (GS1 SSCC-18)
14. **Module 14:** Fabric & Trims Warehouse, In-House QC & Relaxation (ASTM 4-Pt)
15. **Module 15:** Commercial Export, Freight Governance & Executive BI Analytics

## 🏗️ Unified Architecture & Tech Stack

- **Backend:** **Laravel 13** (PHP 8.3+, API-First, Pure Server Validation, Horizon Queues, Reverb WebSockets)
- **Frontend (Web View):** **React 19** + **TypeScript** + **Vite** (TailwindCSS, Zustand, TanStack Query)
- **Floor Data Capture (Hybrid Dual-Mode):**
  - **Mode A (Web):** Browser-based (Chrome/Edge) with IndexedDB offline storage & USB HID scanner driver.
  - **Mode B (APK):** Android Kiosk APK (Capacitor/Native Shell) with SQLite offline engine & Laser Intent SDK.
- **Database:** **PostgreSQL 17** (UUID v4, GiST Exclusion Constraints, Partitioning)
- **In-Memory Cache & Message Broker:** **Redis 7** (Sub-10ms OLAP Caching, Horizon Queue Cluster)
- **Cloud Storage:** Private S3 (Encrypted Pre-Signed URLs for Tech Packs, Defect Photos, and B/L)

## 📚 Documentation

The entire system architecture, Product Requirements Documents (PRDs), API Specifications, and UI/UX Strategy are documented thoroughly in the `docs/` folder.

- **[Business Requirements (PRDs)](./docs/01_Business_Analyst/)**
- **[System Architecture & API Specs](./docs/02_Solution_Architect/)**
- **[Backend Guidelines](./docs/03_Backend_Developer/)**
- **[Frontend UI/UX Strategy](./docs/04_Frontend_Developer/)**

---

*This project is strictly governed by custom AI Agent Workflow Rules to enforce architectural integrity.*
