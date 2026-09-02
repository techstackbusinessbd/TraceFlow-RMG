# Version Control (Git) Guidelines
**Role:** DevOps & Cloud Engineer / Tech Lead
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Introduction
To prevent code conflicts, ensure code quality, and maintain a stable production environment for the 12 modules of the RMG Traceability Software, all developers must strictly adhere to this Git Branching Strategy (based on Git Flow).

---

## 2. Branching Strategy

### 2.1. The Main Branches (Protected)
- **`main`**: The Production Branch.
  - This branch reflects exactly what is running on the live server.
  - **Rule:** Direct commits are STRICTLY PROHIBITED. Code can only enter `main` via a Pull Request from `develop` or `hotfix`.
- **`develop`**: The Pre-Production / Staging Branch.
  - All new features and bug fixes are merged here for QA testing.
  - **Rule:** Direct commits are PROHIBITED. Code enters via Pull Requests from `feature` branches.

### 2.2. The Temporary Branches (Developer Workflow)
- **`feature/*`**: For developing new modules or features.
  - *Naming Convention:* `feature/module-name` (e.g., `feature/sewing-qr-scan`, `feature/module-12-export`).
  - *Branched from:* `develop`
  - *Merged into:* `develop`
- **`hotfix/*`**: For urgent bug fixes on the live server.
  - *Naming Convention:* `hotfix/issue-description` (e.g., `hotfix/login-crash`).
  - *Branched from:* `main`
  - *Merged into:* `main` AND `develop` (to ensure the fix isn't overwritten in the next release).

---

## 3. Commit Message Conventions
We enforce **Conventional Commits** to auto-generate changelogs and keep history readable.

### 3.1. Format
`<type>: <short summary in present tense>`

### 3.2. Types
- `feat:` - A new feature (e.g., `feat: added barcode scanner logic for QC`).
- `fix:` - A bug fix (e.g., `fix: resolved double deduction in inventory`).
- `chore:` - Maintenance, dependencies, config updates (e.g., `chore: updated laravel packages`).
- `refactor:` - Code changes that neither fix a bug nor add a feature (e.g., `refactor: moved packing logic to service class`).
- `docs:` - Documentation updates.

---

## 4. Pull Request (PR) & Code Review Rules
Before any code is merged into `develop` or `main`:
1. **Create a PR:** The developer creates a Pull Request on GitHub/GitLab.
2. **CI Check:** GitHub Actions will automatically run `php artisan test` (QA Test Cases). If tests fail, the PR is blocked.
3. **Peer Review:** At least ONE Senior Developer or Tech Lead must review the code for:
   - DDD Architecture compliance (No logic in Controllers).
   - Naming conventions.
   - N+1 query problems in Database Repositories.
4. **Approval:** Only after approval can the PR be merged.

---
*(End of Version Control Guide)*
