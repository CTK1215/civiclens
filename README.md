# CivicLens

A full-stack app for reporting and tracking local community issues: potholes, broken streetlights, graffiti, unsafe intersections, abandoned property.

Built in stages during the Codecademy Full-Stack Developer bootcamp (cohort FS-26). Each phase adds a layer to the same app.

## Stack

| Layer | Tools |
|---|---|
| API | Node, Express 5, cors, dotenv |
| Database | PostgreSQL + Sequelize (Phase 2) |
| Auth | bcrypt + JSON Web Tokens (Phase 3) |
| Front end | React 19 + Vite (Phase 4) |
| Deployment | Docker on AWS (Phase 5) |
| CI/CD | GitHub Actions (Phase 6) |

## Project structure

```text
civiclens/
├── backend/
│   ├── src/
│   │   ├── config/        database connection (Phase 2)
│   │   ├── controllers/   request handlers
│   │   ├── middleware/    validation, auth checks
│   │   ├── models/        Sequelize models (Phase 2)
│   │   ├── routes/        URL to controller wiring
│   │   └── app.js         builds the Express app
│   ├── server.js          starts the server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/      API calls
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

`app.js` builds the app and `server.js` only starts it, so tests can load the app without opening a port.

## Running locally

API (http://127.0.0.1:5000):

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Front end (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

In development, Vite forwards any request to `/api/...` to the API with `/api` removed, so `fetch('/api/issues')` reaches `GET /issues`.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/issues` | All issues, optional `?category=` and `?status=` filters |
| GET | `/issues/:id` | One issue |
| POST | `/issues` | Create an issue (title and description required) |
| PUT | `/issues/:id` | Update an issue |
| DELETE | `/issues/:id` | Delete an issue |

## Progress

- [x] Phase 1: Express routes with in-memory data
- [x] Phase 2: PostgreSQL + Sequelize
- [ ] Phase 3: Authentication and protected routes
- [ ] Phase 4: React front end
- [ ] Phase 5: Docker deployment to AWS
- [ ] Phase 6: CI/CD with GitHub Actions
