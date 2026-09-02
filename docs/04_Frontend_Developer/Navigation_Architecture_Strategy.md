# Navigation & Sidebar Architecture Master Specification
## Topbar-Module & Contextual 2-Level Sidebar Navigation Pattern
**ডকুমেন্ট রেফারেন্স:** `TFRMG-NAV-SPEC-V3.0`  
**ডকুমেন্ট ভার্সন:** 3.0 (Enterprise Topbar-Contextual Sidebar Architecture)  
**আর্কিটেকচারাল প্যাটার্ন:** Topbar-Driven Module Selector + Contextual 2-Level Left Sidebar  
**টার্গেট ফ্রেমওয়ার্ক:** React 19 + TypeScript + TailwindCSS (Midnight & Crisp Enterprise Theme) + TanStack Router / React Router v7  
**স্ট্যাটাস:** Approved & Production-Ready  

---

## ১. নির্বাহী সারসংক্ষেপ ও নতুন আর্কিটেকচারাল দিকনির্দেশনা (Executive Overview)

ব্যবহারকারীর স্পষ্ট দিকনির্দেশনা অনুযায়ী TraceFlow RMG প্ল্যাটফর্মের নেভিগেশন আর্কিটেকচারকে একটি আন্তর্জাতিক মানের **"Topbar Module-Driven + Contextual Left Sidebar"** মডেলে পুনর্গঠন করা হয়েছে:

1. **টপবার ন্যাভবার (Top Navbar - Horizontal Module Bar):**
   - প্ল্যাটফর্মের **মূল মডিউলসমূহ (Main Modules)** আনুভূমিকভাবে (Horizontally) টপবারে অবস্থান করবে।
   - ব্যবহারকারী টপবারে যে মডিউলটিতে ক্লিক করবেন, সেটি হবে **Active Module Context**।
2. **লেফট সাইডবার (Contextual Left Sidebar - Strictly 2-Level):**
   - সাইডবারে কারখানার সকল মডিউলের বিশাল তালিকা থাকবে না; বরং টপবারে **সিলেক্ট করা মডিউলের সাব-মডিউল ও ফিচারসমূহ (Submodules & Features)** সাইডবারে প্রাসঙ্গিকভাবে (Contextually) প্রদর্শিত হবে।
   - সাইডবার মেনুটি **কঠোরভাবে সর্বোচ্চ ২-লেভেল (Strictly 2-Level Supported)** হবে। কোনো ৩য় লেভেল ড্রপডাউন থাকবে না।
   - গভীর জটিলতা এড়াতে পেজের ভেতরে **In-Page Horizontal Tabs** ব্যবহৃত হবে।

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOPBAR NAVBAR (Height: 64px, Fixed Top, Dark Slate-900)                                                                │
│ [🏭 TraceFlow] │ [Order & BOM] [PPC] [Warehouse] [Cutting] [Sewing] [QC] [Finishing] [Packing] [Export] [Admin] │ [🔍] [🔔] [👤]│
├──────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┤
│ CONTEXTUAL LEFT SIDEBAR  │ DEDICATED FULL-SCREEN WORKSPACE (Background: Slate-50)                                      │
│ (Width: 260px, Slate-950)│                                                                                             │
│ Active: [Warehouse & QC] │ Breadcrumbs: Warehouse > Fabric Rolls > ASTM 4-Point QC Console                             │
│                          │ ─────────────────────────────────────────────────────────────────────────────────────────── │
│ ▼ 1. Material Receiving  │                                                                                             │
│    ├─ Inward MRR List    │ [Full-Screen Dedicated Page Canvas / Pure Server Validation Form / High-Density Data Grid] │
│    └─ New Receiving Form │                                                                                             │
│                          │                                                                                             │
│ ▼ 2. Fabric Quality (QC) │                                                                                             │
│    ├─ 4-Point Inspection │                                                                                             │
│    ├─ Relaxation Chamber │                                                                                             │
│    └─ Shade Banding (A/B)│                                                                                             │
│                          │                                                                                             │
│ ▼ 3. Trims Management   │                                                                                             │
│    ├─ 2-Step Putaway     │                                                                                             │
│    └─ Stock Ledger       │                                                                                             │
└──────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ২. টপবার মূল মডিউল ন্যাভিগেশন (Topbar Main Module Navigation)

টপবার হলো প্ল্যাটফর্মের গ্লোবাল কন্ট্রোল টাওয়ার। এটি মূল ডোমেন সুইচিংয়ের দায়িত্ব পালন করে।

