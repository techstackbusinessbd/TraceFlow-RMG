# Product Requirements Document (PRD)
**Module:** 11 - System Admin & User Management
**Author:** AI Business Analyst
**Status:** Approved for Development

## 1. Module Overview
যেহেতু আমাদের সিস্টেমে ট্রেসিবিলিটি এবং সিকিউরিটি অত্যন্ত গুরুত্বপূর্ণ, তাই অ্যাডমিন মডিউলটি ঠিক করবে কোন ইউজার কোন পেজ বা অপশন ব্যবহার করতে পারবে। ফ্লোরের ট্যাবলেটগুলোতে কোন প্রোডাকশন লাইন বা প্রসেস সিলেক্ট করা আছে সেটিও এখান থেকে ম্যানেজ করা হবে।

## 2. Target Users
- Super Admin
- IT Manager

## 3. Data Entities (টেবিলসমূহ)
এই মডিউলের জন্য ব্যাকএন্ড টিম নিচের ডাটা স্ট্রাকচারগুলো তৈরি করবে:

1. **Role (রোল):**
   - Role Name (e.g., Super Admin, Cutting Master, QA Inspector)
   - Permissions (JSON Format)
2. **User (ইউজার):**
   - Name
   - Email/Username
   - Password
   - Role_ID (Foreign Key)
   - Status (Active/Inactive)
3. **Device / App Station (ট্যাবলেট/ডিভাইস):**
   - Device MAC/IP (For Security)
   - Section (Cutting, Sewing, QA)
   - Assigned Line_ID (For Sewing QA tablets)

## 4. Acceptance Criteria (QA রুলস)
- [ ] **AC 1:** পাসওয়ার্ড অবশ্যই এনক্রিপ্টেড (Bcrypt) অবস্থায় ডাটাবেসে সেভ থাকতে হবে। 
- [ ] **AC 2:** 'Inactive' স্ট্যাটাস থাকা কোনো ইউজার সিস্টেমে লগিন করতে পারবে না।
- [ ] **AC 3:** JWT (JSON Web Token) বা Sanctum ব্যবহার করে এপিআই (API) সিকিউরড হতে হবে। লগিন ছাড়া কোনো এন্ডপয়েন্ট (Endpoint) অ্যাক্সেস করা যাবে না।

---
*Next Step: Backend Developer will create Laravel Migrations & Controllers for this PRD.*
