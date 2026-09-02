# DevOps Deployment Strategy
**Role:** DevOps Engineer
**Status:** Approved

## 1. Server Architecture
- **Web Server:** Nginx (Reverse Proxy).
- **App Server:** PHP 8.3-FPM (Laravel 13).
- **Database:** PostgreSQL 17 (Primary and Streaming Replica for high availability).
- **Cache & Queue:** Redis 7 (Mandatory for Analytics, Horizon, and QR batch queues).

## 2. Docker Containerization
- The entire stack must be Dockerized using `docker-compose`.
- Separate containers for: Nginx, PHP, Postgres, Redis, Horizon (Queue workers).

## 3. Environments
- `Staging`: For QA testing (Mirror of production).
- `Production`: Live factory server.
