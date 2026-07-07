# Customer Order Management System
## Architecture Overview

**Version**: 2.0 (Updated for Actual Implementation)
**Date**: July 7, 2026
**Status**: Current Implementation

---

## Executive Summary

The Customer Order Management System is built using **NestJS (Node.js/TypeScript)** for the backend and **React (TypeScript)** for the frontend. The system uses **SQLite** with **Prisma ORM** for data persistence, with **JWT-based authentication** for security.

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | 10.x | Node.js framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Node.js** | 20.x | Runtime environment |
| **Prisma** | 5.x | Type-safe ORM |
| **SQLite** | 3.x | Embedded database |
| **Passport** | Latest | Authentication middleware |
| **JWT** | - | Token-based authentication |
| **Swagger** | - | API documentation |
| **class-validator** | - | DTO validation |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.x | UI framework |
| **TypeScript** | 5.3.x | Type-safe JavaScript |
| **Vite** | 5.x | Build tool |
| **React Router** | 6.21.x | Routing |
| **Axios** | 1.6.x | HTTP client |
| **Tailwind CSS** | 3.4.x | Styling |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Dashboard | Orders | Customers | Products    │  │
│  │  Components: Layout | Forms | Tables | Cards        │  │
│  │  State: React Context | Custom Hooks               │  │
│  │  Services: API Client (Axios)                       │  │
│  └─────────────────────┬────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         │ HTTP/JSON
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (NestJS)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers: Auth | Customer | Product | Order      │  │
│  │  Services: Business Logic & Validation               │  │
│  │  Guards: JWT Authentication                         │  │
│  │  Strategies: Passport Local & JWT                    │  │
│  │  DTOs: class-validator schemas                      │  │
│  └─────────────────────┬────────────────────────────────┘  │
│                      Prisma Service (ORM)                   │
└────────────────────────┼────────────────────────────────────┘
                         │ Prisma Queries
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                       │
│  Tables: User | Customer | Product | Order | OrderStatus    │
│          | OrderItem | OrderHistory                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Module Structure

```
backend/src/
├── config/              # Configuration module
├── common/              # Shared utilities
│   ├── prisma.service.ts
│   ├── prisma.module.ts
│   └── decorators/
├── modules/             # Feature modules
│   ├── auth/           # Authentication
│   ├── customer/       # Customer management
│   ├── product/        # Product management
│   └── order/          # Order management
├── app.module.ts       # Root module
└── main.ts             # Entry point
```

### Auth Module
**Purpose**: User authentication and authorization

**Components**:
- `auth.controller.ts` - Login/profile endpoints
- `auth.service.ts` - Authentication business logic
- `strategies/local.strategy.ts` - Local authentication
- `strategies/jwt.strategy.ts` - JWT validation
- `guards/jwt-auth.guard.ts` - Route protection
- `dto/login.dto.ts` - Login validation

**Endpoints**:
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Current user profile

### Customer Module
**Purpose**: Customer CRUD operations

**Components**:
- `customer.controller.ts` - Customer endpoints
- `customer.service.ts` - Customer logic
- `dto/create-customer.dto.ts` - Create validation
- `dto/update-customer.dto.ts` - Update validation

**Endpoints**:
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Product Module
**Purpose**: Product catalog management

**Components**:
- `product.controller.ts` - Product endpoints
- `product.service.ts` - Product logic
- `dto/create-product.dto.ts` - Create validation
- `dto/update-product.dto.ts` - Update validation

**Endpoints**:
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Order Module
**Purpose**: Order management

**Components**:
- `order.controller.ts` - Order endpoints
- `order.service.ts` - Order logic
- `dto/create-order.dto.ts` - Create validation
- `dto/update-order.dto.ts` - Update validation
- `dto/order-query.dto.ts` - Query parameters

**Endpoints**:
- `GET /api/orders` - List orders (with filters)
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

---

## Frontend Architecture

### Component Structure

