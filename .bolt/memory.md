# Project memory

## Product intent & audience

- MERN Employee Management System: full-stack web app for HR administration
- Audience: HR admins and employees; role-based access (admin vs employee)
- Core features: employee CRUD, search/filter/sort/pagination, dashboard with stats and department breakdown, self-profile for employees

## Brand personality & voice

- Professional, utility-focused internal tool
- Clear status feedback (toast notifications, loading/empty/error states)
- README written for developers: installation, API docs, testing, deployment

## Visual design & UX direction

- Vite + React frontend; build output `dist/` (~290KB JS, ~28KB CSS, 1,669 modules)
- Responsive sidebar navigation layout
- Dashboard surface: statistics cards, department breakdown, recent additions
- Confirmation dialogs for destructive actions
- Loading, empty, and error states throughout
- Toast notifications for user feedback

## Decisions, constraints & rationale

- Tech stack: MongoDB, Express, React (Vite), Node.js
- Auth: JWT with bcrypt password hashing; role-based access control (admin/employee)
- Backend architecture: modular — routes, controllers, services, models, middleware, validators
- Security middleware: Helmet, CORS, rate limiting, input validation, centralized error handling
- Testing: Jest/supertest-style; 30 tests across 3 suites (Auth 10, Employee 18, Health 2)
- Deployment: Vercel for frontend, Render for backend
- Environment config: `.env.example` files provided for both frontend and backend

## Open questions & assumptions

- No explicit `.bolt/prompt` instructions; current decisions inferred from implementation
- Assumption: MongoDB Atlas or similar hosted instance for production
- Assumption: frontend and backend deployed as separate services with CORS configured between them
- Image/avatar handling for employees not mentioned — may be a future enhancement
- No CI/CD pipeline details specified