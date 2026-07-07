# Customer Order Management MVP

Complete software implementation for the Customer Order Management MVP based on comprehensive architecture design.

## 🏗️ Architecture Overview

This project implements a Clean Architecture pattern with:

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: NestJS (Node.js 20+) with TypeScript
- **Database**: SQLite 3+ with Prisma ORM
- **Authentication**: JWT-based stateless authentication
- **Deployment**: Docker + Docker Compose

## 📁 Project Structure

```
customer-order-management/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/       # Authentication module
│   │   │   ├── customers/  # Customers module
│   │   │   ├── products/   # Products module
│   │   │   └── orders/     # Orders module
│   │   ├── common/         # Shared utilities
│   │   ├── config/         # Configuration files
│   │   └── main.ts         # Application entry point
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Prisma schema
│   │   └── seed.ts         # Database seeding script
│   ├── test/               # Backend tests
│   ├── package.json        # Node dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── nest-cli.json       # NestJS CLI configuration
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React Context
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   ├── package.json        # Node dependencies
│   ├── vite.config.ts      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── docs/                    # Documentation
│   ├── README.md           # This file
│   ├── DATA_MODEL.md       # Database schema documentation
│   └── ARCHITECTURE_DESIGN_DOCUMENT.md
│
└── docker-compose.yml      # Docker services configuration
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- npm 10+

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd customer-order-management
```

2. **Set up environment variables**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

5. **Install frontend dependencies**
```bash
cd frontend
npm install
```

6. **Start development servers**
```bash
# Terminal 1: Backend
cd backend
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- Prisma Studio: `npx prisma studio` (from backend directory)

### Docker Development

```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

## 📊 Database Schema

The system uses SQLite with Prisma ORM and includes the following entities:

- **customer** - Customer master data
- **product** - Product catalog
- **order_status** - Order status lookup
- **order** - Order header
- **order_item** - Order line items
- **order_history** - Audit trail
- **user** - User authentication

## 🔐 Authentication

JWT-based authentication with:
- Access tokens (15 minutes)
- Refresh tokens (7 days)
- Bcrypt password hashing
- Role-based authorization

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript 5** - Type-safe JavaScript
- **Prisma** - Type-safe ORM for SQLite
- **Passport** - Authentication middleware
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Class Validator** - DTO validation
- **Swagger** - API documentation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Forms
- **Zod** - Validation
- **Tailwind CSS** - Styling
- **Headless UI** - Components

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Health
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health status

### Customers (Next)
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/{id}` - Get customer
- `PUT /api/customers/{id}` - Update customer

### Products (Next)
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product

### Orders (Next)
- `GET /api/orders` - Search orders
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order

## 🧪 Testing

### Backend Tests
```bash
cd backend
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Current Implementation Status

### ✅ Completed
- [x] Project structure and configuration
- [x] NestJS application setup
- [x] Prisma schema with SQLite
- [x] Database models and relationships
- [x] Authentication module (JWT + Passport)
- [x] Customer module with CRUD operations
- [x] Product module with CRUD operations
- [x] Order module with business logic
- [x] API documentation with Swagger
- [x] Error handling and validation
- [x] Database seeding script
- [x] CORS configuration
- [x] Frontend React + Vite setup
- [x] Tailwind CSS styling
- [x] React Router navigation
- [x] Axios API client
- [x] Form validation with React Hook Form + Zod

### 🚧 In Progress
- [ ] Complete frontend components integration
- [ ] Order creation workflow UI
- [ ] Order search functionality UI
- [ ] Order update workflow UI
- [ ] Unit and integration tests
- [ ] End-to-end testing

### 📋 Planned
- [ ] Advanced order features (discounts, tax calculation)
- [ ] User role management UI
- [ ] Customer management UI
- [ ] Product catalog UI
- [ ] Dashboard and analytics
- [ ] Performance optimization
- [ ] Production deployment configuration

## 🏗️ Architecture Highlights

### Clean Architecture Principles
- **Separation of Concerns**: Clear boundaries between modules (auth, customers, products, orders)
- **Dependency Injection**: NestJS DI container for loose coupling
- **Modular Design**: Each feature is a standalone module
- **Single Responsibility**: Each module handles one domain
- **Open/Closed Principle**: Extensible through modules and decorators

### Database Design
- **SQLite**: Lightweight, embedded database perfect for development
- **Prisma ORM**: Type-safe database access with migration management
- **Schema-First**: Database schema drives the application models
- **Audit Trail**: Order history tracking for all changes
- **UUID Primary Keys**: Distributed system ready
- **Cascading Deletes**: Proper data integrity

### Security Features
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Protection**: React auto-escaping, input validation
- **CSRF Protection**: CORS configuration, JWT tokens
- **Password Security**: Bcrypt hashing with strong salt rounds
- **JWT Security**: Access and refresh token pattern
- **Role-Based Access**: Admin and sales executive roles

## 📚 Documentation

### Core Documentation
- **[Product Requirements Document (PRD)](./Customer_Order_Management_PRD.md)** - Complete product requirements including features, user flows, and success metrics
- **[Data Model Document](./DATA_MODEL.md)** - Comprehensive database schema with entity relationships, indexes, and sample data for Prisma/SQLite
- **[Architecture Design Document](./ARCHITECTURE_DESIGN_DOCUMENT.md)** - System architecture covering NestJS backend, React frontend, Prisma database, API, security, and deployment

### API Documentation
- **[Swagger UI](http://localhost:3001/api/docs)** - Interactive API documentation
- **[Swagger JSON](http://localhost:3001/api/docs-json)** - Raw OpenAPI specification

### Database Resources
- **[Prisma Schema](../backend/prisma/schema.prisma)** - Complete Prisma schema with all models
- **[Database Seed Script](../backend/prisma/seed.ts)** - TypeScript seed script for initial data
- **[Prisma Studio](http://localhost:5555)** - Database GUI (run `npx prisma studio` from backend directory)

## 🤝 Contributing

This is an MVP implementation. When contributing:
1. Follow the existing NestJS architecture patterns
2. Create new features as separate modules
3. Write tests for new features using Jest
4. Update Prisma schema when changing data models
5. Run `npm run prisma:generate` after schema changes
6. Update API documentation (Swagger decorators)
7. Follow TypeScript best practices
8. Update relevant documentation files

## 📄 License

Copyright © 2026 Customer Order Management. All rights reserved.

---

**Version**: 2.0.0  
**Status**: Development  
**Last Updated**: July 7, 2026