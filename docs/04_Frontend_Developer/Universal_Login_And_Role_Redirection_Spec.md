# Universal Login & Role-Based Landing Engine Specification
## Single Unified Login Architecture with Smart Multi-Role Routing
**ডকুমেন্ট রেফারেন্স:** `TFRMG-SPEC-AUTH-ROUTER-V2.0`  
**ডকুমেন্ট ভার্সন:** 2.0 (Tier-1 Enterprise Identity & Redirection Standard)  
**স্ট্যান্ডার্ড কমপ্লায়েন্স:** NIST SP 800-63B Identity Guidelines, RFC 7807 Problem Details, Zero Modals Strict Directive  
**টার্গেট আর্কিটেকচার:** React 19 + TypeScript + TailwindCSS + Laravel 13 Sanctum Engine + Redis 7  
**স্ট্যাটাস:** Approved & Production-Ready  

---

## ১. নির্বাহী সারসংক্ষেপ ও উদ্দেশ্য (Executive Overview)

TraceFlow RMG প্ল্যাটফর্মে বিভিন্ন স্তরের ব্যবহারকারী (সুপার এডমিন, সিইও, ফ্লোর সুপারভাইজার, কিউসি পরিদর্শক, স্টোরকিপার এবং প্যাকিং অপারেটর) কাজ করেন। এদের জন্য আলাদা আলাদা লগইন ইউআরএল রাখা চরম বিশৃঙ্খলা তৈরি করে।

এই ডকুমেন্টের উদ্দেশ্য হলো:
1. কারখানার ১০০% ব্যবহারকারীর জন্য একটিমাত্র **ইউনিফাইড ও নিরাপদ লগইন পেজ (`/login`)** প্রতিষ্ঠা করা।
2. লগইন সম্পন্ন হওয়ার পর সিস্টেম কীভাবে স্বয়ংক্রিয়ভাবে ইউজারের ভূমিকা (Role) ও পারমিশন বিশ্লেষণ করে সংশ্লিষ্ট **রোল-ভিত্তিক ড্যাশবোর্ডে বা ফ্লোর স্টেশনে রিডাইরেক্ট করবে** তা নির্ধারণ করা।
3. একাধিক রোলধারী ব্যবহারকারীর ক্ষেত্রে **অগ্রাধিকার ক্রম (Multi-Role Precedence Hierarchy)** সুনির্দিষ্ট করা।
4. প্রজেক্টের গ্লোবাল নিয়মাবলি (**STRICT No Modals**, **Pure Server Validation**, **Flat Solid Design**, **Tri-Identifier Input**) শতভাগ বলবৎ রাখা।

---

## ২. ইউনিফাইড সিঙ্গেল লগইন পেজ স্পেসিফিকেশন (Universal Login Page UI/UX)

* **ইউআরএল রুট:** `/login`
* **লেআউট ধরণ:** ফুল-পেজ সেন্ট্রালাইজড অথেনটিকেশন শেল (Full-Page Centered Responsive Layout)।
* **থিম ও স্টাইলিং:** ডিপ মিডনাইট এন্টারপ্রাইজ ব্যাকগ্রাউন্ড (`bg-slate-950`) এবং পিউর হোয়াইট কন্টেন্ট কার্ড (`bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-md w-full`)।

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [TRACEFLOW RMG] Precision Fabric-to-Freight Garment Intelligence                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Sign In to Enterprise Portal                                                           │
│ Enter your credentials to access your dedicated workspace                              │
│                                                                                        │
│ [ Field 1: Employee ID / Username / Email ]                                            │
│ [ e.g. EMP-1042 or khaled.admin or ceo@traceflow.com                                 ] │
│                                                                                        │
│ [ Field 2: Password ] [👁️ Show]                                                        │
│ [ •••••••••••••••••                                                                  ] │
│                                                                                        │
│ [ STEP 2 (Conditional Progressive Inline): Google Authenticator 2FA Code ]              │
│ [ 6-Digit TOTP PIN: [ _ _ _ _ _ _ ]                                                  ] │
│                                                                                        │
│ [ Flat Crisp Solid Blue Button: Sign In to Workspace ] (bg-blue-600)                    │
│                                                                                        │
│ 🔒 Protected by Hardware Device Pinning & WORM Security Vault                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### ২.১ লগইন পেজের মূল উপাদান ও ফিল্ড ভ্যালিডেশন
1. **ট্রাই-আইডেন্টিফায়ার ইনপুট ফিল্ড (`identifier`):**
   - একটিমাত্র ইনপুট বক্স যা স্বয়ংক্রিয়ভাবে তিনটি ফরম্যাট গ্রহণ করবে:
     - **Employee ID:** e.g. `EMP-1042`
     - **Username:** e.g. `khaled.admin`
     - **Email:** e.g. `ceo@traceflow.com`
   - সার্ভার সাইডে Regex দ্বারা ইনপুট টাইপ স্বয়ংক্রিয়ভাবে শনাক্ত হবে।
