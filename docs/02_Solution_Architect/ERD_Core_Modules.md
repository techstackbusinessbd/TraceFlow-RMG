# ডাটাবেস আর্কিটেকচার (ERD) - কোর মডিউলসমূহ
**Project:** RMG Woven Garments Traceability Software
**Author:** AI Solution Architect
**Scope:** Buyer Order to Shipment Tracking (অর্ডার থেকে শিপমেন্ট ট্র্যাকিং)

## সারাংশ (Overview)
এই ডকুমেন্টে ফ্যাক্টরির এন্ড-টু-এন্ড ট্র্যাকিংয়ের জন্য কোর ডাটাবেস টেবিল এবং তাদের রিলেশনশিপগুলো বর্ণনা করা হয়েছে। এটি ডাটা ইন্টিগ্রিটি এবং অফলাইন-সিঙ্ক সক্ষমতা নিশ্চিত করবে।

---

## এনটিটি রিলেশনশিপ ডায়াগ্রাম (Entity Relationship Diagram - ERD)

```mermaid
erDiagram
    BUYER ||--o{ PURCHASE_ORDER : places
    STYLE ||--o{ PURCHASE_ORDER : contains
    PURCHASE_ORDER ||--o{ PO_ITEM : has
    PO_ITEM ||--o{ CUT_LAY : scheduled_for
    CUT_LAY ||--o{ BUNDLE : generates
    BUNDLE ||--o{ BUNDLE_ITEM : contains
    BUNDLE ||--o{ PROCESS_TRANSACTION : undergoes
    BUNDLE ||--o{ QC_INSPECTION : undergoes
    QC_INSPECTION }o--o| DEFECT_REASON : logs
    BUNDLE }o--o| CARTON : packed_into
    CARTON }o--o| SHIPMENT : loaded_onto
    ROLE ||--o{ USER : assigns

    ROLE {
        uuid id PK
        string name "e.g., Admin, QA, Supervisor"
    }
    USER {
        uuid id PK
        string name
        string email
        string password
        uuid role_id FK
    }
    BUYER {
        uuid id PK
        string name
        string country
    }
    STYLE {
        uuid id PK
        string style_no
        string description
    }
    PURCHASE_ORDER {
        uuid id PK
        uuid buyer_id FK
        uuid style_id FK
        string po_number
        date delivery_date
    }
    PO_ITEM {
        uuid id PK
        uuid po_id FK
        string color
        string size
        int order_qty
        decimal excess_cutting_percent "Set by Authorized Role"
        int planned_cut_qty
    }
    CUT_LAY {
        uuid id PK
        uuid po_item_id FK
        string lay_number
        int total_plies
    }
    BUNDLE {
        uuid id PK
        uuid cut_lay_id FK
        string qr_code UK "Unique Identifier for Traceability"
        int bundle_no
        int quantity
        string fabric_roll "Tracks source fabric roll"
        string shade "Shade color tracking"
        string pattern "Pattern/Lot tracking"
        string status "e.g., Cutting, Sewing, QC, Packing"
    }
    PROCESS_TRANSACTION {
        uuid id PK
        uuid bundle_id FK
        string process_name "e.g., Sewing Line 1 IN, Line 1 OUT"
        uuid scanned_by FK
        datetime scanned_at
    }
    QC_INSPECTION {
        uuid id PK
        uuid bundle_id FK
        string status "Pass, Reject, Rework"
        uuid defect_reason_id FK "Nullable"
        uuid inspected_by FK
        datetime inspected_at
    }
    DEFECT_REASON {
        uuid id PK
        string defect_name "e.g., Broken Stitch, Spot"
        string category
    }
    CARTON {
        uuid id PK
        string carton_barcode UK
        int total_pieces
        uuid packed_by FK
    }
    SHIPMENT {
        uuid id PK
        string shipment_invoice
        date dispatch_date
    }
```

---

## টেবিলের বিবরণ (Table Definitions)

### ১. মাস্টার ডাটা ও অর্ডার প্ল্যানিং (Master Data & Order Planning)
- **`buyers`, `styles`:** এখানে মৌলিক মাস্টার ডাটা স্টোর করা থাকে।
- **`purchase_orders`, `po_items`:** একটি স্টাইলকে বায়ারের নির্দিষ্ট কালার, সাইজ এবং কোয়ান্টিটির ব্রেকডাউনের সাথে সংযুক্ত করে।

### ২. কাটিং ও ট্রেসিবিলিটি (Cutting & Traceability Origin)
- **`cut_lays`:** ফেব্রিক লে বা পরতের বিস্তারিত তথ্য রেকর্ড করে (যেমন: কত পরত কাপড় কাটা হয়েছে)।
- **`bundles`:** ট্রেসিবিলিটির মূল এনটিটি। প্রতিটি বান্ডেলের একটি ইউনিক `qr_code` থাকে। `status` ফিল্ডটি দিয়ে ফ্যাক্টরি ফ্লোরে বান্ডেলটি বর্তমানে কোথায় আছে তা ট্র্যাক করা হয়।

### ৩. ফ্লোর অপারেশন ও ট্র্যাকিং (Floor Operations & Tracking)
- **`process_transactions`:** এটি একটি অ্যাপেন্ড-অনলি (append-only) অডিট লগ। যখনই কোনো বান্ডেল স্ক্যান করা হয় (যেমন: সুইং লাইনে ঢোকার সময় বা ওয়াশিং থেকে বের হওয়ার সময়), তখন এখানে একটি নতুন রেকর্ড তৈরি হয়। এর মাধ্যমে আমরা প্রতিটি মুভমেন্টের সঠিক সময় এবং কোন ইউজার স্ক্যান করেছেন তা ট্রেস করতে পারি।

### ৪. কোয়ালিটি কন্ট্রোল (Quality Control)
- **`qc_inspections`:** কিউসি স্ক্যানের (পাস/রিজেক্ট) ফলাফল স্টোর করে। যদি রিজেক্ট হয়, তবে এটি `defect_reasons` টেবিলের সাথে কানেক্ট হয়।

### ৫. প্যাকিং ও শিপমেন্ট (Packing & Shipment)
- **`cartons`:** একটি ফিজিক্যাল কার্টন বা বক্সকে বোঝায়। পাস হওয়া বান্ডেলগুলো একটি জয়েন টেবিলের মাধ্যমে (ডায়াগ্রাম ক্লিন রাখার জন্য এখানে দেখানো হয়নি, অথবা বান্ডেল সরাসরি একটি কার্টনে গেলে সরাসরি) কার্টনের সাথে ম্যাপ করা হয়।
- **`shipments`:** ফাইনাল ডিসপ্যাচ লগ। কার্টনগুলো একটি শিপমেন্ট ইনভয়েসের সাথে যুক্ত থাকে।

---
**নেক্সট স্টেপ (Product Owner-এর জন্য):** দয়া করে ERD-এর ফ্লো একবার রিভিউ করে দেখুন। এটি কি ফ্যাক্টরির বাস্তব কাজের ফ্লো (অর্ডার রিসিভ থেকে কার্টন শিপমেন্ট পর্যন্ত) সঠিকভাবে উপস্থাপন করছে?
