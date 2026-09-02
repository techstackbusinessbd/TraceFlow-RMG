# Module 07: UI/UX Specifications (Sewing Tablet App)
**Role:** Frontend Developer
**Status:** Approved

## 1. Android Tablet UI Constraints
- **Dark Mode:** Mandatory. Factory floors are bright; tablets run on battery all day. Dark mode saves battery and reduces eye strain.
- **Touch Targets:** Minimum 48x48dp for all buttons. Operators wear gloves or have dirty hands.
- **Visual Feedback:** 
  - Success Scan: Screen flashes Green. Happy beep.
  - Error Scan: Screen flashes Red. Angry beep.

## 2. Offline-First Sync Architecture (Crucial)
- Use a local database (e.g., SQLite via capacitor/react-native, or IndexedDB if PWA).
- When a QR is scanned, save it locally first with `sync_status = false`.
- A background worker checks for internet every 5 seconds. If connected, it POSTs all unsynced scans to `/api/v1/sewing/sync`. Upon receiving `202 Accepted`, it updates local `sync_status = true`.