2. **পাসওয়ার্ড ফিল্ড (`password`):**
   - পাসওয়ার্ড মাস্কিং সহ ডানপাশে শো/হাইড আইকন বাটন।
3. **প্রগ্রেসিভ ২এফএ স্টেপ (Inline Progressive 2FA - No Modal):**
   - যেসব ইউজারের একাউন্টে ২এফএ সক্রিয় (যেমন: Super Admin, MD, CFO), তাদের পাসওয়ার্ড সঠিক হওয়ার পর কোনো পপআপ বা নতুন উইন্ডো খুলবে না। একই কার্ডের ভেতরে পাসওয়ার্ড ফিল্ডের নিচে একটি স্মুথ ৬-ডিজিট পিন ইনপুট বক্স প্রগ্রেসিভভাবে উন্মোচিত হবে।
4. **পিউর সার্ভার-সাইড ভ্যালিডেশন (Pure Server-Side Validation):**
   - ফর্মটিতে `<form noValidate>` স্পষ্টভাবে যুক্ত থাকবে।
   - ব্রাউজারের কোনো ডিফল্ট পপআপ বা টুলটিপ থাকবে না।
   - ইউজার নাম ভুল হলে বা পাসওয়ার্ড না মিললে সার্ভারের `401 Unauthorized` বা `422 Unprocessable Content` এরর সরাসরি ইনপুট বক্সের নিচে ক্রিস্প লাল রঙে (`text-rose-500 text-xs font-medium mt-1`) প্রদর্শিত হবে।
5. **ফ্ল্যাট সলিড বাটন:**
   - সাইন-ইন বাটন সম্পূর্ণ সলিড ব্লু (`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md`) হবে। কোনো গ্রেডিয়েন্ট ব্যবহার করা যাবে না।

---

## ৩. পোস্ট-লগইন স্মার্ট রিডাইরেকশন ম্যাট্রিক্স (Master Landing Matrix)

লগইন সফল হওয়ার সাথে সাথে ব্যাকএন্ড টোকেন ইস্যু করবে এবং ইউজারের রোল অনুসারে ফ্রন্টএন্ড রাউটার তাকে তার সুনির্দিষ্ট ড্যাশবোর্ডে বা স্টেশনে পাঠিয়ে দেবে:

| ক্রম | ব্যবহারকারীর ভূমিকা (User Role) | স্বয়ংক্রিয় ল্যান্ডিং ড্যাশবোর্ড / স্টেশন | টার্গেট ইউআরএল রুট | অ্যাক্সেস স্কোপ |
|---|---|---|---|---|
| 👑 **১** | **Platform Owner / Super Admin** | **Platform Owner Command Center** | `/admin/platform-overview` | গ্লোবাল মাল্টি-প্ল্যান্ট, লাইসেন্সিং ও পার্জ গেটওয়ে |
| 📊 **২** | **Managing Director / CEO / Chairman** | **Executive C-Suite Strategy Dashboard**| `/commercial/bi/dashboard` | ম্যাক্রো ফাইন্যান্স, ওটিডি %, কস্ট ভ্যারিয়েন্স |
| ⚙️ **৩** | **General Manager / Factory Head** | **Plant Operations & PPC Master Dashboard**| `/planning/dashboard` | দৈনিক কাটিং/সুইং আউটপুট, লাইন স্টারভেশন |
| 📋 **৪** | **Planning Manager / Head of IE** | **Production Planning & IE Master Hub** | `/planning` | কার্ড মার্কার, লাইন ব্যালেন্সিং ও শিডিউল |
| 🔍 **৫** | **Head of QA / Quality Manager** | **Quality & Defect Intelligence Dashboard**| `/qc/dhu-board` | লাইভ DHU ট্রাফিক লাইট, নিডেল কোয়ারেন্টাইন |
| 📦 **৬** | **Fabric Store Head / Trims Manager** | **Supply Chain & Warehouse Dashboard** | `/warehouse/dashboard` | রিল্যাক্সেশন চেম্বার টাইমার, ট্রিমস স্টক |
| 🚢 **৭** | **CFO / Commercial Manager** | **Commercial Export & Logistics Dashboard**| `/commercial/dashboard` | এলসি রিয়ালাইজেশন, এক্স-ফ্যাক্টরি ক্যালেন্ডার |
| 💻 **৮** | **IT System Administrator / Engineer** | **IT Health & Tablet Fleet Dashboard** | `/admin/devices` | ফ্লোর ট্যাবলেট ফ্লিট, স্ক্যান লেটেন্সি, রেডিজ |
| ✂️ **৯** | **Cutting Master / Operator** | **Cutting Spreading & Bundling Station** | `/cutting/station/bundles` | মার্কার লেআউট ও ডুয়াল-টিয়ার কিউআর প্রিন্ট |
| 🧵 **১০**| **Sewing Line-In Operator** | **Sewing Line-In Bundle Feeding Station** | `/sewing/station/line-in` | মাস্টার বান্ডল কিউআর স্ক্যান ও ফিডিং |
| 👕 **১১**| **Sewing Line-Out Operator** | **Sewing Line-Out Garment Station** | `/sewing/station/line-out` | চাইল্ড সিঙ্গেল-পিস কিউআর স্ক্যান |
| 🔎 **১২**| **End-Line QC Inspector** | **100% End-Line QC & Defect Pinner** | `/qc/station/end-line` | ২ডি সিলুয়েট বডি ম্যাপ ডিফেক্ট পিনিং |
| 🧼 **১৩**| **Washing Machine Operator** | **Industrial Washing Batch Console** | `/washing/station/batches` | ওয়াশ রেসিপি ও কেমিক্যাল সাইকেল লগিং |
| 🔘 **১৪**| **Finishing & Metal Detector Operator**| **Finishing & Metal Calibration Station**| `/finishing/station/metal` | ৯০ নিউটন বাটন পুল টেস্ট ও মেটাল স্ক্যান |
| 📦 **১৫**| **Carton Packing Operator** | **Carton Packing & Scale Weight Station** | `/packing/station/carton-pack`| এসএসসিসি-১৮ লেবেল প্রিন্ট ও ডিজিটাল স্কেল |
| 📺 **১৬**| **Floor TV Kiosk Account** | **Live Sewing Floor Andon TV Display** | `/sewing/andon-display` | ৬৫ ইঞ্চি টিভির জন্য মেনুমুক্ত হাই-কন্ট্রাস্ট মোড |