### ২.১ টপবারে প্রধান মডিউল ক্লাস্টার (Main Modules in Topbar)
টপবারে ১৫টি মডিউলকে সুসংহতভাবে সাজানো হয়েছে:

1. **Orders & Merchandising** (Module 03: POs, 2D Ratio Matrix, Multi-tier BOM, T&A)
2. **Master Data** (Module 02: Buyers, Styles, SMV, Size Matrix, Colors)
3. **PPC Planning** (Module 04: Cut-Sew Schedule, Table & Line Loading, Starvation Alerts)
4. **Warehouse & Stores** (Module 14: MRR, ASTM 4-Pt QC, Relaxation Chamber, Trims Putaway)
5. **CAD & Cutting** (Module 05: CAD Markers, Lay Spreading, Dual-Tier QR Bundling)
6. **Embellishment & Subcontract** (Module 06 Print, Module 07 Embroidery, Module 08 Subcontract Mushak-6.3)
7. **Sewing Floor** (Module 09: Line-In Feeding, Line-Out Tracking, Live Andon Display)
8. **Quality Control (QC)** (Module 10: End-Line Single-Piece QC, 2D Defect Pinning, AQL Audits)
9. **Washing Plant** (Module 11: Wet/Dry Recipes, Liquor Ratio, Dryer Thermal Audit)
10. **Finishing Engine** (Module 12: Thread Trimming, 90N Pull Test, POM Spec Audit, Metal Detector)
11. **Packing & PSI** (Module 13: Packing Plans, SSCC-18 Carton Barcodes, Scale Weight Gate, Final PSI)
12. **Commercial Export** (Module 15: Commercial Invoices, Master PL, Bill of Lading, EXP Filing)
13. **Executive BI** (Module 15: C-Suite KPI Analytics, Cost-Per-Garment BOM Variance, OTD %)
14. **System Admin** (Module 01: Users, RBAC Role Matrix, Device Pairing, WORM Audit Logs)

### ২.২ টপবার স্টাইলিং ও বিহেভিয়ার (Topbar Styling & Interaction)
- **উচ্চতা ও অবস্থান:** ফিক্সড টপ `h-16 (64px)`, `z-40`, ব্যাকগ্রাউন্ড `bg-slate-900 border-b border-slate-800`।
- **মডিউল বাটন স্টাইল:**
  - ইন-এক্টিভ মডিউল: `text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-md text-sm font-medium transition-colors`
  - এক্টিভ মডিউল: `bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-none` (**Strict: নো গ্রেডিয়েন্ট**)।
- **রেসপনসিভ হ্যান্ডলিং (Small Laptops / Tablets):**
  - যদি স্ক্রিনে সব মডিউল অনুভূমিকভাবে জায়গা না পায়, তবে ডানপাশে একটি ফ্ল্যাট সলিড **`More Modules ▾`** মেনু থাকবে অথবা স্পর্শবান্ধব স্মুথ হরাইজন্টাল স্ক্রলিং সাপোর্ট করবে।

---

## ৩. প্রাসঙ্গিক লেফট সাইডবার ২-লেভেল মেনু আর্কিটেকচার (Strictly 2-Level Contextual Sidebar)

টপবারে যে মডিউল সিলেক্ট করা থাকবে, সাইডবার তাৎক্ষণিকভাবে রি-রেন্ডার হয়ে শুধুমাত্র সেই মডিউলের সংশ্লিষ্ট ফিচারসমূহ প্রদর্শন করবে। সাইডবারটি **কঠোরভাবে ২-লেভেলে সীমাবদ্ধ (Strictly 2-Level Supported)**:

### ৩.১ লেভেল ১ ও লেভেল ২ এর ভূমিকা
- **লেভেল ১: সাব-মডিউল / ফিচার গ্রুপ (Feature Node / Group):**
  - মডিউলের অভ্যন্তরীণ প্রধান কার্যক্ষেত্র (e.g. `Material Receiving`, `Fabric Quality (QC)`, `Trims Management`)।
  - এটি ক্লিক করলে স্মুথলি এক্সপ্যান্ড হয়ে লেভেল ২ এর আইটেমগুলো উন্মোচিত করে।
- **লেভেল ২: সুনির্দিষ্ট অ্যাকশন / পেজ লিঙ্ক (Leaf Page Link):**
  - সুনির্দিষ্ট ফুল-স্ক্রিন পেজের রুট (e.g. `Inward MRR List`, `ASTM 4-Point QC`, `Relaxation Chamber`)।
  - ক্লিক করার সাথে সাথে ব্রাউজারের ফুল পেজ লোড হবে।

