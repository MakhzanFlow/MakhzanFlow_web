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

## Phase 1: Auth & Core Infrastructure ✅ COMPLETED

### 1.1 Middleware — Route Protection
- [x] Create `middleware.ts` at root
- [x] Protect `/dashboard/*`, `/products/*`, `/customers/*`, `/invoices/*`, `/payments/*`, `/reports/*` routes
- [x] Redirect authenticated users from `/login`, `/register` to `/dashboard`
- [x] Cookie-based token detection (`mf_access_token`)

### 1.2 Token Management
- [x] Token storage in localStorage (`mf_access_token`, `mf_refresh_token`)
- [x] Auto-refresh on 401 response (interceptor pattern)
- [x] Token rotation on refresh
- [x] Clear tokens on logout

### 1.3 API Client
- [x] Custom `apiClient` with auto-attach Bearer token
- [x] 401 handler with token refresh
- [x] Request retry after successful refresh
- [x] Redirect to `/login` on refresh failure

### 1.4 Error Handling
- [x] Toast notification system (`Toast.tsx`)
- [x] API error response parsing (`parseApiResponse`)
- [x] Loading states for all async operations

---

## Phase 2: Company Management ✅ COMPLETED

### 2.1 Select Company Page
- [x] List user's companies with role display
- [x] Create new company button → form
- [x] Join company with invite code
- [x] Company preview before joining (lookup endpoint)
- [x] Pending requests status display

### 2.2 Create Company Flow
- [x] Company name input
- [x] Submit → auto-select as active company
- [x] Redirect to dashboard

### 2.3 Join Company Flow
- [x] Invite code input with validation
- [x] Company preview (name)
- [x] Submit join request
- [x] Status: pending → waiting for approval

### 2.4 Member Management (Owner/Admin)
- [ ] Members list with roles and permissions
- [ ] Add member by email/user ID
- [ ] Update member role and permissions
- [ ] Remove member
- [ ] Approve/reject pending join requests

---

## Phase 3: Products Module ✅ COMPLETED (List View)

### 3.1 Products List
- [x] Paginated table with search
- [x] Columns: name, SKU, price, stock, min_stock
- [x] Quick actions: edit, delete buttons
- [x] Low stock indicator (below min_stock)

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

## Phase 4: Customers Module ✅ COMPLETED (List View)

### 4.1 Customers List
- [x] Paginated table with search
- [x] Columns: name, phone, email, total_debt
- [x] Quick actions: edit, delete buttons
- [x] Debt badge indicator

### 4.2 Customer CRUD
- [ ] Create customer form (name, phone, email, address, notes)
- [ ] Edit customer form
- [ ] Delete confirmation

### 4.3 Debt Tracking
- [ ] Customer debt summary
- [ ] Payment history per customer
- [ ] Debt status indicators (paid, partial, overdue)

---

## Phase 5: Invoices Module ✅ COMPLETED (List View)

### 5.1 Invoices List
- [x] Paginated table with type filter (all/sale/purchase)
- [x] Columns: invoice#, type, customer, total, paid, status, date
- [x] Status badges (draft, final, paid, partial, cancelled)
- [x] Quick actions: view, delete buttons

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

---

## Phase 6: Payments Module ✅ COMPLETED (List View)

### 6.1 Payments List
- [x] Paginated table with type filter (all/received/made)
- [x] Columns: amount, type, customer, invoice, notes, date
- [x] Received/made badges

### 6.2 Record Payment
- [ ] Payment form (amount, type, customer/supplier, invoice link)
- [ ] Partial payment support
- [ ] Payment status update

### 6.3 Debt Dashboard
- [ ] Total debts overview
- [ ] Overdue payments list

---

## Phase 7: Reports Module ✅ COMPLETED

### 7.1 Monthly Report
- [x] Tab: Monthly report table (month, invoices, revenue, payments)

### 7.2 Low Stock Report
- [x] Tab: Low stock products table (name, SKU, stock, min_stock)

### 7.3 Activity Log
- [x] Tab: Activity log table (user, action, entity, date)

### 7.4 Excel Export
- [ ] Export any report to Excel
- [ ] Custom date ranges

---

## Phase 8: Settings & Profile ⏳ PENDING

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
│   ├── (auth)/              # Auth pages (login, register, verify-email, select-company)
│   ├── (dashboard)/         # Dashboard & main app
│   │   ├── customers/       # Customers module
│   │   ├── dashboard/       # Dashboard page
│   │   ├── invoices/        # Invoices module
│   │   ├── payments/        # Payments module
│   │   ├── products/        # Products module
│   │   └── reports/         # Reports module
│   ├── api/                 # API routes (proxy to backend)
│   └── layout.tsx           # Root layout
├── components/              # Reusable components (Nav, Footer, Toast)
├── contexts/                # React contexts (AuthContext)
├── lib/                     # Utilities, API client, types
└── middleware.ts             # Route protection
```

---

## Implemented Pages

| Page | Route | Status |
|------|-------|--------|
| Landing | `/` | ✅ |
| Login | `/login` | ✅ |
| Register | `/register` | ✅ |
| Verify Email | `/verify-email` | ✅ |
| Select Company | `/select-company` | ✅ |
| Dashboard | `/dashboard` | ✅ |
| Products | `/products` | ✅ |
| Customers | `/customers` | ✅ |
| Invoices | `/invoices` | ✅ |
| Payments | `/payments` | ✅ |
| Reports | `/reports` | ✅ |
| Privacy | `/privacy` | ✅ |
| Delete Account | `/delete-account` | ✅ |

---

## API Routes (Proxied)

| Route | Backend Endpoint | Method |
|-------|------------------|--------|
| `/api/auth/register` | `/api/auth/register` | POST |
| `/api/auth/login` | `/api/auth/login` | POST |
| `/api/auth/me` | `/api/auth/me` | GET |
| `/api/auth/refresh` | `/api/auth/refresh` | POST |
| `/api/auth/logout` | `/api/auth/logout` | POST |
| `/api/auth/verify-email` | `/api/auth/verify-email` | POST |
| `/api/auth/verify-email/resend` | `/api/auth/verify-email/resend` | POST |
| `/api/companies` | `/api/companies` | GET/POST |
| `/api/companies/lookup` | `/api/companies/lookup` | GET |
| `/api/companies/join` | `/api/companies/join` | POST |
| `/api/dashboard/stats` | `/api/dashboard/stats` | GET |
| `/api/dashboard/low-stock` | `/api/dashboard/low-stock` | GET |
| `/api/dashboard/monthly-report` | `/api/dashboard/monthly-report` | GET |
| `/api/dashboard/activity` | `/api/dashboard/activity` | GET |
| `/api/products` | `/api/products` | GET/POST |
| `/api/customers` | `/api/customers` | GET/POST |
| `/api/invoices` | `/api/invoices` | GET/POST |
| `/api/payments` | `/api/payments` | GET/POST |

---

## Next Steps

1. **Phase 8:** Add Settings & Profile pages
2. **CRUD Modals:** Add create/edit modals for Products, Customers, Invoices, Payments
3. **Invoice Builder:** Full invoice creation with line items
4. **Excel Export:** Export functionality for reports and invoices
5. **Responsive Design:** Mobile sidebar toggle, responsive tables

---

## Notes

- Backend API: `http://localhost:8080/api`
- Access token: 15min expiry, stored in localStorage
- Refresh token: 30 days, rotation on refresh
- Company context: stored in cookie `mf_company_id`
- All UI text in Arabic (RTL)
- Build status: ✅ Passing
