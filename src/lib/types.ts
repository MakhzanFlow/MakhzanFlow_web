export interface User {
  id: string
  name: string
  email: string
  is_verified: boolean
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Company {
  id: string
  name: string
  logo_url: string | null
  invite_code: string | null
  created_at: string
  updated_at: string
  company_members?: { role: string; permissions: Record<string, unknown> }[]
}

export interface DashboardStats {
  productsCount: number
  customersCount: number
  totalDebt: number
  todaySales: number
  monthlyPayments: number
  weeklySales: { date: string; label: string; amount: number }[]
  recentActivities: Activity[]
  fetchedAt: string
}

export interface LowStockProduct {
  id: string
  name: string
  sku: string
  barcode: string | null
  price: number
  stock: number
  min_stock: number
  image_url: string | null
}

export interface MonthlyReport {
  month: string
  totalInvoices: number
  totalRevenue: number
  totalPayments: number
}

export interface Activity {
  id: string
  user_id: string
  user_name: string
  entity: string
  entity_id: string
  action: string
  changes: Record<string, { old: unknown; new: unknown }>
  created_at: string
}

export interface Product {
  id: string
  name: string
  sku: string | null
  barcode: string | null
  price: number
  stock: number
  min_stock: number
  image_url: string | null
  expiry_date: string | null
  is_active: boolean
  company_id: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  opening_balance: number
  image_url: string | null
  current_debt: number
  company_id: string
  created_at: string
  updated_at: string
}

export type InvoiceStatus = 'pending' | 'paid' | 'partially_paid' | 'canceled'

export interface InvoicePayment {
  id: string
  invoice_id: string
  amount: number
  method: 'cash' | 'card' | 'bank_transfer' | 'other'
  reference_number: string | null
  notes: string | null
  created_at: string | null
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  products: { name: string; image_url: string | null; price: number }
}

export interface InvoiceCustomerRef {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
}

export interface InvoiceUserRef {
  id: string
  name: string
  email: string
}

export interface Invoice {
  id: string
  company_id: string
  customer_id: string | null
  user_id: string | null
  invoice_number: string
  status: InvoiceStatus
  total_amount: number
  discount_amount: number
  tax_amount: number
  due_date: string | null
  created_at: string | null
  updated_at: string | null
  invoice_items?: InvoiceItem[]
  payments: InvoicePayment[]
  customers: InvoiceCustomerRef | null
  users: InvoiceUserRef | null
}

export interface Payment {
  id: string
  amount: number
  type: 'received' | 'made'
  customer_id: string | null
  customer_name?: string
  invoice_id: string | null
  notes: string | null
  company_id: string
  created_at: string
}

export interface InvoiceListItem {
  id: string
  company_id: string
  customer_id: string | null
  user_id: string | null
  invoice_number: string
  status: InvoiceStatus
  total_amount: number
  discount_amount: number
  tax_amount: number
  due_date: string | null
  created_at: string | null
  updated_at: string | null
  customers: InvoiceCustomerRef | null
  payments: InvoicePayment[]
  users: InvoiceUserRef | null
}

export interface JoinRequest {
  id: string
  company_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  companies: {
    id: string
    name: string
    logo_url: string | null
  }
}
