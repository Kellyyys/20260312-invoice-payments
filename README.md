# Invoice Manager

## About This website

This is a small full-stack application for managing invoices and payments — a simplified version of the kind of work our engineering team does every day.

---

## Goal

Build a full-stack **Invoice & Payments** application with a microservice-style backend API and a front-end UI.

The system demonstrates:
- relational data modeling
- error handling
- REST API design
- business rule enforcement
- modular backend architecture
- a clean frontend user interface
- good documentation and code organization

---

## Tech Stack
### Frontend
- **Vue 3**
- **Vite**
- **Vue Router**
- **PrimeVue**
- **PrimeIcons**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js**
- **Express**
- **Prisma ORM**

### Database
- **PostgreSQL**

---

## Architecture Overview

The system follows a layered architecture:
Frontend (Vue)
        │
        │ HTTP API
        ▼
Backend API (Express)
        │
        │ ORM
        ▼
Prisma Client
        │
        ▼
PostgreSQL Database

### File Structure

20260312-invoice-payments/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── App.vue
│   │   ├── main.css 
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── seed.js
    │   └── seed-data.json
    ├── routes/
    ├── controllers/
    ├── services/
    ├── utils/
    ├── server.js
    ├── prisma.config.ts
    └── package.json

---

## Data Model

**Customers**

| Field | Type |
|-------|------|
| id | integer / UUID |
| name | string |

**Invoices**

| Field | Type | Notes |
|-------|------|-------|
| id | integer / UUID | |
| customer_id | FK → customers | |
| amount | decimal | Total amount owed |
| currency | string | e.g. `USD`, `CAD` |
| issued_at | timestamp | |
| due_at | timestamp | |
| status | enum | `DRAFT`, `PENDING`, `PAID`, `VOID` |

**Payments**

| Field | Type | Notes |
|-------|------|-------|
| id | integer / UUID | |
| invoice_id | FK → invoices | |
| amount | decimal | Partial or full payment |
| paid_at | timestamp | |

---

## Functional Requirements/Features
### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/invoices` | Create a new invoice |
| `GET` | `/invoices/{id}` | Get invoice details (including payments) |
| `POST` | `/invoices/{id}/payments` | Record a payment against an invoice |
| `GET` | `/customers/{id}/invoices` | List invoices for a customer |

The **list endpoint** should support query parameters for filtering:
- `status` — filter by invoice status
- `from` / `to` — filter by `issued_at` date range

### Business Rules

- A payment **must not** cause the total paid to exceed the invoice amount (no overpayment)
- A payment amount **must be positive**
- When `sum(payments) == invoice.amount`, the invoice status should transition to `PAID`
- A `VOID` or `PAID` invoice should not accept new payments

---

## Setup Instructions
### prerequisites
- Node.js v20.19.0 or v22.12.0+
- npm
- PostgreSQL

### Clone the repository
```bash
git clone <repo-url>
cd 20260312-invoice-payments
```

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### backend setup
```bash
cd backend
npm install
```
Create PostgreSQL database on your local end (this project does not use cloud database like Mongodb Atlas, so local database is required)
```bash
createdb invoice_payments_db
```
In your local **.env** file, add:
```bash
PORT=5000
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/invoice_payments_db?schema=public"
```
Note: YOUR_USERNAME can be found by running "whoami" in terminal

Database migration
```bash
npx prisma migrate dev
npm run seed
```
Start the backend server
```bash
npm run dev
```
