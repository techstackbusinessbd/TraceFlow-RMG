# Business Requirements Document (BRD)
**Project:** RMG Woven Garments Traceability Software (End-to-End)
**Document Version:** 1.0 (Enterprise Level)
**Author:** AI Business Analyst Persona
**Date:** 2026-08-28

---

## 1. Executive Summary (সারাংশ)
ফ্যাক্টরিতে বিভিন্ন বায়ারের (Buyer) বিভিন্ন ধরনের ওভেন আইটেম (যেমন: শার্ট, প্যান্ট, জ্যাকেট) প্রোডাকশন হয়। এই প্রজেক্টের মূল উদ্দেশ্য হলো এমন একটি এন্টারপ্রাইজ-গ্রেড ট্রেসিবিলিটি সিস্টেম তৈরি করা, যার মাধ্যমে বায়ারের অর্ডার রিসিভ করা থেকে শুরু করে ফাইনাল শিপমেন্ট পর্যন্ত প্রতিটি স্টেপ রিয়েল-টাইমে ট্র্যাক করা যায়। এর ফলে প্রোডাকশনে স্বচ্ছতা আসবে, ডিফেক্ট রেট (DHU) কমবে এবং ফ্যাক্টরির সামগ্রিক এফিশিয়েন্সি বাড়বে। সকল মডিউল হবে **Dedicated & 100% Integrated**।

## 2. Business Objectives (মূল লক্ষ্য)
1. **End-to-End Traceability:** প্রতিটি কিউআর (QR) কোড স্ক্যানের মাধ্যমে একটি ফিনিশড গার্মেন্টস কবে কাটা হয়েছে, কে সেলাই করেছে এবং কোন লাইনে কিউসি হয়েছে তা বের করা।
2. **Preventing Mix-ups:** এক বায়ারের মাল বা সাইজ যেন অন্য বায়ারের শিপমেন্টে চলে না যায়, তা সিস্টেম দিয়ে ব্লক করা।
3. **Real-Time WIP (Work In Progress):** ফ্লোরে কোন প্রসেসে কত মাল আটকে আছে তার রিয়েল-টাইম ড্যাশবোর্ড তৈরি করা।
4. **Offline Capability:** ফ্যাক্টরি ফ্লোরে ইন্টারনেট্বা থাকলেও যেন প্রোডাকশন থেমে না থাকে।

---

## 3. Core Business Modules & Workflows (কোর মডিউল ও কাজের ফ্লো)

### Module 1: System Admin & User Management (অ্যাডমিন ও সিকিউরিটি) `[Running]`
- **Features:**
  - রোল-বেজড পারমিশন (RBAC: Admin, Manager, Line Supervisor, Operator)।
  - ফ্লোরের ট্যাবলেট ডিভাইস রেজিস্ট্রেশন এবং লাইনভিত্তিক অ্যাক্সেস কন্ট্রোল।
  - সিস্টেম অডিট লগ (কে কখন কোন ডাটা তৈরি বা এডিট করেছে)।
- **Business Rule:** এটি পুরো সিস্টেমের গেটকিপার এবং সিকিউরিটি ফাউন্ডেশন।

### Module 2: Master Data (গ্লোবাল লাইব্রেরি) `[Running]`
- **Features:** 
  - Buyer, Style, Item Type (Woven Shirt/Pant), Color, Size, এবং Line সেটআপ।
  - **Business Rule:** এটি একটি গ্লোবাল লাইব্রেরি হিসেবে কাজ করবে। পুরো সিস্টেমের অন্যান্য সব মডিউলে এখানকার ডাটা রিইউজ (Reuse) হবে।

### Module 3: Order Management (মার্চেন্ডাইজিং) `[Running]`
- **Features:**
  - Buyer-এর কাছ থেকে আসা Purchase Order (PO) এন্ট্রি করা।
  - মাস্টার ডাটা থেকে স্টাইল, কালার এবং সাইজ ব্যবহার করে সাইজ ব্রেকডাউন (Size Breakdown) অনুযায়ী প্রোডাকশন টার্গেট সেট করা।
