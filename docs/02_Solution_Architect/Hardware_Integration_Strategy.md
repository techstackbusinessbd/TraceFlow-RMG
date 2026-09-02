# Hardware Integration & Data Collection Strategy
**Role:** Solution Architect / Hardware Integrator
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
Although the RMG Traceability Software is entirely **Web-Based (React + Laravel)**, it is designed to operate seamlessly on the factory floor using physical hardware (Tablets, Bluetooth Scanners, and Mobile Phones) without needing any Native Android/iOS development. This document outlines how web technologies will interface with factory hardware.

---

## 2. Progressive Web App (PWA) Architecture
To make the web application feel and behave like a Native App on Tablets and Mobiles, we will use **PWA standards**.

### 2.1. Installation on Tablets
- When the URL is opened on Chrome (Android Tablet), the system will prompt: **"Add to Home Screen"**.
- This installs the web app as a standalone application. 
- **Benefits:** No URL bar is visible, full-screen immersive mode, and prevents operators from browsing the internet.

### 2.2. Offline Data Collection (Service Workers + IndexedDB)
- **Problem:** Factory Wi-Fi can drop momentarily.
- **Solution:** If the network drops, the React app intercepts the QR scan and saves it to the browser's local `IndexedDB`. 
- When the network returns, the Service Worker automatically pushes the queued scans to the Laravel API.

---

## 3. Bluetooth Barcode Scanner Integration

### 3.1. Keyboard Emulation (HID Mode)
- **Setup:** A generic Bluetooth 2D Barcode Scanner is paired with the Android Tablet via Bluetooth. The scanner is configured to operate in **HID (Human Interface Device)** mode, meaning it acts exactly like a physical keyboard.
- **Data Flow:**
  1. The operator scans a QR Code (e.g., `BNDL-998877`).
  2. The scanner rapidly "types" `BNDL-998877` into the tablet.
  3. The scanner automatically sends an `Enter` (Carriage Return) keystroke at the end.

### 3.2. React UI Handling for Scanners
- The Frontend Developer must create a global "Scanner Listener" component or keep an invisible `<input type="text" autoFocus />` always active on the screen.
- When the `Enter` key event is detected, React captures the string and triggers the API call. No physical tapping on the screen is required by the operator to submit a scan.

---

## 4. Mobile Camera Scanning (WebRTC)
For QA Managers, Floor In-charges, or IE personnel who do not carry Bluetooth scanners but need to do spot checks.

### 4.1. HTML5 Barcode Detection API
- **Implementation:** Use a library like `html5-qrcode` or the native Web Barcode Detection API.
- **Usage:** A "Scan with Camera" button on the UI opens the mobile phone's back camera directly inside the web browser.
- **Use Case:** A QA manager walks to a Sewing Line, opens the PWA on their iPhone/Android, taps the camera icon, and scans a Single Piece QR to instantly view its history.

---
*(End of Hardware Integration Strategy)*
