# QA Test Strategy Master - ENTERPRISE READY
**Author:** QA Engineer

## 1. Testing Methodology
- **Positive Testing:** Ensure standard RMG flow (Cutting -> Sewing -> QC -> Packing) works via QR scans.
- **Negative Testing:** Attempt to bypass steps (e.g. Packing before QC). System must block and return HTTP 403/422.
- **Load Testing:** Simulate 500 tablets sending API requests concurrently using JMeter.

## 2. Offline Sync Testing
- Turn off tablet Wi-Fi -> Scan 50 bundles -> Turn on Wi-Fi -> Verify all 50 bundles synced in correct chronological order using local timestamps.