> [!CAUTION]
> **নো ৩য় লেভেল মেনু (Strict Prohibition of Level 3):**
> সাইডবারে লেভেল ২ এর নিচে কোনো চাইল্ড ড্রপডাউন বা সাব-মেনু তৈরি করা কঠোরভাবে নিষিদ্ধ।
> কোনো পেজের ভেতরে একাধিক ভিউ বা সাব-ফিচার থাকলে পেজের শীর্ষে **In-Page Horizontal Tabs** (যেমন: `[Overview] [Inspection Details] [Defect Logs] [Audit History]`) ব্যবহার করতে হবে।

---

## ৪. মডিউল-বাই-মডিউল ২-লেভেল সাইডবার ট্যাক্সোনমি (All 15 Modules Sidebar Mapping)

নিচে প্রতিটি টপবার মডিউলের বিপরীতে সাইডবারে প্রদর্শিত ২-লেভেল মেনু কাঠামো দেওয়া হলো:

### ৪.১ টপবার মডিউল: `Orders & Merchandising` (Mod 03)
- ▼ **Purchase Orders**
  - ├─ PO Directory (`/orders`)
  - ├─ Create New PO (`/orders/create`)
  - └─ Shipped & Closed Orders (`/orders/closed`)
- ▼ **Specs & Consumptions**
  - ├─ 2D Color-Size Matrix (`/orders/matrix`)
  - └─ Multi-Tier BOM Specs (`/orders/bom`)
- ▼ **Milestones & Governance**
  - ├─ Time & Action (T&A) Board (`/orders/tna`)
  - └─ Production Lockout Status (`/orders/lockouts`)

### ৪.২ টপবার মডিউল: `Warehouse & Stores` (Mod 14)
- ▼ **Material Receiving (MRR)**
  - ├─ Inward MRR Directory (`/warehouse/mrrs`)
  - └─ Receive New Shipment (`/warehouse/mrrs/create`)
- ▼ **Fabric Quality (QC)**
  - ├─ ASTM D5430 4-Point QC (`/warehouse/fabric-qc`)
  - ├─ Relaxation Chamber (Live Timer) (`/warehouse/relaxation-chamber`)
  - └─ Shade Banding (Group A/B/C) (`/warehouse/shade-banding`)
- ▼ **Trims & Inventory**
  - ├─ 2-Step Bin Putaway (`/warehouse/trims/putaway`)
  - └─ Double-Entry Stock Ledger (`/warehouse/trims/ledger`)

### ৪.৩ টপবার মডিউল: `CAD & Cutting` (Mod 05)
- ▼ **CAD & Markers**
  - ├─ CAD Marker Directory (`/cutting/cad-markers`)
  - └─ Upload & Nesting Efficiency (`/cutting/cad-markers/upload`)
- ▼ **Table Spreading**
  - ├─ Lay Spreading Tables (`/cutting/tables`)
  - └─ Cut Plan Allocation (`/cutting/plans`)
- ▼ **Ticketing & Bundling**
  - ├─ Dual-Tier QR Bundling (`/cutting/bundles`)
  - └─ Thermal Print Station (`/cutting/qr-print`)

### ৪.৪ টপবার মডিউল: `Embellishment & Subcontract` (Mod 06, 07, 08)
- ▼ **Screen & Digital Print (Mod 06)**
  - ├─ Print Work Orders (`/printing/orders`)
  - ├─ Color Kitchen Recipes (`/printing/color-kitchen`)
  - └─ Panel QC & Recut Requisitions (`/printing/panel-qc`)
- ▼ **Computerized Embroidery (Mod 07)**
  - ├─ DST Design Ingestion (`/embroidery/designs`)
  - ├─ Machine Capacity Scheduling (`/embroidery/machines`)
  - └─ Embroidery Panel QC (`/embroidery/panel-qc`)
- ▼ **Subcontract Governance (Mod 08)**
  - ├─ Subcontract Work Orders (`/subcontract/orders`)
  - ├─ NBR VAT Mushak-6.3 Challan (`/subcontract/challans`)
  - ├─ Gate Exit / Return Verification (`/subcontract/gate-passes`)
  - └─ Financial Debit Notes (`/subcontract/debit-notes`)

### ৪.৫ টপবার মডিউল: `Sewing Floor` (Mod 09)
- ▼ **Line Tracking**
  - ├─ Line-In Bundle Feeding (`/sewing/line-in`)
  - └─ Line-Out Single-Piece Tracking (`/sewing/line-out`)
