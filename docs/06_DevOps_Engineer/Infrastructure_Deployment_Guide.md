# Infrastructure & Deployment Guide
**Role:** DevOps & Cloud Engineer
**Project:** RMG Traceability Software
**Status:** Approved for Implementation

---

## 1. Executive Summary
This document outlines the server architecture, deployment pipelines, and scaling strategies required to host the RMG Traceability Software. Because this system tracks millions of single-piece garments and handles extreme bursts of traffic (e.g., end-of-shift sewing scans), the infrastructure must be highly available, fault-tolerant, and performant.

---

## 2. Server Architecture (Production Environment)
We recommend a distributed architecture over a single monolithic server to ensure no single point of failure.

### 2.1. The Application Server (Laravel 13 & React)
- **OS:** Ubuntu 24.04 LTS
- **Web Server:** Nginx (configured for high concurrency).
- **PHP:** PHP 8.3+ with PHP-FPM. Opcache MUST be enabled.
- **Node.js:** Latest LTS (for building frontend assets if not pre-built).
- **Specs Recommendation:** Minimum 8 Core CPU, 16GB RAM (Scalable).

### 2.2. The Database Server (PostgreSQL)
- **Engine:** PostgreSQL (Latest).
- **Storage:** NVMe SSDs are mandatory for high IOPS (Input/Output Operations Per Second) required by UUID indexing.
- **Backup:** Point-in-Time Recovery (PITR) enabled. Daily snapshot backups to external storage (e.g., AWS S3 or GCP Cloud Storage).
- **Specs Recommendation:** Minimum 16 Core CPU, 32GB RAM.

### 2.3. The Queue & Cache Server (Redis)
- **Engine:** Redis 7+
- **Use Case:** This is the heart of the system's performance. It powers `Laravel Horizon` for background job processing (handling the 200+ scans/sec from the Sewing module) and `Laravel Reverb` for WebSockets.
- **Specs Recommendation:** 4 Core CPU, 8GB RAM (Memory-optimized).

---

## 3. Docker Environment (100% Dev-Prod Parity)
For absolute consistency, **DevOps (Production) and Local DevOps (Development) MUST be exactly the same**. The exact same Docker architecture used locally will be used on the production server.

### 3.1. Unified `docker-compose.yml` Strategy
Both Local and Production environments will spin up the following services via Docker:
- `app` (Laravel)
- `frontend` (React + Vite dev server)
- `postgres` (Database)
- `redis` (Cache/Queue)
- `horizon` (Queue Worker running in a separate container)
- `reverb` (WebSocket server)

---

## 4. CI/CD & Git Branching Strategy (Strict Separation)
Manual deployments are strictly prohibited. **Development and Production environments MUST remain completely isolated via Git branches.**

### 4.1. Git Branching Hierarchy
- **`develop` Branch (Active Development):**
  - All ongoing sprint work, feature additions, bug fixes, and development pushes MUST be committed directly to `develop` or feature branches merged into `develop`.
  - **🚫 Absolute Rule:** Never push untested or experimental development code directly to `main`.
- **`main` Branch (Production / Final Release Only):**
  - Represents stable, tested, release-ready software.
  - Code is promoted to `main` ONLY via thoroughly reviewed Pull Requests (PRs) from `develop` after QA passes all automated test suites.
  - Pushing to `main` automatically triggers the production CI/CD deployment pipeline.

### 4.2. The GitHub Actions Workflow
When a developer pushes code to the `main` branch, the pipeline triggers:

1. **Test Phase:** 
   - Spins up a temporary PostgreSQL & Redis instance.
   - Runs `php artisan test` (Executes QA Test Cases).
   - If any test fails, the deployment is aborted, and a Slack/Email alert is sent.
2. **Build Phase:**
   - Runs `npm install` and `npm run build` for the React frontend.
   - Runs `composer install --no-dev --optimize-autoloader`.
3. **Deploy Phase (Zero Downtime):**
   - Uses Laravel Envoyer (or similar script like Deployer) to pull the new code to a new folder on the server.
   - Swaps the symlink to the new folder.
   - Restarts PHP-FPM and Horizon (`php artisan horizon:terminate`).
   - Clears caches (`php artisan optimize:clear`).

---

## 5. Monitoring & Alerting
- **Server Health:** Tools like New Relic, Datadog, or Grafana must be installed to monitor CPU, RAM, and Disk IOPS.
- **Queue Health:** Laravel Horizon dashboard must be actively monitored. If the "Max Wait Time" for a queue exceeds 60 seconds, an alert must trigger.
- **Error Tracking:** `Sentry` or `Flare` integrated into Laravel/React to catch and log exceptions in real-time.
