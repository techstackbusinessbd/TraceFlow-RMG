# Frontend Component Architecture
**Role:** Frontend / Android Developer
**Framework:** React (Web), React Native / Kotlin (Tablet)
**Status:** Approved

## 1. Directory Structure
```text
/src
  /components     (Reusable UI components: Buttons, Modals)
  /features       (Module-specific logic: Sewing, QC)
  /services       (Axios API calls)
  /store          (Zustand/Redux state management)
```

## 2. Offline-First Architecture (Critical)
- **Local Database:** Android tablets must use SQLite / LocalForage to store today's allocated bundles.
- **Sync Logic:** If `navigator.onLine` is false, save scans locally with `sync_status = pending`.
- **Background Sync:** Use Service Workers / WorkManager to push data in bulk when Wi-Fi connects.

## 3. API Integration
- Use `Axios` interceptors to inject the Bearer Token automatically.
- Handle 401 Unauthorized by auto-redirecting to Login screen.
