# Vaccination Card Management

A small full-stack application that manages users' vaccination cards. It includes a Node.js + Express backend (with MongoDB via Mongoose) and a React frontend powered by Vite. The backend contains tests (Jest + Supertest) and uses dotenv for configuration.

## Table of contents

- Project overview
- Architecture
- Requirements
- Quick start
  - Docker (recommended)
  - Run locally (backend + frontend)
- Configuration (.env)
- Backend (scripts & tests)
- Frontend (scripts)
- API (high level)
- Contributing
- Troubleshooting
- License

## Project overview

This repository contains two main folders:

- `backend/` — Express API server, MongoDB models, and tests.
- `frontend/` — React application built with Vite. UI components are under `frontend/src/components` and pages under `frontend/src/pages`.

The app allows creating users, defining vaccines, and recording vaccinations. It's intended as a coding challenge / demo implementation.

## Architecture

- Backend: Node (Express) + Mongoose. Entry point: `backend/src/server.js`.
- Database: MongoDB.
- Frontend: React (Vite) with components and pages for user and vaccination management.

## Requirements

- Node.js (v22.14.0)
- npm
- Docker & Docker Compose

## Quick start

Start the application with Docker Compose, then run both development servers for backend and frontend.

```powershell
cd backend
docker-compose up -d

# in a new terminal (backend dev)
cd backend
npm run dev

# in another terminal (frontend dev)
cd frontend
npm run dev
```

This sequence starts MongoDB and the backend service via Docker Compose in detached mode, then launches the backend in development mode (`nodemon`) and the frontend Vite dev server. The frontend expects the backend API to be available (default backend port `3000`) — update `frontend/src/services/api.js` if needed.

## Configuration (.env)

The backend uses environment variables via `dotenv`. An example file is `backend/.env.example`:

```bash
PORT=3000
DB_USER=admin
DB_PASS=admin_password
DB_HOST=localhost
DB_PORT=27017
DB_NAME=vaccinationdb
DB_NAME_TEST=vaccinationdb_test
MONGO_URI=mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin
```

Create a `backend/.env` file (copy `.env.example`) and adjust values for your environment. If you use a local Mongo instance without auth, you can set `MONGO_URI=mongodb://localhost:27017/vaccinationdb`.

## Backend (tests & tips)

- Dependencies: `express`, `mongoose`, `dotenv`, `cors`, `uuid`.
- DevDependencies: `jest`, `supertest`, `mongodb-memory-server`, `nodemon`.

Running tests:

```powershell
cd backend
npm test
```

## Frontend

Scripts (see `frontend/package.json`):

- `npm run dev` — start Vite dev server.

The frontend is a standard Vite + React setup. Change API base URL in `frontend/src/services/api.js` when necessary.

## API (high level)

The backend exposes endpoints to manage users, vaccines and vaccinations. The exact routes are defined in `backend/src/modules/*`.

Common endpoints (example):

- POST /users — create a new user
- GET /users/:id — get user details and vaccinations
- PUT /users/:id — update an existing user's data
- DELETE /users/:id — delete a user and their related records
- POST /vaccines — add a vaccine type
- PUT /vaccines/:id — update an existing vaccine record
- DELETE /vaccines/:id — delete a vaccine
- POST /vaccinations — record a vaccination
- GET /vaccinations — list vaccinations

Use the frontend, Postman, or curl.

## Troubleshooting

- Frontend can't reach backend: check backend is running and confirm the API base URL in `frontend/src/services/api.js`.
- MongoDB Docker errors: try removing `backend/mongo-data` if the data directory is corrupt or run with a fresh volume.
- Jest tests failing: ensure no existing MongoDB instance is blocking test ports; tests use in-memory MongoDB and should not require external DB.
