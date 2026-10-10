# 🚀 Leads Tracking App (API + Web Portal)

A full-stack enterprise lead management system built with a clean, decoupled architecture:
- **`backend/`**: Node.js + Express + TypeScript + SQLite REST API
- **`frontend/`**: React + TypeScript + Vite + Glassmorphic UI

---

## 📁 Repository Folder Structure

```
Leads Tracking App/
├── backend/                      # 🟢 BACKEND (REST API & DB)
│   ├── src/
│   │   ├── app.ts               # Express Application configuration
│   │   ├── server.ts            # HTTP Server entrypoint (Port 5000)
│   │   ├── db.ts                # SQLite DB setup & Schema definition
│   │   ├── routes.ts            # API endpoints (/api/leads & /api/leads/:id/notes)
│   │   ├── auth.ts              # Basic Authentication middleware
│   │   └── seed.ts              # Sample Database Seeder script
│   ├── tests/
│   │   └── leads.test.ts        # Jest API integration tests
│   ├── tsconfig.json            # Backend TypeScript configuration
│   ├── jest.config.js           # Jest test runner configuration
│   └── package.json             # Backend dependencies & scripts
│
├── frontend/                     # 🔵 FRONTEND (WEB PORTAL UI)
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadModal.tsx    # Create / Edit Lead modal dialog
│   │   │   └── LeadDetail.tsx   # Lead detail card & notes timeline
│   │   ├── App.tsx              # Main Dashboard SPA component
│   │   ├── types.ts             # TypeScript interfaces for API models
│   │   ├── index.css            # Dark glassmorphic design system
│   │   └── main.tsx             # React DOM entrypoint
│   ├── vite.config.ts           # Vite dev server configuration & API proxy
│   ├── tsconfig.json            # Frontend TypeScript configuration
│   └── package.json             # Frontend dependencies & scripts
│
├── Dockerfile                    # Multi-stage production container build
├── package.json                  # Root orchestration package.json
└── README.md                     # Documentation & API specifications
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Install All Dependencies
Install dependencies for both root, backend, and frontend with a single command:
```bash
npm run install:all
```

### 2. Seed Initial Database
Populate SQLite database (`leads.db`) with sample leads and notes:
```bash
npm run seed
```

### 3. Run Development Mode
Start both backend API (`localhost:5000`) and React frontend UI (`localhost:3000`) concurrently with hot reloading:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Running Unit Tests

Run the backend Jest unit test suite:
```bash
npm test
```

---

## 🐳 Docker Container Run

Build and run using Docker:
```bash
docker build -t leads-tracking-app .
docker run -p 5000:5000 leads-tracking-app
```
Access the application at `http://localhost:5000`.

---

## 📖 REST API Documentation & `curl` Examples

### Base Endpoint: `http://localhost:5000/api/leads`

#### 1. List Leads (Search, Filter, Paginate)
`GET /api/leads?search=sarah&status=qualified&page=1&limit=10`
```bash
curl -X GET "http://localhost:5000/api/leads?search=sarah"
```

#### 2. Get Single Lead by ID
`GET /api/leads/:id`
```bash
curl -X GET "http://localhost:5000/api/leads/1"
```

#### 3. Create a New Lead
`POST /api/leads`
```bash
curl -X POST "http://localhost:5000/api/leads" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "John Doe",
           "email": "john.doe@example.com",
           "phone": "+1 (555) 987-6543",
           "status": "new"
         }'
```

#### 4. Update a Lead
`PATCH /api/leads/:id`
```bash
curl -X PATCH "http://localhost:5000/api/leads/1" \
     -H "Content-Type: application/json" \
     -d '{
           "status": "contacted"
         }'
```

#### 5. Delete a Lead
`DELETE /api/leads/:id`
```bash
curl -X DELETE "http://localhost:5000/api/leads/1"
```

#### 6. Get Notes for a Lead
`GET /api/leads/:id/notes`
```bash
curl -X GET "http://localhost:5000/api/leads/1/notes"
```

#### 7. Add Note to a Lead
`POST /api/leads/:id/notes`
```bash
curl -X POST "http://localhost:5000/api/leads/1/notes" \
     -H "Content-Type: application/json" \
     -d '{
           "content": "Followed up with demo credentials."
         }'
```
