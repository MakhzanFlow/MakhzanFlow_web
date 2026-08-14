# MakhzanFlow Web App — Implementation Plan

> Next.js web dashboard for StockFlow warehouse management system, integrated with MakhzanFlow REST API.

---

## Architecture

```
Next.js 16 (App Router) → REST API (localhost:8080/api) → Express + Prisma + PostgreSQL
```

- All authenticated requests use `Authorization: Bearer <accessToken>` via httpOnly cookie
- Company-scoped routes require `X-Company-Id` header
- Backend is the single source of truth — no business logic in the web app

---

## Phase 1: Auth & Core Infrastructure ✅ IN PROGRESS

### 1.1 Middleware — Route Protection
- [ ] Create `middleware.ts` at root
- [ ] Protect `/dashboard/*` routes — redirect to `/login` if no token
- [ ] Redirect authenticated users from `/login`, `/register` to `/dashboard`
- [ ] Cookie-based token detection (`mf_access_token`)

### 1.2 Token Management
- [ ] Token storage in localStorage (`mf_access_token`, `mf_refresh_token`)
- [ ] Auto-refresh on 401 response (interceptor pattern)
- [ ] Token rotation on refresh
- [ ] Clear tokens on logout

### 1.3 API Client Improvements
- [ ] Axios interceptors for auto-attach Bearer token
- [ ] 401 handler with token refresh
- [ ] Request retry after successful refresh
- [ ] Redirect to `/login` on refresh failure

### 1.4 Error Handling
- [ ] Toast notification system for errors
- [ ] API error response parsing
- [ ] Network error handling
- [ ] Loading states for all async operations

---

## Phase 2: Company Management

### 2.1 Select Company Page
- [ ] List user's companies with role display
- [ ] Create new company button → form modal
- [ ] Join company with invite code
- [ ] Company preview before joining (lookup endpoint)
- [ ] Pending requests status display

### 2.2 Create Company Flow
- [ ] Company name input
- [ ] Optional logo URL
- [ ] Submit → auto-select as active company
- [ ] Redirect to dashboard

### 2.3 Join Company Flow
- [ ] Invite code input with validation
- [ ] Company preview (name, logo)
- [ ] Submit join request
- [ ] Status: pending → waiting for approval
- [ ] My join requests list

### 2.4 Member Management (Owner/Admin)
- [ ] Members list with roles and permissions
- [ ] Add member by email/user ID
- [ ] Update member role and permissions
- [ ] Remove member
- [ ] Approve/reject pending join requests

---

## Phase 3: Products Module

### 3.1 Products List
- [ ] Paginated table with search
- [ ] Columns: name, SKU, barcode, price, stock, min_stock
- [ ] Sort by name, price, stock, created_at
- [ ] Quick actions: edit, delete
- [ ] Low stock indicator (below min_stock)

### 3.2 Product CRUD
- [ ] Create product form (name, SKU, barcode, price, stock, min_stock, image_url)
- [ ] Edit product form (same fields)
- [ ] Delete confirmation dialog
- [ ] Image upload (optional)

### 3.3 Stock Management
- [ ] Stock adjustment modal (add/remove)
- [ ] Stock history log
- [ ] Low stock alerts section

---

## Phase 4: Customers Module

### 4.1 Customers List
- [ ] Paginated table with search
- [ ] Columns: name, phone, email, total_debt, created_at
- [ ] Sort and filter options
- [ ] Quick actions: edit, delete, view debt

### 4.2 Customer CRUD
- [ ] Create customer form (name, phone, email, address, notes)
- [ ] Edit customer form
- [ ] Delete confirmation

### 4.3 Debt Tracking
- [ ] Customer debt summary
- [ ] Payment history per customer
- [ ] Debt status indicators (paid, partial, overdue)

---

## Phase 5: Invoices Module

### 5.1 Invoices List
- [ ] Paginated table with filters
- [ ] Filter by: date range, type (sale/purchase), status
- [ ] Columns: invoice#, customer, total, paid, status, date
- [ ] Quick actions: view, edit, delete

### 5.2 Invoice Creation
- [ ] Invoice form with customer selector
- [ ] Add line items (product, quantity, price)
- [ ] Auto-calculate totals
- [ ] Discount and tax fields
- [ ] Save as draft or finalize

### 5.3 Invoice View
- [ ] Print-ready invoice layout
- [ ] PDF generation
- [ ] Share/print button

### 5.4 Excel Export
- [ ] Export invoices to Excel
- [ ] Custom date range selection
- [ ] Column selection

---

## Phase 6: Payments Module

### 6.1 Payments List
- [ ] Paginated table with filters
- [ ] Filter by: date range, type (received/made), status
- [ ] Columns: amount, type, customer/supplier, invoice, date

### 6.2 Record Payment
- [ ] Payment form (amount, type, customer/supplier, invoice link)
- [ ] Partial payment support
- [ ] Payment status update

### 6.3 Debt Dashboard
- [ ] Total debts overview
- [ ] Overdue payments list
- [ ] Payment reminders

---

## Phase 7: Reports Module

### 7.1 Sales Reports
- [ ] Daily sales summary
- [ ] Monthly sales trend chart
- [ ] Top selling products
- [ ] Top customers

### 7.2 Inventory Reports
- [ ] Current stock levels
- [ ] Low stock alerts
- [ ] Stock movement history

### 7.3 Financial Reports
- [ ] Revenue vs payments
- [ ] Outstanding debts
- [ ] Monthly profit/loss

### 7.4 Excel Export
- [ ] Export any report to Excel
- [ ] Custom date ranges
- [ ] Column selection

---

## Phase 8: Settings & Profile

### 8.1 User Profile
- [ ] Edit name, email
- [ ] Change password
- [ ] Delete account request

### 8.2 Company Settings
- [ ] Edit company name, logo
- [ ] View/regenerate invite code
- [ ] Delete company (owner only)

---

## File Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages
│   ├── (dashboard)/     # Dashboard & main app
│   ├── api/             # API routes (proxy to backend)
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities, API client
└── types/               # TypeScript types
```

---

## API Routes (Proxied)

| Route | Backend Endpoint | Method |
|-------|------------------|--------|
| `/api/auth/register` | `/api/auth/register` | POST |
| `/api/auth/login` | `/api/auth/login` | POST |
| `/api/auth/me` | `/api/auth/me` | GET |
| `/api/auth/refresh` | `/api/auth/refresh` | POST |
| `/api/auth/logout` | `/api/auth/logout` | POST |
| `/api/companies` | `/api/companies` | GET/POST |
| `/api/dashboard/stats` | `/api/dashboard/stats` | GET |

---

## Notes

- Backend API: `http://localhost:8080/api`
- Access token: 15min expiry, stored in memory/httpOnly cookie
- Refresh token: 30 days, rotation on refresh
- Company context: stored in cookie `mf_company_id`
- All UI text in Arabic (RTL)
