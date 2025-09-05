# Techtuality Assignment

A simple full-stack application with authentication and a todo dashboard.

## Tech Stack
- **Frontend:** React, Vite, Tailwind, ShadCN UI  
- **Backend:** Node.js, Express, MongoDB, Mongoose  
- **Auth:** JWT  

---

## Setup Instructions

### Prerequisites
- Node.js (>=18)
- MongoDB (local or cloud e.g. MongoDB Atlas)
- npm or yarn

### Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file:
  ```bash
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   PORT=3000
   ```
4. Start the backend:
  ```bash
   npm run dev
   ```

---

### Frontend
1. Navigate to the frontend folder:
  ```bash
  cd frontend
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a .env file:
  ```bash
  BACKEND_URL=http://localhost:3000
  ```

4. Start the frontend:
  ```bash
  npm run dev
  ```

---

### Usage
1. Go to http://localhost:5173

2. Sign up or sign in.

3. Create, manage, and delete todos.

4. Logout when done.

---

##  Scripts

### Backend
  ```bash
  npm run dev   # Runs the backend server
  ```

### Frontend
  ```bash
npm run dev   # Runs the frontend server
```
