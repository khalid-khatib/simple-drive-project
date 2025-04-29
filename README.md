# Simple Drive Project

A simple object-storage service built with Node.js and Express, supporting multiple backends (local filesystem, PostgreSQL, S3, FTP). You can `POST` and `GET` binary blobs by ID, with metadata tracking and pluggable storage adapters, and use a React + Vite front end for file uploads and retrievals.

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
  A separate UI project (`simple-drive-ui`) that lets you upload files or send Base64 strings to the API, and retrieve blobs by ID.

---

## Features of the Front End

- Upload local files or input a Base64 string to be saved via the API.  
- Retrieve and display blobs by their ID.

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
   git clone https://github.com/khalid-khatib/simple-drive-project.git
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
   cd ./simple-drive-ui
   npm install
   # or
   yarn install
   ```

---

## 🛠 Configuration

### Backend `.env`

Copy and edit the backend environment file:


Edit `backend/.env` with your settings:

```dotenv
NODE_ENV=development
PORT=3000

# Authentication
TOKEN=your-secret-token

# Storage backend: "local", "db", "s3", or "ftp"
STORAGE_TYPE=local

# Local filesystem (if STORAGE_TYPE=local)
LOCAL_STORAGE_PATH=localStorage

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

### Front End `.env`

Create and edit the front-end environment file at `simple-drive-ui/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/v1/blobs
VITE_API_TOKEN=your-secret-token-defined-in-backend
```

- **VITE_API_BASE_URL**: The base URL for the blob storage API endpoints.  
- **VITE_API_TOKEN**: The bearer token used by the UI to authenticate API requests.

---

## 🗄️ Database Setup (for `db` backend)

1. **Start PostgreSQL** and ensure credentials in `simple-drive-projec/.env` are correct.  

---

## 🚀 Running the Project

### Backend

```bash
npm start
# or, for dev with auto-reload:
npm run dev
```

By default, the API listens on `http://localhost:3000`.

### Front End (`simple-drive-ui`)

```bash
cd simple-drive-ui
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
│   ├── .env.example
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