- ▼ **Floor Performance**
  - ├─ Hourly Production Matrix (`/sewing/hourly-matrix`)
  - └─ Bottleneck & WIP Detector (`/sewing/wip-monitor`)
- ▼ **Live Visual Display**
  - └─ Full-Screen Floor Andon TV Display (`/sewing/andon-display`)

### ৪.৬ টপবার মডিউল: `Quality Control (QC)` (Mod 10)
- ▼ **End-Line Inspection**
  - ├─ 100% Single-Piece QC Station (`/qc/end-line`)
  - └─ 2D Silhouette Defect Pinning (`/qc/defect-mapping`)
- ▼ **Rework & Alterations**
  - ├─ Closed-Loop Alter Station (`/qc/alter-station`)
  - └─ Chronic Defect Escalations (`/qc/defect-escalations`)
- ▼ **Audit Governance**
  - ├─ Traffic Light DHU Dashboard (`/qc/dhu-board`)
  - └─ ISO 2859-1 AQL Audits (`/qc/aql-audits`)

### ৪.৭ টপবার মডিউল: `Washing Plant` (Mod 11)
- ▼ **Batch Formulation**
  - ├─ Wash Batches Directory (`/washing/batches`)
  - └─ Chemical Liquor Recipes (`/washing/recipes`)
- ▼ **Machine Execution**
  - ├─ Dry Processing (Whiskers/Sanding) (`/washing/dry-process`)
  - └─ Hydro & Tumbler Dryer Thermal Logs (`/washing/dryers`)
- ▼ **Quality Release**
  - └─ Post-Wash Garment QC (`/washing/post-wash-qc`)

### ৪.৮ টপবার মডিউল: `Finishing Engine` (Mod 12)
- ▼ **Trimming & Pressing**
  - ├─ Thread Trimming & Suction (`/finishing/trimming`)
  - └─ Tunnel Ironing & Steam Tables (`/finishing/pressing`)
- ▼ **Audits & Specifications**
  - ├─ Button 90N Tensile Pull Test (`/finishing/pull-tests`)
  - └─ POM Measurement Spec Audit (`/finishing/measurement`)
- ▼ **Metal Detection Lockout**
  - ├─ 9-Point Calibration Grid (`/finishing/calibrations`)
  - └─ Broken Needle Quarantine Log (`/finishing/needle-incidents`)

### ৪.৯ টপবার মডিউল: `Packing & PSI` (Mod 13)
- ▼ **Packing Plans**
  - ├─ Packing Plan Directory (`/packing/plans`)
  - └─ Create Packing Plan (`/packing/plans/create`)
- ▼ **Carton Aggregation**
  - ├─ Carton Packing Station (`/packing/carton-pack`)
  - ├─ GS1 SSCC-18 Thermal Labels (`/packing/shipping-marks`)
  - └─ IoT Scale Gross Weight Gate (`/packing/scale-verify`)
- ▼ **Pre-Shipment Inspection (PSI)**
  - ├─ Buyer Final PSI AQL Console (`/packing/psi-audits`)
  - └─ Container Stuffing Manifest (`/packing/stuffing`)

### ৪.১০ টপবার মডিউল: `Commercial Export` (Mod 15)
- ▼ **Export Invoicing**
  - ├─ Commercial Invoices (CI) (`/commercial/invoices`)
  - └─ Master Export Packing Lists (`/commercial/packing-lists`)
- ▼ **Freight & Shipping**
  - ├─ Bill of Lading (B/L) Ledger (`/commercial/bills-of-lading`)
  - └─ Bangladesh Bank EXP Filing (`/commercial/exp-filing`)
- ▼ **PO Finalization**
  - └─ Automated Shipped PO Closure (`/commercial/po-closure`)

### ৪.১১ টপবার মডিউল: `Executive BI` (Mod 15)
- ▼ **Strategic Command**
  - ├─ C-Suite Real-Time Dashboard (`/commercial/bi/dashboard`)
  - └─ Plant Comparison Radar (`/commercial/bi/plants`)
- ▼ **Financial Analytics**
  - ├─ Cost-Per-Garment BOM Variance (`/commercial/bi/cost-variance`)
  - └─ On-Time Delivery (OTD %) Matrix (`/commercial/bi/otd`)

### ৪.১২ টপবার মডিউল: `System Admin` (Mod 01)
- ▼ **User & Identity**
  - ├─ User Directory (`/admin/users`)
  - └─ Create User (`/admin/users/create`)
