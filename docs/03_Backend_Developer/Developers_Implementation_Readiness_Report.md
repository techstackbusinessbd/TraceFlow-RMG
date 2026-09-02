# TraceFlow RMG — Frontend & Backend Developers Implementation Readiness Report
## Technical Execution Blueprint & Development Green Light
**ডকুমেন্ট রেফারেন্স:** `TFRMG-DEV-READINESS-2026-V1.0`  
**তারিখ:** ২ সেপ্টেম্বর, ২০২৬  
**প্রস্তুতকারক:** Lead Backend Developer & Lead Frontend Developer  
**প্রাপক:** Product Owner, Project Manager & Executive Sponsor  
**মূল্যায়নকৃত নির্দেশনাবলী:** All 15 Module SRS DDLs & APIs, Global Architectural Rules (.agents/AGENTS.md), Navigation Architecture V3.0, Dashboards Spec, and Hybrid Capture Spec  
**স্ট্যাটাস:** 100% Development-Ready & Prepared for Code Execution  

---

## ১. নির্বাহী সারসংক্ষেপ ও ডেভেলপার টিমের ঘোষণা (Executive Developer Summary)

ফ্রন্টএন্ড এবং ব্যাকএন্ড ডেভেলপার (FE / BE) টিম হিসেবে আমরা TraceFlow RMG প্ল্যাটফর্মের সমস্ত স্পেসিফিকেশন, এসআরএস (Modules 01 to 15), ডেটাবেস স্কিমা, এপিআই কন্ট্রাক্ট এবং ইউআই/ইউএক্স নিয়মাবলি পর্যালোচনা করেছি।

আমাদের মূল্যায়ন অনুযায়ী:
1. **রিকোয়ারমেন্টসের স্পষ্টতা:** ব্যাকএন্ডের জন্য প্রতিটি মডিউলে রেডি PostgreSQL 17 DDL, এপিআই এন্ডপয়েন্ট তালিকা এবং ভ্যালিডেশন রুলস সুনির্দিষ্ট রয়েছে। কোনো অনুমান (Assumptions) করার প্রয়োজন নেই।
2. **ফ্রন্টএন্ড আর্কিটেকচার:** নেভিগেশন স্ট্রাকচার (Topbar + 2-Level Sidebar), ৭টি ড্যাশবোর্ড গ্রিড এবং ইউনিভার্সাল সিঙ্গেল লগইন পেজ ফ্রন্টএন্ড কোডিংয়ের জন্য শতভাগ রেডি।
3. **কঠোর রুলস কমপ্লায়েন্স:** "No Modals", "Pure Server-Side Validation", এবং "Flat Crisp Colors" নিয়মগুলো ফ্রন্টএন্ড ও ব্যাকএন্ড টিমের প্রতিটি ডেভেলপারের জন্য অলঙ্ঘনীয় হিসেবে গ্রহণ করা হয়েছে।

ডেভেলপার টিম সরাসরি কোড বাস্তবায়ন শুরু করতে সম্পূর্ণ প্রস্তুত।

---

## ২. ব্যাকএন্ড টিম ইমপ্লিমেন্টেশন স্ট্র্যাটেজি (Backend Developer Blueprint)

### ২.১ আর্কিটেকচারাল প্যাটার্ন (Domain-Driven Service-Repository Pattern):
```
HTTP Request ──► Route ──► Middleware (Sanctum/RBAC) ──► FormRequest (Pure Server Validation)
                                                                │ (Valid Data Only)
Controller (Thin) ◄─────────────────────────────────────────────┘
      │
      ▼
Domain Service (All Business Logic & Calculations)
      │
      ▼
Repository Interface (Decoupled DB Operations)
      │
      ▼
PostgreSQL 17 (ACID Transactions) & Redis 7 (Horizon Queues)
```

### ২.২ ব্যাকএন্ড টিমের প্রতিশ্রুত কাজের ধারা:
1. **PostgreSQL 17 Migrations:** এসআরএসের ডিডিএল অনুযায়ী সমস্ত মাইগ্রেশন ফাইল, UUID v4 প্রাইমারি কি, ফরেইন কি এবং GiST কনস্ট্রেইন্ট তৈরি করা।
2. **FormRequests (Pure Server Validation):** প্রতিটি এন্ডপয়েন্টের জন্য আলাদা ডেডিকেটেড রিকোয়েস্ট ক্লাস তৈরি করা যা `HTTP 422 JSON Problem Details` রিটার্ন করবে।
3. **WORM অডিট ট্রিগার:** ডিলিট বা আপডেটের হিস্টোরিক্যাল রেকর্ড সুরক্ষায় ডাটাবেস ট্রিগার কার্যকর করা।
4. **হাই-স্পিড স্ক্যান কিউ:** সেলাই লাইনের হাজার হাজার স্ক্যানকে হ্যান্ডেল করতে `Laravel Horizon + Redis 7` এসিনক্রোনাস বাফারিং চালু করা।
5. **Pest PHP টেস্ট স্যুট:** বিজনেস লজিক এবং এপিআই এন্ডপয়েন্টের জন্য **১০০% স্ট্রিক্ট টেস্ট কভারেজ** নিশ্চিত করা।

---

## ৩. ফ্রন্টএন্ড টিম ইমপ্লিমেন্টেশন স্ট্র্যাটেজি (Frontend Developer Blueprint)

