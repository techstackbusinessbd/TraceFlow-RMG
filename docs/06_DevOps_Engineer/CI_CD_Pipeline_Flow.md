# CI/CD Pipeline Flow
**Role:** DevOps Engineer
**Status:** Approved

## 1. GitHub Actions Pipeline
Every push to the `main` or `staging` branch must trigger the following pipeline:
1. **Linting:** Run PHP_CodeSniffer / ESLint.
2. **Unit Tests:** Run `php artisan test`.
3. **Build:** Build Docker images.
4. **Deploy:** SSH into the target server, pull new images, run `php artisan migrate --force`, and restart queue workers.

## 2. Zero-Downtime Deployment
- Use Laravel Envoyer or Docker Swarm to ensure the system does not go offline during deployments (factory floor cannot stop).