---

## ৪. মাল্টি-রোল অগ্রাধিকার সমাধান ইঞ্জিন (Multi-Role Precedence Resolver)

একজন ব্যবহারকারীর যদি সিস্টেমে একাধিক রোল থাকে (যেমন: একজন কর্মকর্তা একই সাথে "General Manager" এবং "Planning Head"), তখন সিস্টেম একটি **কঠোর অগ্রাধিকার চেইন (Precedence Hierarchy Chain)** অনুসরণ করে সর্বোচ্চ অগ্রাধিকারপ্রাপ্ত ড্যাশবোর্ডে তাকে ল্যান্ড করাবে:

```typescript
// services/RoleLandingEngine.ts
// Strict Hierarchy of Roles in RMG Operations

export const ROLE_PRECEDENCE_ORDER = [
  'Super Admin',
  'Platform Owner',
  'Managing Director',
  'CEO',
  'Chairman',
  'General Manager',
  'Plant Head',
  'CFO',
  'Commercial Manager',
  'Head of QA',
  'Quality Manager',
  'Planning Manager',
  'IE Manager',
  'Fabric Store Manager',
  'Warehouse Head',
  'IT Admin',
  'Sewing Supervisor',
  'Cutting Master',
  'Floor Inspector',
  'Floor Operator',
  'Floor TV Device'
] as const;

export const resolveLandingPath = (userRoles: string[], customLandingPath?: string): string => {
  // 1. If user has set an explicit personalized default landing page in their settings
  if (customLandingPath && customLandingPath.startsWith('/')) {
    return customLandingPath;
  }

  // 2. Resolve by Strict Precedence Hierarchy
  if (userRoles.includes('Super Admin') || userRoles.includes('Platform Owner')) {
    return '/admin/platform-overview';
  }
  if (userRoles.some(r => ['Managing Director', 'CEO', 'Chairman'].includes(r))) {
    return '/commercial/bi/dashboard';
  }
  if (userRoles.some(r => ['General Manager', 'Plant Head'].includes(r))) {
    return '/planning/dashboard';
  }
  if (userRoles.some(r => ['Head of QA', 'Quality Manager'].includes(r))) {
    return '/qc/dhu-board';
  }
  if (userRoles.some(r => ['Fabric Store Manager', 'Warehouse Head'].includes(r))) {
    return '/warehouse/dashboard';
  }
  if (userRoles.some(r => ['CFO', 'Commercial Manager'].includes(r))) {
    return '/commercial/dashboard';
  }
  if (userRoles.some(r => ['Planning Manager', 'IE Manager'].includes(r))) {
    return '/planning';
  }
  if (userRoles.includes('IT Admin')) {
    return '/admin/devices';
  }
  if (userRoles.includes('End-Line QC Inspector')) {
    return '/qc/station/end-line';
  }
  if (userRoles.includes('Line-Out Operator')) {
    return '/sewing/station/line-out';
  }
  if (userRoles.includes('Floor TV Device')) {
    return '/sewing/andon-display';
  }

  // 3. Fallback for General Merchandisers / Standard Users
  return '/orders';
};
```

