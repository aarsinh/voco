# Voco (Volunteer Connect)

Voco is a unified workspace connecting NGOs and volunteers, built to make it easier for organizations to plan and run community projects, and for volunteers to discover and take part in causes they care about.

Instead of NGOs and volunteers coordinating through scattered emails, spreadsheets, and phone calls, Voco brings project creation, volunteer sign-ups, progress tracking, and feedback into one place.

## Features

**For NGOs**
- Create, manage, and mark projects as complete
- Automatic email notifications to volunteers whose interests match a new project
- View and manage the list of volunteers registered for each project
- Track volunteer completion status per project, and flag/report volunteers when needed
- Analytics dashboard: project status breakdown, registrations per project, interest-tag distribution, and top projects — all visualized with charts
- Collect and view ratings/reviews left on completed projects
- Editable organization profile (name, contact info, website)

**For Volunteers**
- Sign up and log in with a dedicated volunteer account
- Set interest preferences (Education, Environment, Healthcare, Elderly Care, Animal Welfare) to get matched with relevant projects
- Register for projects and track progress (ongoing/completed)
- Receive email alerts when a new project matches their preferences

**Shared**
- Secure authentication with hashed passwords and JWT-based sessions stored in HTTP-only cookies
- Role-based routing and access control (NGO vs. volunteer views)

## Tech Stack

**Frontend:** React 19, TypeScript, React Router, Tailwind CSS, Recharts, Axios, Vite

**Backend:** Node.js, Express 5, TypeScript, MongoDB with Mongoose, JWT & bcrypt for auth, Nodemailer for email notifications

## Project Structure

```
voco/
├── backend/
│   └── src/
│       ├── app.ts              # Express app entry point
│       ├── config/db.ts        # MongoDB connection
│       ├── controllers/        # Auth, NGO, and volunteer route logic
│       ├── models/             # Mongoose schemas (NGO, Volunteer, Project)
│       ├── routes/             # API route definitions
│       └── services/           # Email notification service
└── frontend/
    └── src/
        ├── components/
        │   ├── ngo/             # NGO dashboard, project management, profile
        │   └── volunteer/       # Volunteer-facing views
        ├── contexts/            # Auth & UI context providers
        ├── hooks/                # Custom hooks (auth, preferences modal)
        └── Login.tsx / Signup.tsx
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or a hosted service like MongoDB Atlas)
- A Gmail account (or other SMTP provider) for sending notification emails

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
PORT=8082
DB_LINK=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

Run the backend in development mode:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` by default, and will talk to the backend API running on the port set above.

## API Overview

| Base path       | Purpose                                      |
|-----------------|-----------------------------------------------|
| `/api/auth`     | Signup, login, token validation, logout       |
| `/api/ngo`      | Project CRUD, dashboards/analytics, profile   |
| `/api/volunteer`| Volunteer-facing project & profile endpoints  |

## Contributing

This is a personal/learning project. Issues and pull requests are welcome if you'd like to suggest improvements.
