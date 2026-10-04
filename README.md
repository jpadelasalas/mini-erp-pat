# Mini ERP

A lightweight, browser-based ERP dashboard for managing inventory, sales, and employees. Mini ERP is built with React and stores each user's data locally in the browser, so it can be explored without setting up a database or API.

## Features

- Register and sign in with locally stored credentials
- View sales activity and year-over-year monthly reports on the dashboard
- Create, search, edit, paginate, and delete inventory records
- Record sales with automatic price calculation and inventory deduction
- Create, search, edit, paginate, and delete employee records
- Keep records separated by user account
- Use responsive layouts across desktop and mobile screens

> To edit an inventory, sales, or employee record, double-click its table row.

## Tech stack

- React 19 and React Router
- Vite 7
- Tailwind CSS 4
- Material UI
- Recharts
- SweetAlert2
- bcrypt.js

## Getting started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

```bash
git clone <repository-url>
cd mini-erp-pat
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

Create an account from the registration screen to begin. No environment variables or backend services are required.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Data storage

This project is a client-side demonstration app. User accounts and ERP records are stored in the browser's `localStorage`, while the active login is stored in `sessionStorage`.

As a result:

- Data does not automatically sync between browsers or devices.
- Clearing site data removes the saved accounts and records.
- The authentication flow is not suitable for production use.

A production deployment should replace browser storage with a database-backed API and server-side authentication.

## Project structure

```text
src/
|-- components/   # Shared UI and route guards
|-- context/      # Authentication and module state
|-- features/     # Feature-specific tables, forms, and charts
|-- hooks/        # Reusable form, search, and pagination logic
|-- layout/       # Authenticated application shell
|-- pages/        # Route-level components
|-- App.jsx       # Routes and lazy-loaded pages
`-- main.jsx      # Application entry point
```

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to any static hosting provider. The included `vercel.json` rewrites client-side routes to `index.html`, so the project is ready for Vercel's single-page application routing.
