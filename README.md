# Task Manager API

A simple REST API for managing tasks, built with Express and SQLite.

## Quick Start

```bash
npm install
npm start
```

## API Endpoints

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/tasks        | List tasks (paginated)   |
| GET    | /api/tasks/stats  | Task counts by status    |
| GET    | /api/tasks/:id    | Get a task               |
| POST   | /api/tasks        | Create a task            |
| PUT    | /api/tasks/:id    | Update a task            |
| DELETE | /api/tasks/:id    | Delete a task            |

## Testing

```bash
npm test
```
