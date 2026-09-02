# Master Feature Details & Scope of Work
**Project:** RMG Traceability Software
**Author:** AI Business Analyst
**Status:** Approved (Enterprise Blueprint)

এই ডকুমেন্টে সিস্টেমের ১২টি মডিউলের প্রত্যেকটির সাব-মডিউল (Sub-module) এবং স্পেসিফিক ফিচারগুলোর (Features) একটি বিস্তারিত হায়ারার্কি (Hierarchy) দেওয়া হলো। এটি ডেভেলপমেন্টের "Scope of Work" হিসেবে কাজ করবে।

---

## 01. System Admin & User Management (Auth & Security)
**Sub-module 1.1: RBAC (Role-Based Access Control)**
- **Feature 1.1.1:** Create custom roles (e.g., Cutting In-charge, Super Admin, QC Inspector, Line Supervisor).
- **Feature 1.1.2:** Map JSON permissions to specific routes, sidebars, and API endpoints.
**Sub-module 1.2: User & Device Management**
- **Feature 1.2.1:** Manage User Accounts (Bcrypt passwords, Active/Inactive status, Sanctum Token Revocation).
- **Feature 1.2.2:** Map factory Tablets to specific Production Lines (Device Authorization & Security).
- **Feature 1.2.3:** System Audit Log tracking (who created/edited what data with timestamps).

---

## 02. Master Data (Global Library)
**Sub-module 2.1: Core Configurations**
- **Feature 2.1.1:** Add/Edit/View Buyers (Name, Country, Status)
- **Feature 2.1.2:** Add/Edit/View Styles mapped to Buyers
- **Feature 2.1.3:** Production Lines configuration (Floor, Line Name)
- **Feature 2.1.4:** Color Library (Name, HEX Code)
- **Feature 2.1.5:** Size Library (Alphanumeric/Numeric mapping)

---

## 03. Order Management (Merchandising)
**Sub-module 3.1: Purchase Order (PO) Management**
- **Feature 3.1.1:** Create new PO with Auto-validation against Master Data (Module 02)
- **Feature 3.1.2:** Define PO Breakdown (Matrix of Color vs Size quantities)
- **Feature 3.1.3:** Mathematical validation: Sum of breakdown must match Total PO Qty
- **Feature 3.1.4:** PO Status Workflow (Draft -> Pending -> Confirmed)
**Sub-module 3.2: Document Attachments**
- **Feature 3.2.1:** Upload Tech Pack (PDF/Images) up to 10MB
- **Feature 3.2.2:** Version control for updated Tech Packs

---

## 04. IE & Production Planning
**Sub-module 4.1: Capacity & Line Allocation**
- **Feature 4.1.1:** Allocate Confirmed PO to specific Sewing Lines with Start/End Dates
- **Feature 4.1.2:** Conflict Resolution: Block assigning PO to fully booked lines
- **Feature 4.1.3:** SMV (Standard Minute Value) and Manpower input
- **Feature 4.1.4:** Auto-calculate Hourly Production Target (Target DHU)
**Sub-module 4.2: Material Readiness Integration**
- **Feature 4.2.1:** Live cross-check of Fabric/Accessories with Store Module (Mod 11)
- **Feature 4.2.2:** "Material Shortage" warning modal before locking the plan

---

## 05. Cutting & Bundle Ticket Generation
**Sub-module 5.1: Cut Registration**
- **Feature 5.1.1:** Input Cut Number, Plies, Shade Band, and Table No.
- **Feature 5.1.2:** Excess Cutting Validation: Auto-calculate variance % against PO. Requires Manager PIN if variance > 5%.
**Sub-module 5.2: Bundle Ticket Generation**
- **Feature 5.2.1:** Algorithm to break down cut qty into standard bundle sizes (e.g., 50 pcs/bundle).
- **Feature 5.2.2:** Generate highly unique `UUID` and readable `Bundle_ID` for each bundle.
- **Feature 5.2.3:** Background job to generate printable QR Code PDFs (500 tags/page).

---

## 06. Value Addition (Print/Embroidery)
**Sub-module 6.1: Dispatch to Print/Embroidery**
- **Feature 6.1.1:** Group multiple bundles into a Delivery Challan
- **Feature 6.1.2:** Scan out bundles (blocks them from entering Sewing)
**Sub-module 6.2: Receive from Print/Embroidery**
- **Feature 6.2.1:** Scan received bundles against original Challan
- **Feature 6.2.2:** Variance Logging: Mark missing or rejected pieces during transit

---

## 07. Sewing & Line Tracking
**Sub-module 7.1: Input / Output Scanning (Tablet)**
- **Feature 7.1.1:** "Scan IN" QR code when bundle enters the line.
- **Feature 7.1.2:** "Scan OUT" QR code when bundle finishes sewing.
- **Feature 7.1.3:** Line Transfer validation: Prevent Scan IN at Line B if previously Input at Line A.
**Sub-module 7.2: Offline Synchronization**
- **Feature 7.2.1:** Local SQLite DB fallback when Wi-Fi drops.
- **Feature 7.2.2:** Auto Bulk-Sync API trigger when connection restores.
- **Feature 7.2.3:** Calculate Line WIP (Work In Progress) = Total Input - Total Output.

---

## 08. Quality Control (QC)
**Sub-module 8.1: Defect Logging**
- **Feature 8.1.1:** Inspection entry (Pass, Alter, Reject) per scanned bundle.
- **Feature 8.1.2:** Select specific defects from Master Defect Library.
- **Feature 8.1.3:** Real-time DHU (Defect Hundred Units) math calculation.
**Sub-module 8.2: Rework Flow**
- **Feature 8.2.1:** Lock altered bundles; mandate re-scanning after fix before passing to Wash.

---

## 09. Washing & Finishing
**Sub-module 9.1: Wash Batch Tracking**
- **Feature 9.1.1:** Group multiple bundles into a "Wash Batch".
- **Feature 9.1.2:** Track Machine No. and wash duration.
**Sub-module 9.2: Finishing QC**
- **Feature 9.2.1:** Final measurement and ironing pass/fail logs.

---

## 10. Packing & Shipment
**Sub-module 10.1: Carton Generation**
- **Feature 10.1.1:** Scan QC-Passed bundles into Cartons.
- **Feature 10.1.2:** Generate and print Carton QR Barcodes.
**Sub-module 10.2: Container Loading**
- **Feature 10.2.1:** Scan Cartons into a Shipping Container.
- **Feature 10.2.2:** Generate automated Packing List (PDF) matching PO requirements.

---

## 11. Fabric & Accessories Store
**Sub-module 11.1: Material Receiving**
- **Feature 11.1.1:** Log MRR (Material Receive Report) against Supplier PO.
- **Feature 11.1.2:** Track multiple units (Yards, KGs, Pcs, Cones).
**Sub-module 11.2: PO Allocation**
- **Feature 11.2.1:** Allocate specific fabric rolls to specific Buyer POs.
- **Feature 11.2.2:** Feed real-time balance data to the Planning Module (Mod 04).

---

## 12. BI & Analytics Dashboard
**Sub-module 12.1: Live Floor Displays**
- **Feature 12.1.1:** Line-wise Hourly Target vs Actual graph (Recharts).
- **Feature 12.1.2:** Top 3 defects chart per line (Pareto Analysis).
**Sub-module 12.2: Management Reporting**
- **Feature 12.2.1:** Overall Factory DHU and Efficiency Summary.
- **Feature 12.2.2:** Redis cached API responses for <1s dashboard load times.