```
frontend/src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout wrapper
├── context/            # Global state
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom hooks
│   └── useAuth.ts      # Auth hook
├── pages/              # Page components
│   ├── Dashboard.tsx   # Home page
│   ├── LoginPage.tsx   # Login page
│   ├── OrderList.tsx   # Order list
│   ├── OrderCreate.tsx # Create order
│   └── OrderDetail.tsx # Order details (redesigned)
├── services/           # API layer
│   ├── api.ts          # Axios client
│   ├── authService.ts  # Auth API
│   ├── orderService.ts # Order API
│   ├── customerService.ts # Customer API
│   └── productService.ts  # Product API
├── types/              # TypeScript types
│   └── index.ts        # All types
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN PROCESS                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User enters credentials                                  │
│     └── LoginPage.tsx                                        │
│                                                               │
│  2. Call authService.login()                                 │
│     └── POST /api/auth/login                                 │
│     └── Body: { email, password }                           │
│                                                               │
│  3. Backend validates (Passport Local)                      │
│     └── auth.service.validateUser()                          │
│     └── bcrypt password comparison                           │
│                                                               │
│  4. Generate JWT token                                      │
│     └── jwt.strategy.generate()                             │
│     └── { access_token, user }                              │
│                                                               │
│  5. Store in AuthContext & localStorage                     │
│     └── setToken(access_token)                               │
│     └── setUser(user)                                       │
│                                                               │
│  6. Navigate to dashboard                                  │
│     └── navigate('/')                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Order Creation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER CREATION                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. User fills order form                                  │
│     └── OrderCreate.tsx                                     │
│     └── Select customer, add products, enter amounts        │
│                                                               │
│  2. Form validation (React Hook Form + Zod)                │
│     └── Required fields, data types, business rules         │
│                                                               │
│  3. Call orderService.createOrder()                         │
│     └── POST /api/orders                                     │
│     └── Headers: Authorization: Bearer <token>              │
│                                                               │
│  4. Backend processing (NestJS)                             │
│     └── DTO validation (class-validator)                     │
│     └── JWT Guard check                                     │
│     └── order.service.createOrder()                          │
│     └── Prisma transaction                                   │
│                                                               │
│  5. Database operations (Prisma)                            │
│     └── Create Order record                                 │
│     └── Create OrderItem records                            │
│     └── Calculate totals                                    │
│                                                               │
│  6. Return order details                                    │
│     └── Response: { order, items, customer }                │
│                                                               │
│  7. Navigate to order detail                               │
│     └── navigate(/orders/${order.id})                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Prisma Schema

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// User Authentication
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  name         String
  role         String    @default("sales_executive")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  @@map("user")
}

// Customer Master
model Customer {
  id             String    @id @default(uuid())
  customerNumber String    @unique @map("customer_number")
  name           String
  email          String?
  phone          String?
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  orders         Order[]

  @@map("customer")
}

// Product Catalog
model Product {
  id           String    @id @default(uuid())
  productCode  String    @unique @map("product_code")
  name         String
  description  String?
  basePrice    String    @default("0.00") @map("base_price")
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  orderItems   OrderItem[]

  @@map("product")
}

// Order Status Lookup
model OrderStatus {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  isDefault   Boolean  @default(false) @map("is_default")

  orders      Order[]

  @@map("order_status")
}

// Order Header
model Order {
  id             String       @id @default(uuid())
  orderNumber    String       @unique @map("order_number")
  customerId     String       @map("customer_id")
  orderStatusId  Int          @default(1) @map("order_status_id")
  orderDate      DateTime     @default(now()) @map("order_date")
  subtotal       String       @default("0.00")
  taxAmount      String       @default("0.00") @map("tax_amount")
  discountAmount String       @default("0.00") @map("discount_amount")
  totalAmount    String       @default("0.00") @map("total_amount")
  notes          String?
  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @updatedAt @map("updated_at")

  customer  Customer        @relation(fields: [customerId], references: [id])
  status    OrderStatus     @relation(fields: [orderStatusId], references: [id])
  items     OrderItem[]
  history   OrderHistory[]

  @@map("order")
}

// Order Line Items
model OrderItem {
  id         String    @id @default(uuid())
  orderId    String    @map("order_id")
  productId  String    @map("product_id")
  quantity   Int       @default(1)
  unitPrice  String    @default("0.00") @map("unit_price")
  lineTotal  String    @default("0.00") @map("line_total")
  notes      String?
  createdAt  DateTime  @default(now()) @map("created_at")

  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@map("order_item")
}

// Order History (Audit Trail)
model OrderHistory {
  id         String    @id @default(uuid())
  orderId    String    @map("order_id")
  changedBy  String?   @map("changed_by")
  changeType String    @map("change_type")
  oldValue   String?   @map("old_value")
  newValue   String?   @map("new_value")
  changedAt  DateTime  @default(now()) @map("changed_at")

  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("order_history")
}
```

---

## API Endpoints

### Base URL
- **Development**: `http://localhost:3000/api`
- **Documentation**: `http://localhost:3000/api/docs`

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | Public |
| GET | `/auth/profile` | Current user | JWT |

### Customers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/customers` | List all customers | JWT |
| POST | `/customers` | Create customer | JWT |
| GET | `/customers/:id` | Get customer details | JWT |
| PUT | `/customers/:id` | Update customer | JWT |
| DELETE | `/customers/:id` | Delete customer | JWT |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | List all products | JWT |
| POST | `/products` | Create product | JWT |
| GET | `/products/:id` | Get product details | JWT |
| PUT | `/products/:id` | Update product | JWT |
| DELETE | `/products/:id` | Delete product | JWT |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders` | List orders (with filters) | JWT |
| POST | `/orders` | Create order | JWT |
| GET | `/orders/:id` | Get order details | JWT |
| PUT | `/orders/:id` | Update order | JWT |
| DELETE | `/orders/:id` | Delete order | JWT |

---

## Security

### Authentication
- **Strategy**: JWT (JSON Web Tokens)
- **Implementation**: Passport JWT
- **Token Storage**: localStorage
- **Token Transmission**: Authorization header

### Authorization
- **Guards**: JWT Guard on protected routes
- **Roles**: `admin`, `sales_executive`
- **Role Field**: Exists in User model but not enforced yet

### Password Security
- **Hashing**: bcrypt (cost factor: 10)
- **Validation**: Min 8 characters
- **Storage**: Hash only, never plain text

---

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed    # Create admin user
npm run start:dev     # http://localhost:3000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### Default Credentials
- **Email**: `admin@example.com`
- **Password**: `Admin@123`

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 2.0 |
| Date | July 7, 2026 |
| Status | Current Implementation |

---

© 2026 Customer Order Management System. All rights reserved.