---

## ৫. সেশন ম্যানেজমেন্ট ও পোস্ট-লগইন অটো-রিটার্ন (Session & Auto-Return Protocol)

### ৫.১ টাইমআউট পলিসি (Inactivity Timeout Policy)
1. **ওয়েব ব্রাউজার ইউজার (Office Staff / Management):**
   - ২ ঘণ্টা নিষ্ক্রিয় (Inactivity) থাকলে সেশন টোকেন এক্সপায়ার হবে এবং সিস্টেম স্বয়ংক্রিয়ভাবে স্ক্রিন লক করে `/login` এ পাঠিয়ে দেবে।
2. **ফ্লোর ট্যাবলেট ও কিওস্ক অ্যাপ (Floor Stations):**
   - প্রোডাকশন বিঘ্ন এড়াতে ফ্লোর স্টেশন ট্যাবলেটগুলো **১ বছরের লং-লিভড এজ স্টেশন টোকেন (Station Token)** দিয়ে অনুমোদিত থাকবে। অপারেটর শিফট চেঞ্জ হলেও ট্যাবলেট লগআউট হবে না।

### ৫.২ পূর্বের পেজে অটো-রিটার্ন লজিক (`redirect_to` Parameter)
যদি কোনো ইউজার কোনো নির্দিষ্ট পেজে কাজ করার সময় (যেমন: `/qc/station/end-line` বা `/commercial/invoices/EXP-042`) সেশন এক্সপায়ার হয়ে লগইন স্ক্রিনে চলে যায়:
- সিস্টেম ইউআরএলে কারেন্ট পাথ সেভ করবে: `/login?redirect_to=%2Fcommercial%2Finvoices%2FEXP-042`
- ইউজার পুনরায় লগইন করলে সিস্টেম তার ডিফল্ট রোল ড্যাশবোর্ডের পরিবর্তে সরাসরি তার কাজ করতে থাকা সেই নির্দিষ্ট পেজে ফিরিয়ে দেবে।

---

## ৬. কিউএ গ্রহণযোগ্যতার মানদণ্ড (Acceptance Criteria & Test Cases)

1. **`TC-AUTH-001` (Single Universal Login Verification):**
   - সুপার এডমিন, সিইও এবং ফ্লোর অপারেটর—উভয়কেই ব্রাউজারে একই ইউআরএল `/login` লোড করানো।
   - **প্রত্যাশিত ফলাফল:** সবার জন্য একই পরিচ্ছন্ন লগইন ইন্টারফেস আসবে; কোনো আলাদা পোর্টাল লাগবে না।
2. **`TC-AUTH-002` (Tri-Identifier Auth Flexibility):**
   - একই একাউন্টে একবার Emp ID (`EMP-1001`), একবার Username (`super.admin`), এবং একবার Email (`admin@traceflow.com`) দিয়ে লগইন করা।
   - **প্রত্যাশিত ফলাফল:** তিনটি ক্ষেত্রেই পাসওয়ার্ড সঠিক হলে সফলভাবে লগইন সম্পন্ন হবে।
3. **`TC-AUTH-003` (Role-Based Landing Verification):**
   - সিইও ক্রেডেনশিয়াল দিয়ে লগইন করা -> অবিলম্বে `/commercial/bi/dashboard` এ ল্যান্ড করবে।
   - ফ্লোর কিউসি ইন্সপেক্টর দিয়ে লগইন করা -> অবিলম্বে `/qc/station/end-line` এ ল্যান্ড করবে।
   - সুপার এডমিন দিয়ে লগইন করা -> অবিলম্বে `/admin/platform-overview` এ ল্যান্ড করবে।
4. **`TC-AUTH-004` (Pure Server Validation Compliance):**
   - খালি ইনপুট বা ভুল পাসওয়ার্ড দিয়ে সাইন-ইন চাপলে কোনো ব্রাউজার পপআপ আসবে না। সার্ভারের HTTP 422/401 এরর বার্তা সরাসরি ইনপুট বক্সের নিচে ক্রিস্প লাল রঙে প্রদর্শিত হবে।

---

*(ডকুমেন্ট সমাপ্ত — Universal Login & Role-Based Landing Engine Specification)*
