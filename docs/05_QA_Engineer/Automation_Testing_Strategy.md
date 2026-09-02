# Automation Testing Strategy
**Role:** QA Engineer
**Status:** Approved

## 1. End-to-End (E2E) Automation
- Use **Cypress** (for Web Admin) and **Appium** (for Tablets).
- Core critical paths (Login, Create PO, Scan Bundle) must have automated test coverage.
- Tests must run automatically in the CI/CD pipeline before any deployment.

## 2. Load Testing (JMeter)
- Scenario: Shift change (e.g. 1:00 PM).
- 500 lines concurrently sending "Scan OUT" API requests.
- Assert: Server must handle 500 requests/sec with response time < 300ms without throwing 502/503 errors.
