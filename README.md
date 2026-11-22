# Employee Management System (MERN)

A complete, production-structured Employee Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features JWT authentication with role-based access control, full CRUD operations for employees, a professional HR dashboard with statistics, search, filtering, pagination, and responsive design.

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Axios, Context API
**Backend:** Node.js, Express.js, MongoDB, Mongoose ODM, JWT, bcrypt.js
**Testing:** Jest, Supertest, mongodb-memory-server

## Features

- User registration and login with JWT authentication
- Role-based access control (Admin & Employee roles)
- Password hashing with bcrypt
- Protected frontend and backend routes
- Persistent login after page refresh
- Employee CRUD (Create, Read, Update, Delete) with confirmation dialogs
- Dashboard with statistics (total, active, inactive, department breakdown)
- Search employees by name, email, or employee ID
- Filter by department and employment status
- Sortable columns
- Pagination
- Employee self-profile viewing and permitted field editing
- Loading states, empty states, error & success notifications
- Responsive sidebar navigation and professional SaaS-style UI
- Helmet security headers, CORS, rate limiting on auth routes
- Centralized error handling and input validation

## Project Structure

```
employee-management-system/
├── client (root)              # Frontend - React + Vite
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages (Login, Register, Dashboard, etc.)
│   │   ├── layouts/           # Layout wrappers (Auth, Dashboard)
│   │   ├── context/           # React Context (Auth, Toast)
│   │   ├── services/          # API service layer (Axios)
│   │   ├── utils/             # Helpers and constants
│   │   ├── App.jsx            # Router definition
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                    # Backend - Node + Express
│   ├── src/
│   │   ├── config/            # Environment & database config
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas (User, Employee)
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # Business logic layer
│   │   ├── validators/        # Express-validator rules
│   │   ├── utils/             # AppError, response helpers
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # Server entry point
│   ├── tests/                 # Jest + Supertest tests
│   └── package.json
├── .env.example
├── .gitignore
├── vercel.json                # Frontend deployment config
├── render.yaml                # Backend deployment config
└── README.md
```

## Prerequisites

- Node.js >= 18
- MongoDB (local installation or MongoDB Atlas account)

## Installation & Local Development

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd employee-management-system
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```
The server starts on `http://localhost:5000`.

### 3. Frontend setup
In a new terminal from the project root:
```bash
npm install
npm run dev
```
The frontend starts on `http://localhost:5173` and proxies API calls to the backend.

## Environment Variables

### Frontend (root `.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL (empty in dev for proxy) | `""` |

### Backend (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | a long random string |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `AUTH_RATE_LIMIT_MAX` | Max auth attempts per window | `5` |

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user (admin or employee) |
| POST | `/auth/login` | Public | Login and receive JWT token |
| GET | `/auth/me` | Authenticated | Get current user profile |

### Employees
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/employees` | Authenticated | List employees (search, filter, pagination) |
| GET | `/employees/:id` | Authenticated* | Get single employee |
| POST | `/employees` | Admin | Create new employee |
| PUT | `/employees/:id` | Admin / Own* | Update employee |
| DELETE | `/employees/:id` | Admin | Delete employee |
| GET | `/employees/stats/summary` | Authenticated | Dashboard statistics |
| GET | `/employees/me/profile` | Authenticated | Get own linked employee profile |
| PUT | `/employees/me/profile` | Authenticated | Update own profile (phone, image) |

*Employees can only access their own linked employee record.

### Query Parameters for GET /employees
- `search` — search by name, email, or employee ID
- `department` — filter by department
- `status` — filter by status (active, inactive, on-leave, terminated)
- `page` — page number (default: 1)
- `limit` — items per page (default: 8, max: 100)
- `sortBy` — sort field (name, email, salary, department, status, joiningDate, createdAt)
- `sortOrder` — sort direction (asc, desc)

## Testing

```bash
cd server
npm test
```

Tests use `mongodb-memory-server` (no external MongoDB needed) and cover:
- User registration, login, invalid credentials
- Protected route access (with/without token, invalid token)
- Admin authorization (employee cannot create/delete)
- Employee CRUD (create, read, update, delete)
- Search and filtering
- Input validation
- Dashboard statistics
- Employee self-profile

## Deployment

### Frontend (Vercel)
1. Push the repository to GitHub
2. Import the repo in Vercel
3. Set the root directory (leave as project root)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable: `VITE_API_URL` = your deployed backend URL
7. Deploy

### Backend (Render)
1. Push the repository to GitHub
2. Create a new Web Service in Render
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `node src/server.js`
6. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`
7. Deploy

### Database (MongoDB Atlas)
1. Create a free cluster at mongodb.com
2. Create a database user
3. Whitelist your IP (or `0.0.0.0/0` for testing)
4. Copy the connection string into `MONGODB_URI`

## Roles & Permissions

| Action | Admin | Employee |
|--------|-------|----------|
| View dashboard | Yes | Yes |
| View all employees | Yes | Yes |
| Create employee | Yes | No |
| Update any employee | Yes | No |
| Update own profile | Yes | Yes (limited fields) |
| Delete employee | Yes | No |
| View own profile | Yes | Yes |

## License

MIT
