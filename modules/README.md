# TraceFlow RMG — Enterprise Modules Documentation

This directory contains module-specific Software Requirements Specifications (SRS), workflows, database schemas, and business rules for each of the 15 dedicated enterprise domains of the TraceFlow RMG platform.

---

## 1. Enterprise Dedicated Module Directory

1. **[Module 01: System Admin & Auth (RBAC)](01_System_Admin_And_Auth/SRS_Module_01_System_Admin_And_Auth.md)**  
   *Tri-identifier authentication (Emp ID, Username, optional Email), granular RBAC, TOTP 2FA, Two-Tier Deletion (Super Admin Permanent Purge Guard), immutable audit vault, and offline tablet edge tokens.*

2. **[Module 02: Master Data Management (Global Manufacturing Library)](02_Master_Data/SRS_Module_02_Master_Data.md)**  
   *Central single source of truth for Buyers, Brands, Seasons, Styles (with Base SMV & Tech Pack), Colors (Swatches), Size Matrix (Mandatory Sort Order), Production Lines, IE Operations, QC Defect Codes, and UOM.*

3. **[Module 03: Order Management & Merchandising Engine](03_Order_Management/SRS_Module_03_Order_Management.md)**  
   *Buyer Purchase Orders, internal job generation, full-screen 2D Color-Size Matrix (Golden Sum Rule), Multi-tier Bill of Materials (BOM), Time & Action (T&A) critical milestones, and production lockout state machine.*

4. **[Module 04: Production Planning & Industrial Engineering (IE) Engine](04_Production_Planning/SRS_Module_04_Production_Planning.md)**  
   *Unified Cutting & Sewing Pipeline: Planned Cut Date (PCD) 2-day WIP buffer rule, cutting table allocation, line loading, 4-day learning curve ramp-up, pitch time line balancing, line starvation proactive warning engine, and PostgreSQL dual GiST exclusion constraints.*

5. **[Module 05: Pre-Cut CAD, Marker Optimization, Cutting & Dual-Tier QR Ticketing](05_Cutting_Bundling/SRS_Module_05_Cutting_Bundling.md)**  
   *CAD pattern grading, shrinkage adjustment, marker nesting & efficiency %, lay spreading, fabric roll shade grouping, cutting tolerance guard, and revolutionary Dual-Tier QR generation (Level 1 Master Bundle QR + Level 2 Child Single-Piece Sub-QR stickers).*

6. **[Module 06: Screen & Digital Printing Management Engine](06_Printing_Management/SRS_Module_06_Printing_Management.md)**  
   *Cut panel batch dispatching, internal/external print tables, chemical ink recipe management, strike-off approval, curing temperature monitoring, print defect logging (bleeding/misprint), and transit reconciliation.*

7. **[Module 07: Computerized Embroidery Management Engine](07_Embroidery_Management/SRS_Module_07_Embroidery_Management.md)**  
   *Multi-head embroidery machine capacity, frame scheduling, design stitch count & SMV loading, applique/sequin fusing, needle cut inspection, and defect panel return.*

8. **[Module 08: Subcontracting & Job-Work Governance](08_Subcontracting_Governance/SRS_Module_08_Subcontracting_Governance.md)**  
   *External factory work orders, compliant Gate Pass (Challan 6.3), inter-factory transit loss/damage reconciliations, piece accountability, and commercial billing.*

9. **[Module 09: Sewing Floor Tracking & Station Assembly](09_Sewing_Floor_Tracking/SRS_Module_09_Sewing_Floor_Tracking.md)**  
   *Real-time hourly production monitoring, line-in feeding, operator/workstation bundle scanning, bottleneck detection, and live floor andon boards.*

10. **[Module 10: Quality Control (QC), AQL Audits & Defect Mapping](10_Quality_Control/SRS_Module_10_Quality_Control.md)**  
    *Digital traffic light system, 7-0 QC inline checks, end-line inspection with anatomical garment zone defect pinning, rework loop, and buyer AQL audits.*

11. **[Module 11: Industrial Garment Washing Plant Engine](11_Washing_Plant/SRS_Module_11_Washing_Plant.md)**  
    *Wet/dry process batches, chemical wash recipes, liquor ratios, whiskers/grinding/hand-sanding, industrial hydro/dryer tracking, and shrinkage control.*

12. **[Module 12: Garment Finishing Engine](12_Garment_Finishing/SRS_Module_12_Garment_Finishing.md)**  
    *Thread trimming, button attaching, tunnel ironing, measurement inspection, and metal/broken needle detector lockout.*

13. **[Module 13: Packing, Carton QR & Final Pre-Shipment Inspection](13_Packing_Inspection/SRS_Module_13_Packing_Inspection.md)**  
    *Single-piece to polybag and carton mapping, assortment/solid packing ratios, GS1-compliant shipping mark carton barcodes, and final container stuffing.*

14. **[Module 14: Fabric & Trims Warehouse Management, In-House QC & Relaxation](14_Fabric_Trims_Warehouse/SRS_Module_14_Fabric_Trims_Warehouse.md)**  
    *Gate pass receiving, Material Receiving Report (MRR), ASTM D5430 4-Point System fabric inspection, lab tests (GSM, shade lots, shrinkage %), 24-48 hr fabric relaxation chamber, and cutting roll issuance requisition.*

15. **[Module 15: Commercial Export, Freight Governance & Executive BI Analytics](15_Commercial_Export_BI/SRS_Module_15_Commercial_Export_BI.md)**  
    *Commercial invoices, packing lists, bill of lading (BL), GSP certificates, customs documentation, cost-per-garment variance, and executive C-suite BI dashboard.*

---

## 2. Chronological Physical Manufacturing Flow vs Functional Domains

In enterprise apparel ERP architecture, functional module numbers identify domain system boundaries, while the physical manufacturing execution flows chronologically across them:

$$\text{Order \& BOM (Mod 03)} \rightarrow \text{PPC Master Plan (Mod 04)} \rightarrow \begin{cases} \textbf{Fabric Store \& 4-Pt QC (Mod 14)} \\ \textbf{CAD Marker Optimization (Mod 05.1)} \end{cases} \rightarrow \text{Cutting \& QR Ticketing (Mod 05.2-4)} \rightarrow \begin{cases} \textbf{Printing (Mod 06)} \\ \textbf{Embroidery (Mod 07)} \\ \textbf{Subcontract (Mod 08)} \end{cases} \rightarrow \text{Sewing Line (Mod 09)} \rightarrow \text{End-Line QC (Mod 10)} \rightarrow \text{Washing Plant (Mod 11)} \rightarrow \text{Finishing (Mod 12)} \rightarrow \text{Packing \& PSI (Mod 13)} \rightarrow \text{Export Freight \& BI (Mod 15)}$$

---
