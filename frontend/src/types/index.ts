export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface Customer {
  id: string
  customerNumber: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  productCode: string
  name: string
  description?: string
  basePrice: string | number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderStatus {
  id: number
  name: string
  description?: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  unitPrice: string | number
  lineTotal: string | number
  notes?: string
  createdAt: string
}

export interface OrderHistory {
  id: string
  orderId: string
  changedBy?: string
  changeType: string
  oldValue?: any
  newValue?: any
  changedAt: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: Customer
  orderStatusId: number
  status?: OrderStatus
  orderDate: string
  subtotal: string | number
  taxAmount: string | number
  discountAmount: string | number
  totalAmount: string | number
  notes?: string
  items?: OrderItem[]
  history?: OrderHistory[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderDto {
  customerId: string
  orderDate?: string
  taxAmount?: number
  discountAmount?: number
  notes?: string
  items: CreateOrderItemDto[]
}

export interface CreateOrderItemDto {
  productId: string
  quantity: number
  unitPrice: number
  notes?: string
}

export interface UpdateOrderDto {
  customerId?: string
  orderDate?: string
  orderStatusId?: number
  taxAmount?: number
  discountAmount?: number
  notes?: string
  items?: CreateOrderItemDto[]
}

export interface OrderQueryParams {
  search?: string
  customerId?: string
  statusId?: number
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}