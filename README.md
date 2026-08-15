# Goal Forge

Goal Forge is a full-stack goal management application built with **Next.js, TypeScript, Prisma, PostgreSQL, and Supabase**.

The application allows users to create goals, break them down into checkpoints, track their progress automatically, and manage completed goals through a clean and responsive interface.

The project was developed as a full-stack portfolio application, covering frontend development, REST API design, database modeling, persistence, validation, and deployment-ready architecture.

---

## Features

* Create new goals
* Edit existing goals
* Delete goals
* Add checkpoints to each goal
* Edit checkpoints
* Delete checkpoints
* Mark checkpoints as completed or incomplete
* Automatically calculate goal progress
* Display progress bars for each goal
* View active goals
* View completed goals separately
* Automatically move goals between active and completed states
* Dashboard with goal statistics
* Persistent PostgreSQL database
* REST API built with Next.js Route Handlers
* Responsive interface for desktop, tablet, and mobile
* Form validation and error handling
* Accessible UI elements
* Confirmation before destructive actions

---

## Goal Progress

Goal progress is automatically calculated based on completed checkpoints.

The formula used is:

```text
Completed Checkpoints
--------------------- × 100
Total Checkpoints
```

For example:

```text
4 checkpoints
2 completed

2 / 4 × 100 = 50%
```

If a goal does not have any checkpoints yet, its progress is:

```text
0%
```

A goal is considered completed when:

```text
progress === 100
```

If a completed checkpoint is later unchecked, the goal automatically returns to the active goals list.

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Route Handlers
* REST API
* Prisma ORM

### Database

* PostgreSQL
* Supabase

### Development

* ESLint
* Prisma CLI
* npm

---

## Architecture

The application follows a simple full-stack architecture:

```text
Client
  │
  ▼
Next.js / React
  │
  ▼
Next.js Route Handlers
  │
  ▼
Prisma ORM
  │
  ▼
PostgreSQL
  │
  ▼
Supabase
```

The frontend never connects directly to PostgreSQL.

All database operations are performed on the server through Prisma.

---

## Database Models

The application uses two main database models.

### Goal

Represents a goal created by the user.

Main fields:

```text
id
title
description
dueDate
progress
createdAt
updatedAt
```

A goal can contain multiple checkpoints.

### Checkpoint

Represents an individual task required to complete a goal.

Main fields:

```text
id
title
completed
goalId
createdAt
updatedAt
```

Each checkpoint belongs to one goal.

Relationship:

```text
Goal
 │
 │ 1
 │
 │ N
 ▼
Checkpoint
```

When a goal is deleted, its checkpoints are also deleted.

---

## API

The project uses REST endpoints implemented with Next.js Route Handlers.

### Goals

#### Get goals

```http
GET /api/goals
```

Goals can also be filtered by status.

```http
GET /api/goals?status=active
```

Returns goals with progress below 100%.

```http
GET /api/goals?status=completed
```

Returns goals with 100% progress.

```http
GET /api/goals?status=all
```

Returns all goals.

---

#### Create a goal

```http
POST /api/goals
```

Example request:

```json
{
  "title": "Build my portfolio",
  "description": "Create and publish my personal developer portfolio",
  "dueDate": "2026-12-31"
}
```

---

#### Get a specific goal

```http
GET /api/goals/:id
```

---

#### Update a goal

```http
PATCH /api/goals/:id
```

---

#### Delete a goal

```http
DELETE /api/goals/:id
```

Deleting a goal also removes its associated checkpoints.

---

## Checkpoints API

### Add a checkpoint

```http
POST /api/goals/:id/checkpoints
```

Example:

```json
{
  "title": "Create the homepage"
}
```

---

### Update a checkpoint

```http
PATCH /api/checkpoints/:id
```

Example:

```json
{
  "completed": true
}
```

A checkpoint can also be edited.

Whenever its completion state changes, the related goal progress is recalculated automatically.

---

### Delete a checkpoint

```http
DELETE /api/checkpoints/:id
```

After deletion, the related goal progress is recalculated.

---

## Main Routes

### Dashboard

```text
/
```

Displays:

* total goals
* active goals
* completed goals
* goal cards
* progress information
* new goal action

---

### Goal Details

```text
/metas/[id]
```

Displays the selected goal and its checkpoints.

From this page, users can:

* edit the goal
* delete the goal
* add checkpoints
* edit checkpoints
* delete checkpoints
* complete checkpoints
* reopen checkpoints

---

### Completed Goals

```text
/metas-anteriores
```

Displays goals with:

```text
progress === 100
```

Completed goals can still be opened and modified.

If a checkpoint is unchecked, the goal automatically returns to the active goals list.

---

## Getting Started

### Prerequisites

Before running the application, make sure you have:

* Node.js installed
* npm installed
* a Supabase account
* a PostgreSQL database created in Supabase

---

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Open the project directory:

```bash
cd Goal-Forge
```

Install the dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

You can use `.env.example` as reference.

```env
DATABASE_URL=""
DIRECT_URL=""
```

