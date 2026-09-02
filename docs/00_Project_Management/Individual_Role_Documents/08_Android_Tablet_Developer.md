# RMG Woven Garments Traceability Software
## Role Document — Android / Tablet Developer

### বাংলা

**প্রস্তাবিত জনবল:** ১–২ জন

Production floor-এর transaction capture-এর জন্য Android/tablet application develop করবে।

### দায়িত্ব
- Login
- QR/Barcode scanning
- Bundle receive/send
- Sewing input
- QC
- Transfer
- Rework
- Offline transaction
- Auto synchronization
- Device integration

### Offline Strategy
```text
Online → API
Offline → Local Queue
Network Restored → Sync
```

### Critical Requirements
- Fast scanning
- Low typing
- Duplicate protection
- Sync conflict handling
- Transaction retry
- Device-level logging

### English

**Recommended Headcount:** 1–2

Responsible for production-floor Android/tablet applications.

### Responsibilities
- Authentication
- QR/barcode scanning
- Bundle receive/send
- Sewing input
- QC
- Transfer
- Rework
- Offline transactions
- Automatic synchronization
- Device integration

### Critical Requirements
- Fast scanning
- Minimal typing
- Duplicate protection
- Sync conflict handling
- Retry mechanism
- Device-level logging

### KPIs / Success Metrics
- Zero data loss during offline sync
- App crash rate (< 0.1%)
- Scanning speed and battery optimization
