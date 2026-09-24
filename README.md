# Task Management System

## Prerequisites
- **Java 17+** & **Node.js 18+**
- **PostgreSQL** running on `localhost:5432`. Create a database named `task_management`.

### 1. Start Backend
```bash
cd task-management-backend
./mvnw spring-boot:run
```

### 2. Start Frontend
```bash
cd task-management-frontend
npm install && npm run dev
```

## Default Login
The backend automatically creates an account on startup. Log in at `http://localhost:5173` with:
- **Email:** `admin@gmail.com`
- **Password:** `1234`
