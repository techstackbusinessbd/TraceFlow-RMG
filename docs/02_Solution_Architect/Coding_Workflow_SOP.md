# Coding Workflow & Standard Operating Procedure (SOP)
**Role:** All Developers (Backend & Frontend)
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To ensure maximum code quality and prevent bugs from reaching production (especially critical bugs like double inventory deduction), all developers MUST follow this daily workflow. 

---

## 2. The Daily Developer Workflow (Step-by-Step)

### Step 1: Task Assignment & Branching
1. **Pick a Task:** Pick a task from Jira/Trello (e.g., "Implement QC Defect Scan").
2. **Pull Latest Code:** Always run `git checkout develop` and `git pull origin develop` to get the latest stable code.
3. **Create Branch:** Create a new branch `git checkout -b feature/qc-defect-scan`.

### Step 2: Test-Driven Development (TDD)
Before writing any business logic, you MUST write the test cases first.
- **Backend:** Create a PHPUnit test (`php artisan make:test QCDefectScanTest`).
  - Write the test: "Assert that scanning an already rejected piece returns a 422 error".
  - Run the test. It should **FAIL** (Red phase).
- **Frontend:** Create a Jest test for the React component (e.g., "Assert that error boundary turns screen red").

### Step 3: Core Implementation (DDD Pattern)
Now write the code to make the test pass.
- **Rule:** DO NOT write business logic in the Controller. 
- Create a `QCScanService` class.
- Validate the input, execute the logic, and use a `QCRepository` class if you need to query the database.
- Wrap multi-table updates in `DB::transaction()`.

### Step 4: Local Testing
- **Run Automated Tests:** Run `php artisan test`. All tests must pass (Green phase).
- **Manual API Testing:** Open **Postman** or **Insomnia**, pass the Sanctum Auth Token, and manually hit the endpoint with various edge-case JSON payloads.
- **Frontend Testing:** Verify the UI on both Desktop view and Tablet (iPad) resolution using Chrome DevTools.

### Step 5: Code Quality & Linting
Do not push messy code.
- **Backend:** Run `PHP_CodeSniffer` or Laravel Pint (`php artisan pint`) to automatically format the PHP code.
- **Frontend:** Run `npm run lint` (ESLint) and fix any warnings.

### Step 6: Commit and Push
- Commit using Conventional Commits.
  - `git commit -m "feat: implemented qc defect scanning logic"`
- Push to GitHub: `git push origin feature/qc-defect-scan`

### Step 7: Pull Request (PR)
- Go to GitHub and open a Pull Request against the `develop` branch.
- Wait for GitHub Actions to run the CI pipeline (Tests & Linting).
- Tag a Senior Developer for Code Review.
- Once Approved, the code is merged.

---
*(End of SOP)*
