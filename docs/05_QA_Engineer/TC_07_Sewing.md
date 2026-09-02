# Test Cases: Module 07 (Sewing)
**Role:** QA Engineer
**Status:** Approved

## 1. Test Case: Offline Sync Resiliency
- **Step 1:** Turn OFF WiFi on the tablet.
- **Step 2:** Scan 5 valid bundles.
- **Step 3:** Verify the UI shows "5 pending syncs" and the tablet allows continued scanning without freezing.
- **Step 4:** Turn ON WiFi.
- **Expected Result:** Within 5 seconds, the pending count drops to 0. Database `sewing_logs` contains all 5 scans with the *original* scan timestamp, not the sync timestamp.

## 2. Test Case: High Concurrency (Stress Test)
- **Step 1:** Use Apache JMeter or Postman Runner.
- **Step 2:** Send 200 POST requests to `/api/v1/sewing/sync` within 1 second.
- **Expected Result:** API must respond to all requests with `202 Accepted` within 500ms. No `500 Deadlock` or `504 Timeout` errors allowed. Queue worker processes them in the background.

## 3. Test Case: Dashboard Red Zone Logic
- **Step 1:** Set Target for Line 01 = 100 pcs/hr.
- **Step 2:** Inject 89 scans into `hourly_productions`.
- **Expected Result:** Dashboard row for Line 01 turns Red (since 89 is >10% below 100).
