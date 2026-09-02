# Product Requirements Document (PRD)
**Module:** 08 - Quality Control
**Version:** 3.0 (Enterprise Manual Details)

## 1. Executive Summary
Defect tracking at the end of the sewing line. Logs DHU (Defect Hundred Units).

## 2. Functional Requirements
- **DHU Formula:** `(Total Defects / Total Inspected) * 100`.
- **Rework Loop:** A bundle marked with "Alter" cannot proceed to Washing. It must be fixed and re-scanned as "Pass".
- **Defect Library:** Dropdown of standard defects (e.g. Broken Stitch, Puckering, Oil Spot).

## 3. Acceptance Criteria
- [ ] Auto-calculates DHU real-time on tablet.