### ৩.১ ফ্রন্টএন্ড অ্যাপ শেল ও ইউজার এক্সপেরিয়েন্স আর্কিটেকচার:
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOPBAR: [TraceFlow RMG Logo] [Mod 01] [Mod 02] ... [Mod 15] ──► [Active Module Tab]   │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ CONTEXTUAL SIDEBAR       │ MAIN WORKSPACE VIEWPORT                                     │
│ (Selected Module Only)   │                                                             │
│ ├── Level 1: Submodule   │ 1. Breadcrumbs: Orders > PO-2026-001 > Matrix Ratio Edit    │
│ │   └── Level 2: Page    │ 2. Dense Filter Bar & Multi-Select DataTables               │
│ └── Level 1: Feature     │ 3. Full-Screen Page Form (STRICT No Modals)                 │
│     └── Level 2: Page    │ 4. Crisp Flat Buttons (Solid Colors, Zero Gradients)        │
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

### ৩.২ ফ্রন্টএন্ড টিমের প্রতিশ্রুত কাজের ধারা:
1. **ইউনিভার্সাল লগইন পেজ (`/login`):**
   - ট্রাই-আইডেন্টিফায়ার (Emp ID / Username / Email) ইনপুট ফিল্ড।
   - ইনলাইন প্রগ্রেসিভ ২এফএ বক্স (নো মোডাল)।
   - `<form noValidate>` সহ পিউর সার্ভার-সাইড এরর হ্যান্ডলার।
   - পোস্ট-লগইন রোল-বেসড স্মার্ট ড্যাশবোর্ড রিডাইরেক্টর।
2. **অ্যাপ শেল নেভিগেশন (Topbar + 2-Level Left Sidebar):**
   - ১৫টি প্রধান মডিউল টপবারে এক্টিভ ট্যাবস হিসেবে থাকবে।
   - বামপাশে নির্বাচিত মডিউলের ২-লেভেল মেনু প্রদর্শিত হবে।
   - কোনো ৩য় লেভেলের ড্রপডাউন থাকবে না; গভীর সাব-ভিউয়ের জন্য **In-Page Horizontal Tabs** ব্যবহার করা হবে।
3. **হাইব্রিড ফ্লোর স্টেশন কম্পোনেন্টস:**
   - কাটিং, সেলাই, কিউসি এবং প্যাকিং স্টেশনগুলো এমনভাবে তৈরি হবে যা ডেস্কটপ ক্রোম ব্রাউজারে চলবে এবং একই সাথে অ্যান্ড্রয়েড ট্যাবলেট APK-তেও চলবে।
   - গ্লোবাল কীবোর্ড লিসেনারের মাধ্যমে ইউএসবি বারকোড স্ক্যানার ইনপুট গ্রহণ করবে।
4. **১০০% মোডালমুক্ত ডিজাইন:** কোনো পপআপ থাকবে না; প্রতিটি ফর্ম ও ভিউ ফুল-স্ক্রিন ডেডিকেটেড পেজ হিসেবে রেন্ডার হবে।

---

## ৪. ডেভেলপমেন্ট বাস্তবায়ন রোডম্যাপ (Phased Execution Plan)

ডেভেলপার টিম অবিলম্বে কাজ শুরু করার জন্য নিম্নোক্ত ধাপে কাজ এগিয়ে নেওয়ার প্রস্তাব করছে:

```
[ফেজ ০১: ডাটাবেস ও ফাউন্ডেশন]
   ├── Laravel 13 ও PostgreSQL 17 কানেক্টিভিটি
   ├── মডিউল ০১ থেকে ১৫ পর্যন্ত সমস্ত ডেটাবেস মাইগ্রেশন রান করা
   └── সিডার ফাইল দিয়ে প্রাথমিক মাস্টার ডাটা ও রোলস/পারমিশন পপুলেট করা
              │
              ▼
[ফেজ ০২: কোর অথেনটিকেশন ও ফ্রন্টএন্ড শেল]
   ├── ট্রাই-আইডেন্টিফায়ার লগইন এপিআই ও Sanctum টোকেন সার্ভিস
   ├── React 19 + TailwindCSS অ্যাপ শেল (টপবার + ২-লেভেল সাইডবার)
   └── ইউনিভার্সাল লগইন পেজ (`/login`) ও পোস্ট-লগইন ড্যাশবোর্ড রাউটার
              │
              ▼
[ফেজ ০৩: কোর ডোমেইন সার্ভিসেস ও এপিআই]
   ├── মডিউল ০২ (Master Data) ও মডিউল ০৩ (Order Management Matrix)
   ├── মডিউল ০৪ (PPC) ও মডিউল ০৫ (Cutting & Dual QR Ticketing)
   └── মডিউল ০৯ (Sewing Line Tracking) ও মডিউল ১০ (100% End-Line QC)
              │
              ▼
[ফেজ ০৪: অটোমেশন টেস্টিং ও ১০০% কভারেজ ভেরিফিকেশন]
   ├── Pest PHP দিয়ে সমস্ত সার্ভিস ও ফর্ম রিকোয়েস্ট টেস্ট (100% Target)
   └── Playwright দিয়ে ফ্রন্টএন্ড ফুল-স্ক্রিন ফ্লো টেস্ট
```

---

## ৫. ডেভেলপার (FE / BE) টিমের চূড়ান্ত সাইন-অফ ও সংকল্প (Developers Commitment)

> **আমরা নিশ্চিত করছি:** আমরা সিস্টেমের প্রতিটি রিকোয়ারমেন্ট পুঙ্খানুপুঙ্খভাবে বুঝেছি। গ্লোবাল রুলসের (No Modals, Pure Server Validation, 100% English UI, Flat Buttons, Hybrid Capture) প্রতিটি নির্দেশ অক্ষরে অক্ষরে পালন করা হবে।

**ডেভেলপার টিম (Frontend & Backend) কোড লেখা শুরু করার জন্য সম্পূর্ণ প্রস্তুত এবং আপনার চূড়ান্ত আদেশের অপেক্ষায় রয়েছে।**

---

*(ডেভেলপার রিপোর্ট সমাপ্ত — TraceFlow RMG Engineering & Implementation Team)*
