# Helpdesk Support Ticket Management Application

This is a full-stack helpdesk support ticket management application, built with a FastAPI backend and a React.js frontend using Vite. The backend communicates with a PostgreSQL database and allows users to create, view, and manage support tickets.



## Backend (FastAPI)

The backend is built with FastAPI and uses PostgreSQL for storing ticket data.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/NewMissU/ticket-management-nipa.git
cd ticket-management-nipa
```

2. Navigate to the backend folder:

```bash
cd backend
```

3. Set up a virtual environment:

```bash
py -3 -m venv .venv
.venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Set up environment variables:

Create a .env file in the backend directory and add the following configuration for PostgreSQL:

```bash
DB_HOST=localhost
DB_PORT=your_db_port
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```
6. Start the FastAPI backend:

```bash
uvicorn main:app --reload
```

The backend will be available at 👉 http://127.0.0.1:8000.

API documents Swagger UI 👉 http://127.0.0.1:8000/docs

## Frontend (React with Vite)

The frontend is built using React.js with Vite for fast development, and Tailwind CSS v4.0 for styling the user interface.

### Installation
Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm run dev
```

The frontend will be available at 👉 http://localhost:5173.

## Possible Issue: UI Not Loading

If the UI does not load, please **refresh the website once** and try again.