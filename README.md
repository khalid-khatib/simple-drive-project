# Simple Drive Project

A simple object-storage service built with Node.js and Express, supporting multiple backends (local filesystem, PostgreSQL, S3, FTP). You can `POST` and `GET` binary blobs by ID, with metadata tracking and pluggable storage adapters.

---

## Features

- **Multiple storage backends**  
  Local folder, PostgreSQL, Amazon S3 (SigV4), FTP
- **Metadata tracking**  
  Stores size and creation timestamp in a database table
- **Bearer-token authentication**  
  Single shared token in `Authorization: Bearer <TOKEN>`
- **Error-handling middleware**  
  Centralized JSON error responses
- **Unit & integration tests**  
  Jest + Supertest + mock-fs for full coverage
- **React + Vite Front End**  
  A simple React application (initialized with Vite) that lets you upload files or send Base64 strings to the API, and retrieve blobs by ID.

---

## 🔧 Prerequisites

- **Node.js** ≥ v16
- **npm** or **yarn**
- **PostgreSQL** ≥ v12 (if using the `db` backend)
- (Optional) AWS credentials for S3, or an FTP server

---

## ⚙️ Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-org/simple-drive-project.git
   cd simple-drive-project
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install front end dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Copy & edit** `.env` for backend

   Open `backend/.env` and configure:

   ```dotenv
   NODE_ENV=development
   PORT=3000

   # Authentication
   TOKEN=your-secret-token

   # Storage backend: "local", "db", "s3", or "ftp"
   STORAGE_TYPE=local

   # Local filesystem
   LOCAL_STORAGE_PATH=./localStorage

   # PostgreSQL (if STORAGE_TYPE=db)
   DB_USER=postgres
   DB_PASSWORD=…
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres

   # S3 (if STORAGE_TYPE=s3)
   S3_BUCKET_NAME=…
   S3_BUCKET_REGION=…
   S3_ACCESS_KEY=…
   S3_SECRET_ACCESS_KEY=…

   # FTP (if STORAGE_TYPE=ftp)
   FTP_HOST=…
   FTP_PORT=21
   FTP_USER=…
   FTP_PASS=…
   FTP_SECURE=false
   ```

---

## 🗄️ Database Setup (for `db` backend)

1. **Start PostgreSQL** and ensure credentials in `backend/.env` are correct.

---

## 🚀 Running the Project

### Backend

```bash
npm start
# or, for dev with auto-reload:
npm run dev
```

By default, the API listens on `http://localhost:3000`.

### Front End

```bash
npm run dev
```

This starts the Vite dev server, typically at `http://localhost:5173`, with hot reload.

---

## 📖 API Usage

### Authentication

All backend endpoints require:

```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

### Endpoints

1. **Store a blob**  
   `POST /v1/blobs`

   ```json
   {
     "id": "unique-id-123",
     "data": "<base64-encoded-string>"
   }
   ```

   - Success: `201 Created`
   - Errors: `400`, `409`

2. **Retrieve a blob**  
   `GET /v1/blobs/:id`  
   Response:
   ```json
   {
     "id": "unique-id-123",
     "data": "<base64-encoded-string>",
     "size": 1024,
     "created_at": "2025-04-29T10:15:00.000Z"
   }
   ```
   - Errors: `404`

---

## 🧪 Testing

### Backend Tests

```bash
npm install --save-dev jest supertest mock-fs
npm run test
```

---

## 📂 Folder Structure

```
simple-drive-project/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── tests/
│   ├── .env
│   ├── jest.config.js
│   ├── package.json
│   └── server.js
└── simple-drive-ui/
    ├── .env
    ├── public/
    └── src/
        ├── components/
        │   ├── Header.jsx
        │   ├── UploadForm.jsx
        │   └── RetrieveForm.jsx
        ├── utils/
        ├── App.jsx
        └── main.jsx
```