Never commit your real `.env` file.

### DATABASE_URL

Used by the application at runtime through the Supabase transaction pooler.

Example structure:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres"
```

### DIRECT_URL

Used by Prisma for migrations through a direct or session connection.

Example structure:

```env
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
```

Both connection strings can be obtained from the Supabase project dashboard.

---

## Prisma Setup

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

For a completely new database, the existing migrations will create the required tables.

The main tables are:

```text
Goal
Checkpoint
_prisma_migrations
```

---

## Running Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Prisma Studio

You can inspect and manage development data using Prisma Studio:

```bash
npx prisma studio
```

This provides a visual interface for the PostgreSQL data managed by Prisma.

---

## Project Structure

The project is organized approximately as follows:

```text
Goal-Forge/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── goals/
│   │   │   └── checkpoints/
│   │   │
│   │   ├── metas/
│   │   │   └── [id]/
│   │   │
│   │   ├── metas-anteriores/
│   │   │
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalProgress.tsx
│   │   ├── GoalStats.tsx
│   │   └── CheckpointItem.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── goal-progress.ts
│   │
│   └── types/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The exact structure may vary slightly as the project evolves.

---

## Database Connection Strategy

Goal Forge uses two PostgreSQL connection strings for different purposes.

```text
Application Runtime
        │
        ▼
DATABASE_URL
        │
        ▼
Supabase Transaction Pooler
Port 6543
```

For Prisma migrations:

```text
Prisma CLI
    │
    ▼
DIRECT_URL
    │
    ▼
Supabase Session / Direct Connection
Port 5432
```

This allows the application to use connection pooling while Prisma migrations use an appropriate database connection.

---

## Data Persistence

All goals and checkpoints are persisted in PostgreSQL.

This means application state is not limited to the browser.

For example:

```text
Create Goal
    ↓
POST /api/goals
    ↓
Prisma
    ↓
PostgreSQL
```

When the page is refreshed, the information is loaded again from the database.

The database remains the source of truth.

---

## Validation

The application validates important inputs before storing data.

Examples include:

* a goal must have a title
* a checkpoint must have a title
* invalid requests return appropriate HTTP responses
* database errors are handled without exposing sensitive information

The frontend also provides user-friendly validation and feedback.

---

## Error Handling

The API uses appropriate HTTP status codes such as:

```text
200 — Success
201 — Created
400 — Invalid request
404 — Resource not found
500 — Internal server error
```

Internal database errors and sensitive information are not exposed to the client.

---

## Security

The project follows several basic security practices:

* database passwords are stored only in environment variables
* `.env` files are ignored by Git
* real credentials are never stored in `.env.example`
* Prisma runs only on the server
* database connection strings are never exposed to the frontend
* API responses do not include database credentials
* destructive actions require confirmation
* sensitive server errors are not displayed directly to users

---

## Code Quality

Before deploying the project, run:

```bash
npm run lint
```

Then verify the production build:

```bash
npm run build
```

The project should compile successfully without TypeScript or build errors before deployment.

---

## Deployment

The application is designed to be deployed on **Vercel**.

### 1. Push the project to GitHub

Create a GitHub repository and push the project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Before pushing, make sure `.env` is ignored and no credentials are included in the repository.

---

### 2. Import the repository into Vercel

In Vercel:

1. Create a new project.
2. Import the Goal Forge GitHub repository.
3. Allow Vercel to detect the Next.js configuration.
4. Add the required environment variables.

Required variables:

```env
DATABASE_URL="..."
DIRECT_URL="..."
```

Use the production Supabase connection strings.

---

### 3. Deploy

Start the deployment from the Vercel dashboard.

Vercel will install the dependencies and create a production build.

After deployment, the project will receive a public URL similar to:

```text
https://goal-forge.vercel.app
```

The actual URL may vary depending on project availability and Vercel configuration.

---

## Production Database Migrations

Database migrations should be handled carefully in production.

The migration history is stored inside:

```text
prisma/migrations/
```

Do not manually edit migrations that have already been applied.

For production environments, Prisma migrations can be applied with:

```bash
npx prisma migrate deploy
```

This applies existing migrations without generating development migrations.

---

## Possible Future Improvements

Some features that could be added in future versions include:

* authentication
* user accounts
* private goals
* goal categories
* tags
* priority levels
* notifications
* recurring goals
* drag-and-drop checkpoint ordering
* goal history
* analytics dashboard
* charts and productivity statistics
* dark mode
* internationalization
* automated tests

---

## Project Purpose

Goal Forge was created as a full-stack portfolio project focused on demonstrating:

* modern React development
* Next.js full-stack architecture
* TypeScript
* API development
* relational database modeling
* Prisma ORM
* PostgreSQL
* Supabase integration
* responsive UI development
* data persistence
* validation
* error handling
* production-ready project organization

---

## Author

**Saulo Valin**

Full-Stack Developer focused on modern web applications using technologies such as React, Next.js, TypeScript, Node.js, PHP, PostgreSQL, and cloud services.

---