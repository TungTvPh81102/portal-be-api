# Enterprise Backend API

Backend API enterprise-grade được xây dựng với **Node.js**, **TypeScript**, **Fastify**, **Prisma ORM**, và **PostgreSQL**.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Kiến Trúc](#-kiến-trúc)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [API Documentation](#-api-documentation)
- [Tạo Module Mới](#-tạo-module-mới)
- [Best Practices](#-best-practices)
- [Database Schema](#-database-schema)

---

## ✨ Tính Năng

- ✅ **Module-based Architecture** - Kiến trúc module rõ ràng, dễ mở rộng
- ✅ **TypeScript Strict Mode** - Type-safe, giảm lỗi runtime
- ✅ **Prisma ORM** - Type-safe database queries
- ✅ **JWT Authentication** - Xác thực bảo mật với JWT
- ✅ **Standardized Response** - Format response thống nhất
- ✅ **Global Error Handling** - Xử lý lỗi tập trung
- ✅ **Validation with Zod** - Runtime validation
- ✅ **RBAC Ready** - Sẵn sàng cho Role-Based Access Control
- ✅ **Graceful Shutdown** - Đóng kết nối database an toàn

---

## 🏗️ Kiến Trúc

### Module-Based Architecture

Mỗi module tuân theo pattern:

```
route → controller → service → repository → database
```

**Nguyên tắc:**

- **Route**: Định nghĩa endpoints và middleware
- **Controller**: Nhận request, validate input, gọi service
- **Service**: Business logic, orchestrate repositories, handle transactions
- **Repository**: Database operations ONLY (no business logic)
- **Schema**: Zod validation schemas

### Prisma Client Singleton

- Prisma Client được khởi tạo **một lần duy nhất**
- Được import từ `src/config/prisma.ts`
- **KHÔNG** import `@prisma/client` trực tiếp trong controller

### Response Format

**Success Response:**

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "OPTIONAL_CODE"
}
```

---

## 📁 Cấu Trúc Thư Mục

```
portal-be-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   ├── env.ts            # Environment config với Zod validation
│   │   └── prisma.ts         # Prisma Client singleton
│   ├── common/
│   │   ├── errors/
│   │   │   ├── AppError.ts   # Custom error classes
│   │   │   └── errorHandler.ts # Global error handler
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts # JWT authentication
│   │   ├── response/
│   │   │   └── response.helper.ts # Response helpers
│   │   └── utils/
│   │       ├── bcrypt.helper.ts   # Password hashing
│   │       └── jwt.helper.ts      # JWT utilities
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.schema.ts     # Zod schemas
│   │   │   ├── user.repository.ts # Database operations
│   │   │   ├── user.service.ts    # Business logic
│   │   │   ├── user.controller.ts # Request handlers
│   │   │   └── user.route.ts      # Route definitions
│   │   └── auth/
│   │       ├── auth.schema.ts
│   │       ├── auth.service.ts
│   │       ├── auth.controller.ts
│   │       └── auth.route.ts
│   ├── routes.ts             # Centralized route registration
│   ├── app.ts                # Fastify app setup
│   └── server.ts             # Server entry point
├── .env.example              # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 Yêu Cầu Hệ Thống

- **Node.js**: 20.x hoặc cao hơn
- **PostgreSQL**: 14.x hoặc cao hơn
- **npm** hoặc **yarn** hoặc **pnpm**

---

## 🚀 Cài Đặt

### 1. Clone repository

```bash
cd portal-be-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database

Tạo database PostgreSQL:

```sql
CREATE DATABASE portal_db;
```

### 4. Configure environment

Copy `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/portal_db?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

### 5. Run migrations

```bash
npm run prisma:migrate
```

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

---

## ⚙️ Cấu Hình

### Environment Variables

| Variable         | Description                               | Default     | Required |
| ---------------- | ----------------------------------------- | ----------- | -------- |
| `DATABASE_URL`   | PostgreSQL connection string              | -           | ✅       |
| `PORT`           | Server port                               | 3000        | ❌       |
| `NODE_ENV`       | Environment (development/production/test) | development | ❌       |
| `JWT_SECRET`     | JWT secret key (min 32 chars)             | -           | ✅       |
| `JWT_EXPIRES_IN` | JWT expiration time                       | 7d          | ❌       |
| `BCRYPT_ROUNDS`  | Bcrypt salt rounds                        | 10          | ❌       |

---

## 🏃 Chạy Ứng Dụng

### Development Mode (with hot reload)

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

Sử dụng Bearer token trong header:

```
Authorization: Bearer <your-jwt-token>
```

---

### 🔐 Auth Endpoints

#### 1. Register

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  }
}
```

#### 2. Login

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt-token"
  }
}
```

#### 3. Get Current User

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 👤 User Endpoints

#### 1. Create User

**POST** `/api/users`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Jane Doe"
}
```

#### 2. Get All Users

**GET** `/api/users?page=1&limit=10`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

#### 3. Get User by ID

**GET** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 4. Update User

**PUT** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "isActive": true
}
```

