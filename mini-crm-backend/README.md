## Mini CRM Backend

**Stack**: Node.js, Express, Sequelize, MySQL, JWT

### Setup

1. Install dependencies:

```bash
cd mini-crm-backend
npm install
```

2. Create a database in MySQL:

```sql
CREATE DATABASE mini_crm;
```

3. Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

4. Run the server:

```bash
npm run dev
```

The server will auto-sync tables and seed default roles (`Admin`, `Sales User`).

### API Overview

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Leads**:
  - `POST /api/leads`
  - `GET /api/leads?status=Converted&page=1&limit=10&search=john`
  - `PUT /api/leads/:id`
  - `DELETE /api/leads/:id`
- **Followups**:
  - `POST /api/followups`
  - `GET /api/followups/:leadId`
- **Dashboard**:
  - `GET /api/dashboard`

All non-auth routes require a `Bearer <token>` header.
