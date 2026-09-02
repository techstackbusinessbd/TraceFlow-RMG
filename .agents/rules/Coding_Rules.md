# Strict Agent Coding Rules for RMG Traceability Software
These are mandatory instructions for you (the AI Agent). You MUST read and follow these rules unconditionally whenever writing code for this project.

## 1. Architectural Rules
- **Domain-Driven Design (DDD):** You MUST NOT use standard Laravel MVC folders (e.g., `app/Models`, `app/Http/Controllers`). All business logic must be placed inside `app/Domains/` structured by module (e.g., `app/Domains/PurchaseOrder/Models`).
- **Repository Pattern:** You MUST NOT write Eloquent queries directly inside Controllers. All DB operations must go through Repository classes.

## 2. Frontend Rules
- **Custom React Admin Panel:** You MUST NOT use Laravel Filament, Nova, or any third-party PHP admin panel generators. The admin panel must be built using React (Vite) and TailwindCSS.
- **No Hardcoding (UI/UX):** You MUST NOT hardcode Tailwind hex colors (e.g., `text-[#1a2b3c]`) or arbitrary spacing (e.g., `p-[20px]`). You must use predefined classes from `tailwind.config.js` (e.g., `bg-primary`, `p-5`).
- **Standard UI Libraries:** You MUST use `@tanstack/react-table` for data tables and `react-hot-toast` for notifications. Do not invent custom table logic from scratch unless required.

## 3. Database & Performance Rules
- **Eager Loading:** You MUST prevent N+1 query problems. Always use `with()` when loading relationships in Repositories.
- **Caching:** You MUST cache static configurations (like `system_settings`) in Redis using `Cache::rememberForever()`.
- **Queues:** You MUST push heavy operations (e.g., saving 1000 bulk scans from the factory floor) to Laravel Horizon queues. Do not execute them synchronously.

## 4. Security Rules
- **Role-Based Access:** You MUST protect API endpoints using Spatie Middleware.
- **UI Protection:** You MUST wrap sensitive React buttons in the `<HasPermission>` component.

**FAILURE TO FOLLOW THESE RULES WILL RESULT IN ARCHITECTURAL DEBT.**
