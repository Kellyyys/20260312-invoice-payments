# Take-Home Assignment — Invoice Status & Payments

## About This website

At eCapital, we build fintech services using microservices and relational databases. This is a small full-stack application for managing invoices and payments — a simplified version of the kind of work our engineering team does every day.

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
**TBD**

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

### Front-End UI

- List all invoices with: customer name, amount (currency-formatted), status, issued date, and due date
- View invoice details including a breakdown of payments
- Create a new invoice
- Record a payment against an invoice
- Filter invoices by status and/or customer
- Add validations as necessary

---

## Setup Instructions
### prerequisites
- Node.js
- npm

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
In your local **.env** file, add:
```bash
PORT=5000
DATABASE_URL=TBD
```
Database migration
```bash
npx prisma migrate dev
npm run seed
```
Start the backend server
```bash
npm run dev
```