- ▼ **Access & Fleet**
  - ├─ Granular RBAC Role Matrix (`/admin/roles`)
  - └─ Floor Tablet Fleet & Pairing (`/admin/devices`)
- ▼ **Compliance & Archival**
  - ├─ Immutable WORM Audit Logs (`/admin/audit-logs`)
  - ├─ Soft-Deleted Records Archive (`/admin/archived`)
  - └─ Super Admin Permanent Purge (`/admin/permanent-purge`)

---

## ৫. টাইপস্ক্রিপ্ট ডাটা স্ট্রাকচার (TypeScript Navigation Configuration Schema)

```typescript
// types/navigation.ts

export interface SubMenuLeaf {
  id: string;
  title: string;
  path: string;
  permission?: string;
  badgeCountKey?: string;
}

export interface SidebarSection {
  id: string;
  sectionTitle: string; // Level 1 in Sidebar
  icon?: string;
  items: SubMenuLeaf[]; // Level 2 in Sidebar (Strictly Leaf Links)
}

export interface MainModule {
  id: string;
  moduleTitle: string; // Shown in Topbar
  pathPrefix: string;
  permission?: string;
  badge?: {
    type: 'danger' | 'warning' | 'info';
    countKey?: string;
  };
  sidebarSections: SidebarSection[]; // Contextual 2-Level Sections
}
```

### ৫.১ অটো-এক্টিভেশন ও সিঙ্ক্রোনাইজেশন রুলস (Auto-Activation Rules)
1. **ইউআরএল ডিটেকশন (URL-to-Module Sync):**
   - ইউজার সরাসরি বুকমার্ক বা রিলোডের মাধ্যমে `/warehouse/fabric-qc` পেজে প্রবেশ করলে সিস্টেম স্বয়ংক্রিয়ভাবে টপবারে **`Warehouse & Stores`** মডিউলকে এক্টিভ করবে এবং সাইডবারে `Fabric Quality (QC)` সেকশন এক্সপ্যান্ড করে `ASTM D5430 4-Point QC` রুটকে হাইলাইট করবে।
2. **মডিউল সুইচিং মেমোরি:**
   - টপবারে মডিউল পরিবর্তনের সাথে সাথে সাইডবার ক্ষণিকের মধ্যে স্মুথ ট্রানজিশন সহ নতুন মডিউলের ২-লেভেল মেনু প্রদর্শন করবে।

---

## ৬. রোল-ভিত্তিক ট্রিম ও ফ্লোর অপ্টিমাইজেশন (Role-Based Dynamic Trimming)

1. **টপবার ট্রিম:**
   - যদি ইউজারের শুধুমাত্র সেলাই লাইনের পারমিশন থাকে (`sewing.operator`), তবে টপবারে শুধুমাত্র **`Sewing Floor`** মডিউল প্রদর্শিত হবে। বাকি মডিউলগুলো সম্পূর্ণ ফিল্টার হয়ে যাবে।
2. **সাইডবার ট্রিম:**
   - সাইডবারের কোনো সেকশনের ভেতরে যদি ইউজারের কোনো পারমিশন না থাকে, তবে সম্পূর্ণ সেকশনটি লুকানো থাকবে।

---

## ৭. গ্লোবাল রুলস ও নো-মোডালস বাধ্যবাধকতা (Strict Global Mandates)

> [!IMPORTANT]
> **জিরো মোডাল ও পিউর সার্ভার ভ্যালিডেশন:**
> - সাইডবারের যেকোনো লিঙ্কে ক্লিক করলে ফুল-স্ক্রিন ডেডিকেটেড পেজ লোড হবে। নেভিগেশনের কোনো স্তরে কোনো পপআপ বা মোডাল ডায়ালগ ওপেন করা সম্পূর্ণ নিষিদ্ধ।
> - ব্রাউজার ব্যাক বাটন ব্যবহার করে ব্যবহারকারী পূর্ববর্তী পেজে ফিরে যেতে পারবেন।
> - ফর্মগুলোতে `<form noValidate>` এবং সার্ভারের HTTP 422 JSON এরর হ্যান্ডলিং বজায় থাকবে।
> - বাটন ও মেনু হাইলাইটে কোনো গ্রেডিয়েন্ট ব্যবহার করা যাবে না (সলিড ব্লু `bg-blue-600` ও সলিড ডার্ক `bg-slate-950`)।

---

*(ডকুমেন্ট সমাপ্ত — Topbar Module & Contextual 2-Level Sidebar Navigation Pattern)*
