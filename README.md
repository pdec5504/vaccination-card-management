# Vaccination Card Management

A small full-stack application that manages users' vaccination cards. It includes a Node.js + Express backend (with MongoDB via Mongoose) and a React frontend powered by Vite. The backend contains tests (Jest + Supertest and Selenium for UI) and uses dotenv for configuration.

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

## Functional Requirements (FR)

These are the requirements that define the actions the system must perform.

### FR01: Vaccine Management (Vaccine Types)

- FR01.1: Register Vaccine:

Description: The system must allow the registration of a new vaccine type.

Input: Vaccine Name (e.g., "Hepatitis B"), Unique Identifier (e.g., "HEP-B").

Output: Registration confirmation or error message (e.g., if the ID already exists).

- FR01.2: Get Vaccines:

Description: Although not explicitly requested, to register a vaccination (FR03.1), we need to know which vaccines exist. The system must allow listing all registered vaccines.

Input: (None)

Output: List of vaccines (ID and Name).

### FR02: Person Management

- FR02.1: Register User:

Description: The system must allow the registration of a new user.

Input: Name (e.g., "Maria Silva"), Unique Identification Number (e.g., a national ID or a generated ID).

Output: Registration confirmation or error message (e.g., if the ID already exists).

- FR02.2: Remove User:

Description: The system must allow the removal of a registered user.

Input: The User's Unique Identifier.

Output: Removal confirmation.

- FR02.3 (Business Rule): Cascade Deletion:

Description: When executing FR02.2 (Remove Person), the system must automatically delete their entire vaccination card and all vaccination records associated with that person.

### FR03: Vaccination Card Management (Records)

- FR03.1: Register Vaccination Record:

Description: The system must allow recording that a person has received a vaccine.

Input: User ID, Vaccine ID, Dose Applied, Date of Application.

Output: Registration confirmation.

- FR03.2 (Business Rule): Dose Validation:

Description: When executing FR03.1, the "Dose Applied" field must be validated by the system.

- FR03.3: Get Vaccination Card:

Description: The system must allow querying all vaccination records for a specific user.

Input: User ID.

Output: A list containing the details of each vaccination (Vaccine Name, Date of Application, Dose Received).

- FR03.4: Delete Vaccination Record:

Description: The system must allow the deletion of a specific vaccination record from a user's card.

Input: User ID and the Vaccination Record ID (we need a unique ID for each vaccination event).

Output: Deletion confirmation.

## Non-Functional Requirements (NFR)

These are the requirements that define the technical qualities and constraints of the system.

- NFR01: Communication Format: All communication between the client and the API must be done using the JSON format.

- NFR02: Architecture: The API must follow REST principles.

- NFR03: Testability: The code should be covered by unit tests (Encouraged).

- NFR04: Security: The implementation of authentication on the API is a bonus (Optional).

- NFR05: Data Integrity: The system must ensure that Unique Identifiers for Person (FR02.1) and Vaccine (FR01.1) cannot be duplicated.

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

```cmd
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
- DevDependencies: `jest`, `supertest`, `nodemon`.

Running tests:

```cmd
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
