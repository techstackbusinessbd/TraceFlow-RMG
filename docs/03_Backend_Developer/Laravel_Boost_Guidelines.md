# Laravel Boost & AI Engineering Guidelines
**Role:** Backend Developer / Solution Architect
**Project:** RMG Traceability Software
**Status:** Approved & Enforced

---

## 1. Overview (পরিচিতি)
Laravel Boost হলো একটি অফিশিয়াল AI-এনহ্যান্সড প্যাকেজ যা এই এন্টারপ্রাইজ RMG ট্রেসিবিলিটি সিস্টেমে সঠিক কোডিং স্ট্যান্ডার্ড, ডোমেন-ড্রিভেন ডিজাইন (DDD), কঠোর টাইপ-চেকিং এবং স্বয়ংক্রিয় আর্কিটেকচারাল সিনক্রোনাইজেশন নিশ্চিত করে।

---

## 2. Core Architecture Rules with Boost (মূল নীতিমালা)

### 2.1. Domain-Driven Design (DDD) এনফোর্সমেন্ট
- সমস্ত মডেল, কন্ট্রোলার, সার্ভিস ও রিপোজিটরি `app/Domains/{DomainName}/` ফোল্ডারে থাকবে।
- সাধারণ MVC (`app/Models`, `app/Http/Controllers`) এ কোনো নতুন বিজনেস লজিক যোগ করা যাবে না।

### 2.2. Service-Repository Pattern
- **Skinny Controllers:** কন্ট্রোলার শুধুমাত্র রিকোয়েস্ট রিসিভ করে সার্ভিস মেথড কল করবে এবং JSON রেসপন্স রিটার্ন করবে।
- **Domain Services:** যাবতীয় বিজনেস রুলস (যেমন: Excess Cutting > 5% ভ্যালিডেশন, DHU ক্যালকুলেশন) সার্ভিস লেয়ারে থাকবে।
- **Repositories:** ডাটাবেস কোয়েরি ও ট্রানজ্যাকশন রিপোজিটরিতে সীমাবদ্ধ থাকবে।

### 2.3. Transaction Integrity (ডাটাবেস ট্রানজ্যাকশন)
- একের অধিক টেবিলে ডাটা সেভ বা আপডেট করার ক্ষেত্রে অবশ্যই `DB::transaction()` ব্যবহার করতে হবে (যেমন: কার্টনে বান্ডেল প্যাক করা, ইনভেন্টরি ইস্যু)।

---

## 3. Maintenance & Sync Commands
যখনই নতুন কোনো ডোমেন বা মডেল যুক্ত করা হবে, তখন নিচের কমান্ডের সাহায্যে Boost গাইডলাইন রিফ্রেশ করা যাবে:
```bash
php artisan boost:install
```
---