#### 5. Delete User

**DELETE** `/api/users/:id`

**Headers:**

```
Authorization: Bearer <token>
```

---

### 🏥 Health Check

**GET** `/health`

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔨 Tạo Module Mới

### Bước 1: Tạo thư mục module

```bash
mkdir -p src/modules/product
```

### Bước 2: Tạo schema (Zod validation)

**`src/modules/product/product.schema.ts`**

```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
```

### Bước 3: Tạo repository (Database operations)

**`src/modules/product/product.repository.ts`**

```typescript
import { Product } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class ProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({ data });
  }
}
```

### Bước 4: Tạo service (Business logic)

**`src/modules/product/product.service.ts`**

```typescript
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './product.schema';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getAllProducts() {
    return this.productRepository.findAll();
  }

  async createProduct(data: CreateProductDto) {
    // Business logic here
    return this.productRepository.create(data);
  }
}
```

### Bước 5: Tạo controller (Request handling)

**`src/modules/product/product.controller.ts`**

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from './product.service';
import { createProductSchema } from './product.schema';
import { successResponse } from '../../common/response/response.helper';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (request: FastifyRequest, reply: FastifyReply) => {
    const validatedData = createProductSchema.parse(request.body);
    const product = await this.productService.createProduct(validatedData);
    return successResponse(reply, product, 'Product created', 201);
  };
}
```

### Bước 6: Tạo routes

**`src/modules/product/product.route.ts`**

```typescript
import { FastifyInstance } from 'fastify';
import { ProductController } from './product.controller';

export const productRoutes = async (fastify: FastifyInstance) => {
  const controller = new ProductController();

  fastify.post('/products', controller.createProduct);
};
```

### Bước 7: Register routes

**`src/routes.ts`**

```typescript
import { productRoutes } from './modules/product/product.route';

// Inside registerRoutes function:
await instance.register(productRoutes, { prefix: '/api' });
```

---

## 🎯 Best Practices

### 1. Error Handling

**Service layer:**

```typescript
import { NotFoundError, BusinessError } from '../../common/errors/AppError';

// Throw custom errors
if (!user) {
  throw new NotFoundError('User not found');
}

if (user.balance < amount) {
  throw new BusinessError('Insufficient balance');
}
```

**Controller layer:**

```typescript
// NO try/catch needed - global error handler will catch
const user = await this.userService.getUserById(id);
return successResponse(reply, user, 'Success');
```

### 2. Transactions

**Service layer only:**

```typescript
import { prisma } from '../../config/prisma';

async transferMoney(fromId: string, toId: string, amount: number) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });

    await tx.user.update({
      where: { id: toId },
      data: { balance: { increment: amount } }
    });
  });
}
```

### 3. Raw SQL (khi cần)

```typescript
async getComplexReport() {
  return prisma.$queryRaw`
    SELECT u.name, COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY order_count DESC
  `;
}
```

### 4. Response Helpers

**LUÔN dùng helpers:**

```typescript
// ✅ ĐÚNG
return successResponse(reply, data, 'Success');
return errorResponse(reply, 'Error', 400, 'ERROR_CODE');

// ❌ SAI
return reply.send({ success: true, data });
```

### 5. Validation

**Validate tất cả input:**

```typescript
// Validate body
const validatedData = createUserSchema.parse(request.body);

// Validate params
const { id } = userIdParamSchema.parse(request.params);

// Validate query
const { page, limit } = paginationSchema.parse(request.query);
```

---

## 🗄️ Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  roles    UserRole[]
  sessions Session[]

  @@index([email])
  @@map("users")
}
```

### Role Model (RBAC)

```prisma
model Role {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       UserRole[]
  permissions RolePermission[]

  @@map("roles")
}
```

### Permission Model

```prisma
model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  resource    String
  action      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  roles RolePermission[]

  @@unique([resource, action])
  @@map("permissions")
}
```

---

## 📝 Scripts

```json
{
  "dev": "tsx watch src/server.ts", // Development với hot reload
  "build": "tsc", // Build production
  "start": "node dist/server.js", // Run production
  "prisma:generate": "prisma generate", // Generate Prisma Client
  "prisma:migrate": "prisma migrate dev", // Run migrations (dev)
  "prisma:deploy": "prisma migrate deploy", // Deploy migrations (prod)
  "prisma:studio": "prisma studio" // Open Prisma Studio
}
```

---

## 🔒 Security Checklist

- ✅ Password hashing với bcrypt
- ✅ JWT authentication
- ✅ Environment variables validation
- ✅ SQL injection protection (Prisma)
- ✅ Input validation (Zod)
- ✅ Error messages không leak sensitive info
- ⚠️ CORS configuration (cần config cho production)
- ⚠️ Rate limiting (nên thêm)
- ⚠️ Helmet middleware (nên thêm)

---

## 📄 License

MIT

---

## 👨‍💻 Author

Enterprise Backend Team

---

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub repository.
