# FBC23 Mini Task Tracker

A task management application built for the FBC23 Developer Diagnostic Brief.

## Technology
- Frontend: Next.js, React and TypeScript
- Backend: Node.js, Express.js and TypeScript
- Database: SQLite (`better-sqlite3`)
- Validation: Zod
- Testing: Cypress

## Features
- Create, view, edit, complete and delete tasks
- Filter tasks by status
- Store tasks in a SQL database
- Validate incoming API data
- Return useful error messages

## Project structure
```text
fbc23-diag-lerato/
├── api/                            Express API (port 5000)
│   ├── database/
│   │   ├── .gitkeep                keeps the empty folder in Git
│   │   └── tasks.db                SQLite database, created on first start (git-ignored)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts         opens SQLite, creates the table
│   │   ├── controllers/
│   │   │   └── taskController.ts   parse id, validate, pick status code
│   │   ├── middleware/
│   │   │   └── errorHandler.ts     turns unexpected errors into JSON
│   │   ├── models/
│   │   │   └── taskModel.ts        the only file with SQL
│   │   ├── routes/
│   │   │   └── taskRoutes.ts       URL + method to controller function
│   │   ├── services/
│   │   │   └── taskService.ts      business rules (currently pass-through)
│   │   ├── types/
│   │   │   └── task.ts             Zod schemas + Task, TaskInput types
│   │   └── server.ts               entry point: config, middleware, routes, listen
│   ├── swagger/
│   │   └── swagger.ts              Swagger setup for /api-docs
│   ├── .env.example                PORT, FRONTEND_URL
│   ├── .gitignore                  API files Git must not track
│   ├── package.json                API scripts and dependencies
│   ├── pnpm-lock.yaml              exact dependency versions
│   ├── pnpm-workspace.yaml         pnpm settings
│   └── tsconfig.json               TypeScript settings
├── docs/                           project documents
│   ├── communication-diagram.png   how the parts communicate
│   ├── technical-document.docx     technical document (Word)
│   └── technical-document.html     technical document (web page)
├── web/                            Next.js front end (port 3000)
│   ├── app/
│   │   ├── globals.css             styles and the 640px breakpoint
│   │   ├── layout.tsx              HTML shell, metadata, global CSS
│   │   └── page.tsx                the whole UI (client component)
│   ├── cypress/
│   │   └── e2e/
│   │       └── tasks.cy.ts         end-to-end tests
│   ├── .env.local.example          NEXT_PUBLIC_API_URL
│   ├── .gitignore                  web files Git must not track
│   ├── cypress.config.ts           Cypress base URL and test folder
│   ├── next-env.d.ts               Next.js types (generated)
│   ├── next.config.ts              Next.js settings
│   ├── package.json                web scripts and dependencies
│   ├── pnpm-lock.yaml              exact dependency versions
│   ├── pnpm-workspace.yaml         pnpm settings
│   └── tsconfig.json               TypeScript settings
├── .gitignore                      files Git must not track
└── README.md                       how to install, run and test
```

## Requirements
Install Node.js (LTS) and pnpm.

## 1. Start the backend
Open a terminal:
```powershell
cd api
pnpm install
Copy-Item .env.example .env
pnpm dev
```
- pnpm dev – Use while developing your backend.
- pnpm build – Use to compile your backend before deployment.
- pnpm start – Use to run the compiled backend.
- pnpm typecheck – Use to check your code for TypeScript errors.

The API runs at `http://localhost:5000`.
The SQLite database is created automatically at `api/database/tasks.db`.

## 2. Start the frontend
Open a second terminal:
```powershell
cd web
pnpm install
Copy-Item .env.local.example .env.local
pnpm dev
```
Open `http://localhost:3000`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks; optional `?status=Pending` or `?status=Completed` |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/complete` | Mark a task completed |
| DELETE | `/api/tasks/:id` | Delete a task |

Example task:
```json
{
  "title": "Prepare diagnostic walkthrough",
  "description": "Explain the application architecture",
  "dueDate": "2026-11-20",
  "status": "Pending"
}
```

## API documentation (Swagger)
Start the backend, then open `http://localhost:5000/api-docs`.

- Click an endpoint, then **Try it out** and **Execute**, to send a real request. This changes the real tasks.
- The raw OpenAPI document is at `http://localhost:5000/api-docs.json` and can be imported into Postman.
- Endpoints are described by the `@swagger` comments in `api/src/routes/taskRoutes.ts` and `api/src/server.ts`. Shared settings are in `api/swagger/swagger.ts`.

## Run frontend tests
Start the frontend and backend first, then from `web`:
```powershell
pnpm cypress:open
```
Or run headlessly:
```powershell
pnpm cypress:run
```
## Create and Test Tasks Using PowerShell

You can test your backend API directly from PowerShell without installing Postman.

### 1. Start the Backend

Open PowerShell and navigate to the `api` folder:

```powershell
cd api
pnpm dev
```
Keep this terminal running.

## 2. Create a Task (POST Request)

Open a second PowerShell terminal. You can run this command from your project folder or any other folder.

```powershell
$body = @{
    title = "Build QA User Interface"
    description = "Improve the Next.js frontend and create reusable React components."
    dueDate = "2026-11-22"
    status = "Pending"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/tasks" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```
This sends a POST request to the Express API to create a new task.

### 3. View All Tasks (GET Request)

Run the following command to retrieve all tasks through the API:

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:5000/api/tasks" `
    -Method GET
```
### 4. Check Whether the SQLite Database Exists

Navigate to the backend folder:

```powershell
cd api
```
Run:

```powershell
Test-Path ".\database\tasks.db"
```
If the result is `True`, the database file exists.

### 5. View Records Stored in SQLite

Run this command from the `api` folder:

```powershell
node -e "const Database = require('better-sqlite3'); const db = new Database('./database/tasks.db'); console.table(db.prepare('SELECT * FROM tasks').all()); db.close();"
```

This command:
- Opens the SQLite database.
- Retrieves all records from the `tasks` table.
- Displays the records in a table in PowerShell.
- Closes the database connection.

### 6. Expected Database Output

Your output should look similar to this:

| id | title | status |
|---|---|---|
| 1 | Complete Salesforce Development Training | Pending |
| 2 | Build Frontend User Interface | Pending |

The actual output also includes descriptions, due dates and timestamps.

### Important Notes

- PowerShell sends HTTP requests to the Express backend.
- Express processes requests and communicates with SQLite.
- SQLite stores task records in `api/database/tasks.db`.
- The frontend retrieves tasks through the backend API.
- You do not need to open or modify the database file manually to create tasks.
- If port `5000` is already in use, your backend may already be running. Use the existing server instead of starting another one.

## Database choice
SQLite is a SQL database that stores the data in a local file. It does not require a separate database server, which makes it straightforward to set up for this small diagnostic application. It supports SQL tables, queries and constraints. For a larger multi-user production system with many simultaneous writes, PostgreSQL or another server database may be a better fit.

## Scope decisions
This implementation does not include sign-in because the brief lists it under “Should have (as time allows)”. Tasks are not separated by user accounts. Sorting, search and deployment are also left out so the required task-management features can be completed first.
### Create a new file from that path
New-Item -ItemType Directory -Force -Path "src/controllers", "src/middleware"

## Swagger
- http://localhost:5000/api-docs 
