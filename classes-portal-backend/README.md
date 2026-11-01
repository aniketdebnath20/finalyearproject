# Classes Portal API

This Express API stores records in MongoDB. It starts with empty academic collections and does not create sample/demo records.

## Setup

1. Install Node.js 20 or newer and run MongoDB locally, or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. Run `npm install` and `npm run dev` from this directory.
4. Run `npm run dev` from `D:\finalyearproject` for the frontend. Vite proxies `/api` requests to this server on port 5000.

The first administrator account is created from the environment values only when no matching administrator exists. The API never seeds demo academic data.

## API

- `GET /api/health` reports API and MongoDB connection state.
- `POST /api/auth/login` signs in a student, staff member, or administrator and returns an expiring bearer token.
- `GET /api/data` returns records permitted for the authenticated role.
- `GET /api/students/:id/record` returns the student profile and linked attendance, exams, results, certificates, and fee records.
- `/api/:resource` provides authenticated read/create/update/delete routes for departments, courses, subjects, students, staff, studentAttendance, staffAttendance, fees, results, exams, certificates, and notifications.

Students sign in with their registered full name and roll number. Faculty sign in with their registered full name and staff ID. Administrators sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
