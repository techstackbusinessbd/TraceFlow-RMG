# Frontend Config & Theming Strategy (No Hardcoding)
**Role:** Frontend Developer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
Enterprise software requires extreme maintainability. If a brand color or standard text needs to change, developers should not have to manually edit hundreds of React components. This document establishes the strict **"No Hardcoding"** rule for the frontend.

---

## 2. The "No Arbitrary Values" Rule
Developers must NEVER use arbitrary values in Tailwind classes or hardcoded hex codes.

❌ **BAD (Hardcoded):**
```jsx
<button className="bg-[#4f46e5] text-white p-[12px] rounded-[8px]">
   Save Purchase Order
</button>
```

✅ **GOOD (Config-Driven):**
```jsx
<button className="bg-primary text-white p-3 rounded-lg">
   {TEXT_SAVE_PO}
</button>
```

---

## 3. Extending `tailwind.config.js`
All design tokens must be mapped to semantic names in the `tailwind.config.js` file. This allows global theming.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Map 'primary' to our chosen Indigo shade
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          hover: '#4338ca',   // indigo-700
          light: '#e0e7ff',   // indigo-50
        },
        success: '#10b981', // emerald-500
        danger: '#ef4444',  // red-500
        surface: '#f8fafc', // slate-50
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
}
```
*Usage in React:* `<div className="bg-primary hover:bg-primary-hover text-white font-sans">`

---

## 4. Global Text Constants
Do not hardcode labels, buttons, or error messages directly into JSX. 
Use a configuration file (e.g., `src/config/constants.js` or `i18n` JSON files).

```javascript
// src/config/constants.js
export const UI_TEXT = {
  BUTTON_SAVE: "Save Changes",
  BUTTON_DELETE: "Delete",
  CONFIRM_DELETE_PO: "Are you sure you want to delete this Purchase Order?",
  ERROR_NETWORK: "Network error. Please check your connection."
};
```

*Usage in React:*
```jsx
import { UI_TEXT } from '@/config/constants';

<button>{UI_TEXT.BUTTON_SAVE}</button>
```
*Benefit:* If the client requests changing "Save Changes" to "Submit", you only change it in ONE file.

---

## 5. Component Variants with CVA
For components like Buttons or Badges that have multiple states (e.g., solid, outline, danger), do not write complex ternary operators in JSX. Use `class-variance-authority` (CVA).

```javascript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-primary text-white hover:bg-primary-hover",
        danger: "bg-danger text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "sm",
    },
  }
);
```

---
*(End of Config & Theming Strategy)*
