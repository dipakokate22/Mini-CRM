## Mini CRM Frontend

**Stack**: React, React Router, Axios, Chart.js

### Setup

```bash
cd mini-crm-frontend
npm install
npm start
```

Create a `.env` file (optional) to point to your backend:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### Screens

- **Auth**: Login / Register, stores JWT in `localStorage`.
- **Dashboard**: Total leads, converted/lost, conversion %, and a doughnut chart by status.
- **Leads**: Create/edit/delete leads, filter by status, quick search, link to followups.
- **Followups**: Add followups for a specific lead, see a timeline-style history.

All protected routes automatically redirect to `/auth` if the user is not logged in.
