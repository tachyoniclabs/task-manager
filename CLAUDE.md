# Task Manager

Node.js/Express REST API for task management.

## Stack
- Express, better-sqlite3, Jest + Supertest

## Commands
- `npm test` — run all tests
- `npm start` — start server on PORT from .env
- `npm run format` — run Prettier

## Structure
- routes/ → services/ → repositories/ (strict layering)
- Soft delete via deleted_at column
- SQLite database at path specified in DB_PATH env var