- **Business Rule:** কোনো PO-এর টার্গেটের চেয়ে বেশি মাল কাটিং বা প্যাকিং করা যাবে না।

### Module 4: IE & Production Planning (প্ল্যানিং মডিউল) `[Running]`
- **Features:**
  - **Line Allocation (Loading):** কোন স্টাইলটি আগামী সপ্তাহে কোন লাইনে (Line 1, Line 2) চলবে তার প্ল্যান করা।
  - **Daily Target & SMV:** একটি স্টাইলের SMV (Standard Minute Value) অনুযায়ী প্রতিদিনের প্রোডাকশন টার্গেট দেওয়া।
  - **T&A (Time & Action) Calendar:** কাটিং, সুইং এবং ফিনিশিংয়ের টাইমলাইন ট্র্যাকিং।
  - **Material Readiness Follow-up:** ফেব্রিক, ট্রিমস, অ্যাক্সেসরিজ (Accessories) এবং অন্যান্য আইটেম ইনহাউস (Inhouse) হয়েছে কি না, তা চেক করার অপশন থাকবে।
- **Business Rule:** অর্ডার ম্যানেজমেন্ট মডিউলে (Module 3) কোনো নতুন অর্ডার (PO) কনফার্ম হওয়ার পরই কেবল প্ল্যানিং টিমের কাজ শুরু হবে।
- **Integration Rule:** 
  - স্টোর মডিউল (Module 11) এর সাথে ইন্টিগ্রেটেড থাকবে। প্রোডাকশনের কোনো আইটেমের স্টকে ব্যালেন্স না থাকলে (অর্থাৎ মালামাল ইনহাউস না হলে) প্ল্যানিং টিম প্ল্যান করতে গেলে সিস্টেম ওয়ার্নিং (Warning) দেবে।
  - এই মডিউলের টার্গেট অনুযায়ী সুইং লাইনের রিয়েল-টাইম এফিশিয়েন্সি (Efficiency) কাউন্ট হবে।

### Module 5: Cutting & Bundle Ticket Generation (কাটিং সেকশন) `[Running]`
- **Features:**
  - কাটিং লে (Lay/Spreading) এন্ট্রি করা।
  - সাইজ এবং রেশিও অনুযায়ী স্বয়ংক্রিয়ভাবে বান্ডেল (Bundle) তৈরি করা।
  - প্রতিটি বান্ডেলের জন্য ইউনিক **QR Code** সম্বলিত "Bundle Ticket" প্রিন্ট করা।
  - **Fabric Roll & Shade Tracking:** কাপড় কাটার সময় কোন বান্ডেলে কোন রোলের কাপড়, কোন শেড (Shade) এবং কোন প্যাটার্ন (Pattern/Lot) ব্যবহার করা হচ্ছে তা রেকর্ড করা।
  - **Excess Cutting Allocation:** সিস্টেম থেকে অতিরিক্ত কাটিংয়ের (Excess Cutting) পার্সেন্টেজ (%) ডিফাইন করার অপশন থাকবে। শুধুমাত্র Authorized Person (যেমন: Cutting Manager বা Admin) এই পার্সেন্টেজ সেট বা এপ্রুভ করতে পারবেন।
- **Traceability Rule:** এই QR কোডটিই পুরো ফ্যাক্টরিতে ওই বান্ডেলের ডিজিটাল আইডেন্টিটি হিসেবে কাজ করবে। সুইং সেকশনে একই শেডের (Shade) বান্ডেল ছাড়া অন্য শেডের বান্ডেল মিক্স করা হলে সিস্টেম ব্লক করে দেবে।

### Module 6: Value Addition (প্রিন্ট এবং এমব্রয়ডারি) - *Optional* `[Running]`
- **Features:**
  - কাটিং থেকে বান্ডেলগুলো প্রিন্ট বা এমব্রয়ডারিতে পাঠানোর সময় স্ক্যান আউট (Scan-OUT) করা।
  - কাজ শেষে স্ক্যান ইন (Scan-IN) করে রিসিভ করা এবং রিজেক্ট পিসগুলো সিস্টেমে বাদ দেওয়া।

