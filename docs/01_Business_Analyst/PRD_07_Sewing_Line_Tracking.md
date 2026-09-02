# Product Requirements Document (PRD)
**Module:** 07 - Sewing & Line Tracking
**Version:** 3.0 (Enterprise Manual Details)

## 1. Executive Summary
Core of tracing. Operators scan QR codes at the start (Input) and end (Output) of the sewing line.

## 2. Functional Requirements
- **WIP Calculation:** `Total Input - Total Output = Line WIP`.
- **Offline Sync:** If Wi-Fi fails, Android tablet saves scans in local SQLite database. When Wi-Fi restores, pushes via bulk API.
- **Strict Validation:** A bundle scanned as Input in Line 1 cannot be scanned as Output in Line 2 without a formal Line Transfer approval.

## 3. Acceptance Criteria
- [ ] Scan speed < 200ms.
- [ ] Duplicate scan shows red warning modal.
