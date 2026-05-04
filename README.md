# Academa LMS

A full-stack Learning Management System built with React (frontend) and Node.js/Express (backend), using PostgreSQL as the database.

---

## Tech Stack

- **Frontend:** React (runs on `localhost:3000`)
- **Backend:** Node.js + Express (runs on `localhost:5001`)
- **Database:** PostgreSQL
- **Real-time:** Socket.io
- **Auth:** JWT

---

## Prerequisites

- Node.js installed
- PostgreSQL installed (see setup below)

---

## Step 1 — Install PostgreSQL

1. Go to [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/) and click **Download the installer**
2. Download the latest version (**Windows x86-64**, top of the list)
3. Run the installer — click **Next** through everything
4. When prompted for a password, **set something simple** (e.g. `1234`) and remember it — you'll need it later
5. Continue clicking **Next** until **Finish**
6. At the end it may ask to launch Stack Builder — **uncheck it** and finish

---

## Step 2 — Set Up the Database in pgAdmin

1. Press **Windows key**, search **pgAdmin 4**, and open it
2. In the left panel, click the **`>`** arrow next to **Servers** to expand it
3. Right-click on **Databases → Create → Database**
4. Name the database exactly: `academa_lms` → click **Save**
5. Right-click on `academa_lms` → **Query Tool**
6. In the Query Tool toolbar, click the **open file** icon and upload the provided `academa_backup.sql` file
7. Click the **Execute / Run** button (or press `F5`)
8. Save when prompted

---

## Step 3 — Set Up the Backend

1. Open the `Archive_b` folder (backend) in VS Code
2. Create a new file named **`.env`** in the root of `Archive_b`
3. Paste the following into `.env`, replacing `YOUR_PASSWORD` with the PostgreSQL password you set:

```env
PORT=5001
NODE_ENV=development
DB_USER=postgres
DB_HOST=localhost
DB_NAME=academa_lms
DB_PASSWORD=YOUR_PASSWORD
DB_PORT=5432
JWT_SECRET=academa_super_secret_jwt_key_2024
JWT_REFRESH_SECRET=academa_refresh_secret_key_2024
JWT_EXPIRE=7d
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,zip,c,cpp,py,java
```

4. Open a terminal, navigate to the `Archive_b` folder, and run:

```bash
npm install
npm run dev
```

The backend will start at `http://localhost:5001`

---

## Step 4 — Set Up the Frontend

1. Open a **second terminal tab**
2. Navigate to the `Archive` folder (frontend) and run:

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## Step 5 — Test the App

Open `localhost:3000` in **two separate browser windows/tabs** and log in with:

| Role    | Email                              | Password    |
|---------|------------------------------------|-------------|
| Faculty | prof.cse1@academa.edu              | password123 |
| Student | mu24ucse001@mahindrauniversity.edu.in | password123 |

---

## API Endpoints (Backend)

| Endpoint             | Description            |
|----------------------|------------------------|
| `GET /health`        | Health check           |
| `GET /api`           | API root / docs        |
| `GET /api/test`      | Database connection test |
| `/api/auth`          | Authentication         |
| `/api/courses`       | Course management      |
| `/api/assignments`   | Assignments            |
| `/api/submissions`   | Submissions            |
| `/api/grades`        | Grades                 |
| `/api/materials`     | Course materials       |
| `/api/chat`          | Real-time chat         |
| `/api/announcements` | Announcements          |
| `/api/dashboard`     | Dashboard data         |

---

## Notes for Evaluators

- No deployment URL — runs locally only
- Both terminals (frontend + backend) must be running simultaneously
- Make sure PostgreSQL service is running before starting the backend
- The `.env` file is not included in the zip for security — create it manually as described above
- If port conflicts occur, backend port can be changed in `.env` (`PORT=5001`); frontend proxy is configured to match
