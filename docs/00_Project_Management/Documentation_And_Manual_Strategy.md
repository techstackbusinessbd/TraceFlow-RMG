# Project Documentation & User Manual Strategy
**Role:** Project Manager / Business Analyst
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
A successful Enterprise Software deployment depends heavily on user adoption. If factory floor operators and admins do not understand how to use the software, the system will fail. This document outlines the strategy for creating and maintaining both Technical Documentation (for developers) and User Manuals (for factory staff).

---

## 2. Technical Documentation (For Developers)

### 2.1. System Architecture & PRDs
- All architecture guidelines, UI/UX specs, and PRDs (Product Requirements Documents) are written in Markdown (`.md`) format.
- These files are stored directly in the GitHub repository under the `docs/` folder. This ensures that documentation is always version-controlled alongside the code.

### 2.2. API Documentation (Scribe)
- Backend developers must NOT write API documentation manually in Word or PDF files.
- We will use the **`knuckleswtf/scribe`** package for Laravel.
- Developers will add DocBlocks above their controller methods, and Scribe will automatically generate a beautiful, interactive HTML API documentation page for the Frontend developers to consume.

---

## 3. End-User Manual (For Factory Staff & Admins)

### 3.1. In-App Contextual Help
- Every major page in the Admin Panel (e.g., Purchase Orders, Sewing Line Tracking) must feature a **"Help (?) Icon"** in the top-right corner.
- Clicking this icon will open a Slide-over (Right Drawer) containing a quick summary of what that page does and how to use it, without forcing the user to leave the page.

### 3.2. Dedicated Knowledge Base (Wiki)
- A dedicated, mobile-friendly documentation website will be created (e.g., hosted at `docs.rmg-tracking.com`).
- **Tech Stack:** We will use **Docusaurus** or **VitePress** to generate this static site.
- **Content:** It will contain step-by-step guides, screenshots, and short GIF/Video tutorials on how to operate the scanners and tablets.

### 3.3. Multilingual Support (Mandatory)
- Factory floor operators in Bangladesh primarily speak Bengali.
- Therefore, the End-User Knowledge Base MUST support both **English and Bengali**. 
- Video tutorials must have Bengali voiceovers or subtitles.

---
*(End of Documentation Strategy)*
