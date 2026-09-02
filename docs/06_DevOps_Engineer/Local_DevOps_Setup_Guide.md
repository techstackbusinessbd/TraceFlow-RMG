# Local DevOps Setup Guide (Docker)
**Role:** DevOps Engineer / Developer
**Project:** RMG Traceability Software

---

## 1. Prerequisites
To run this project locally, you do **NOT** need PHP, Composer, PostgreSQL, or Redis installed on your local machine. You only need:
1. [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.
2. WSL2 installed (if using Windows).
3. Git installed.

---

## 2. First-Time Setup Instructions

Follow these exact steps to run the RMG Traceability Software on your machine for the very first time.

### Step 2.1. Clone the Repository
```bash
git clone https://github.com/techstackbusinessbd/rmg-tracking.git
cd rmg-tracking/backend
```

### Step 2.2. Install Initial Composer Dependencies
Since you don't have PHP installed, use this Docker container to install the initial vendor folder:
```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```

### Step 2.3. Setup Environment Variables
Copy the example file to `.env`:
```bash
cp .env.example .env
```
*(Note: The default `.env` is configured for PostgreSQL (`pgsql`) and Redis.)*

### Step 2.4. Start Laravel Sail (Docker Containers)
Boot up the Docker containers (Laravel, PostgreSQL, Redis):
```bash
./vendor/bin/sail up -d
```

### Step 2.5. Generate App Key & Run Migrations
Run these commands inside the Sail container:
```bash
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
```

---

## 3. Daily Developer Workflow

You do not need to repeat the setup. Every day, just run:

- **Start Project:** `./vendor/bin/sail up -d`
- **Stop Project:** `./vendor/bin/sail down`
- **Run Artisan Commands:** `./vendor/bin/sail artisan <command>`
- **Run Tests:** `./vendor/bin/sail artisan test`
- **Tinker (Database CLI):** `./vendor/bin/sail tinker`

> **Pro Tip:** Set up an alias in your bash/zsh profile: `alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'` so you can just type `sail up -d`.
