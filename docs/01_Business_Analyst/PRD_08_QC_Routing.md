# Product Requirements Document (PRD)
**Module:** QC Inspection & Bundle Routing
**Epic:** Quality Control & Traceability
**Author:** AI Business Analyst Persona
**Date:** 2026-08-28

## 1. Overview (পরিচিতি)
এই মডিউলটির মূল উদ্দেশ্য হলো ফ্যাক্টরি ফ্লোরে কোয়ালিটি কন্ট্রোল (QC) প্রসেসকে ডিজিটালাইজ করা। কিউসি ইন্সপেক্টর যখন কোনো বান্ডেল স্ক্যান করবেন, তখন তিনি সেটি "Pass" বা "Reject/Rework" হিসেবে মার্ক করতে পারবেন। সিস্টেম স্বয়ংক্রিয়ভাবে পাস হওয়া বান্ডেলগুলোকে "Packing" সেকশনে পাঠাবে এবং রিজেক্ট হওয়া বান্ডেলগুলোকে "Rework Line" এ পাঠাবে।

## 2. User Stories (ইউজার স্টোরি)

### Story 1: Bundle Scanning & Status Update
**As a** QC Inspector (কিউসি ইন্সপেক্টর),
**I want to** scan a bundle QR code and mark it as 'Pass', 'Reject', or 'Rework',
**So that** the system records the exact quality status of that specific bundle in real-time.

### Story 2: Auto-Routing for Passed Bundles
**As a** System (সিস্টেম),
**I want to** automatically set the next destination of a 'Passed' bundle to 'Packing',
**So that** workers know exactly where to send the good garments.

### Story 3: Auto-Routing for Defective Bundles
**As a** QC Inspector,
**When I** mark a bundle as 'Reject' or 'Rework',
**I want** the system to route it to the 'Rework Line' and ask me to input the defect reason (e.g., Broken Stitch, Spot),
**So that** defective items never mix with the passed items and the rework team knows what to fix.

### Story 4: Real-time Quality Monitoring
**As a** Floor Manager,
**I want to** view a real-time dashboard showing the ratio of Passed vs Rejected bundles,
**So that** I can identify production bottlenecks or quality issues instantly.

---

## 3. Acceptance Criteria (অ্যাকসেপটেন্স ক্রাইটেরিয়া)
এই ফিচারগুলো ডেভেলপ হওয়ার পর QA ইঞ্জিনিয়ার নিচের শর্তগুলো টেস্ট করে পাস করলেই কাজ শেষ বলে ধরা হবে:

1. **UI/UX Rule:** ট্যাবলেটের স্ক্রিনে "Pass" এবং "Reject" বাটনগুলো অনেক বড় এবং ক্লিয়ার হতে হবে (টাচ-ফ্রেন্ডলি)।
2. **Validation Rule:** যদি কোনো বান্ডেল "Reject" হিসেবে মার্ক করা থাকে, তবে ফ্লোরের কেউ স্ক্যান করে সেটিকে জোরপূর্বক "Packing" এ ট্রান্সফার করতে পারবে না। সিস্টেম সাথে সাথে "Invalid Movement Error" দেখাবে।
3. **Defect Tracking:** রিজেক্ট করার সময় অবশ্যই ড্রপডাউন থেকে রিজেক্টের কারণ (Defect Reason) সিলেক্ট করতে হবে। এটি ছাড়া ফর্ম সাবমিট হবে না।
4. **Offline Rule:** ইন্টারনেট না থাকলেও কিউসি স্ক্যান করে রেজাল্ট লোকাল কিউ-তে (Local Queue) সেভ করতে পারবেন। নেটওয়ার্ক আসার সাথে সাথে তা ব্যাকএন্ডে সিঙ্ক হবে।

---

## 4. Next Steps (পরবর্তী ধাপ)
- **Solution Architect:** এই রিকয়ারমেন্টের ওপর ভিত্তি করে `QC_Transactions`, `Defect_Reasons` এবং `Bundle_Routes` টেবিলের ERD ডিজাইন করবেন।
- **Backend Developer:** API Endpoint (যেমন: `POST /api/v1/qc/inspect`) তৈরি করবেন।
- **Frontend Developer:** ট্যাবলেটের জন্য UI ডিজাইন শুরু করবেন।