### Module 7: Sewing & Line Tracking (সুইং সেকশন) `[Running]`
- **Features:**
  - বান্ডেল সুইং লাইনে ঢোকার সময় 'Line IN' স্ক্যান করা।
  - প্রতি ঘণ্টায় প্রোডাকশন আউটপুট ট্র্যাকিং করা।
  - এক লাইন থেকে অন্য লাইনে বান্ডেল ট্রান্সফার (Line Transfer) করা।

### Module 8: Quality Control (কিউসি) `[Running]`
- **Features:**
  - বান্ডেল স্ক্যান করে Pass, Reject বা Rework স্ট্যাটাস দেওয়া।
  - রিজেক্ট হলে নির্দিষ্ট কারণ (Defect Code - e.g., Open Seam, Spot) সিলেক্ট করা।
- **Business Rule:** রিজেক্ট হওয়া বান্ডেল কোনোভাবেই প্যাকিং বা পরবর্তী ধাপে স্ক্যান হবে না (সিস্টেম ব্লক করে দেবে)।

### Module 9: Washing & Finishing (ওয়াশিং ও ফিনিশিং) `[Running]`
- **Features:**
  - সুইং থেকে মাল ওয়াশিং-এ পাঠানো এবং রিসিভ করা।
  - আয়রনিং (Pressing) এবং ফাইনাল ফোল্ডিংয়ের (Folding) ট্র্যাকিং।

### Module 10: Packing & Shipment (প্যাকিং ও শিপমেন্ট) `[Running]`
- **Features:**
  - প্যাকিং কার্টন (Carton) তৈরি করে তার গায়ে কার্টন বারকোড (Carton Barcode) লাগানো।
  - কার্টনের ভেতরে ঢোকানোর সময় প্রতিটি বান্ডেল স্ক্যান করা (Assortment Check)।
  - প্যাকিং লিস্ট (Packing List) স্বয়ংক্রিয়ভাবে জেনারেট হওয়া।
  - কন্টেইনারে লোড করার সময় শিপমেন্ট স্ক্যান আউট করা।

---

## 4. Supporting Modules (সাপোর্টিং মডিউলসমূহ)

### Module 11: Fabric & Accessories Store (স্টোর মডিউল) `[Future]`
- **Features:**
  - ফেব্রিক রোল এবং ট্রিমস (Trim) রিসিভ করা।
  - কাটিং সেকশনে স্পেসিফিক ফেব্রিক রোল (Shade/Pattern সহ) ইস্যু করা।

### Module 12: BI & Analytics Dashboard (রিপোর্টিং মডিউল) `[Future]`
- **Features:**
  - রিয়েল-টাইম WIP (Work In Progress) ড্যাশবোর্ড।
  - বায়ার ও স্টাইল ভিত্তিক প্রোডাকশন স্ট্যাটাস (Planned vs Actual)।
  - লাইন ভিত্তিক DHU (Defects Per Hundred Units) ও এফিশিয়েন্সি রিপোর্ট।

---

## 5. Key Business Rules (এন্টারপ্রাইজ রুলস)
1. **Sequential Processing:** কোনো বান্ডেল স্কিপ করে পরের ধাপে যেতে পারবে না (যেমন: কাটিং না হয়ে সরাসরি সুইং-এ স্ক্যান হলে সিস্টেম এরর দেবে)।
2. **Offline-First Floor Apps:** কাটিং, সুইং এবং কিউসির ট্যাবলেট অ্যাপগুলোতে লোকাল ডাটাবেস থাকবে। স্ক্যান করা মাত্রই তা সেভ হবে এবং ব্যাকগ্রাউন্ডে সার্ভারে সিঙ্ক হবে।
3. **Role-Based Access (RBAC):** কাটিং মাস্টার শুধু কাটিংয়ের স্ক্রিন দেখতে পাবেন, লাইন সুপারভাইজার শুধু সুইং দেখবেন।

---
**Prepared By:** AI Business Analyst
**Status:** Ready for Technical Architecture Phase (Solution Architect)
