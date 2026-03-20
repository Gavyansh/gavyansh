# Database Migration Guide

## Current Setup (JSON Files)

Products, orders, and users are stored in `data/*.json`. This works for small scale but has limitations:

- **No concurrent writes** – risk of data loss with multiple requests
- **Ephemeral on Railway** – Railway's default filesystem is ephemeral; files may be lost on redeploy/restart
- **No scaling** – JSON files don't scale for many orders or users
- **No relationships** – harder to query (e.g. "all orders for user X")

## When to Switch to a Database

Consider migrating when:

- You have more than ~100 orders or expect growth
- You need reliable persistence (Railway volumes help but aren't ideal for structured data)
- You want reporting, analytics, or complex queries
- You need transactions (e.g. deduct stock on order)

## Recommended: PostgreSQL

**Why PostgreSQL:** Railway has native PostgreSQL, it's robust, and widely used for e-commerce.

### Suggested Schema

```sql
-- Users (replace auth JSON)
users: id, email, name, password_hash, created_at

-- Products (replace products.json)
products: id, name, description, image, benefits (jsonb), created_at
product_variants: id, product_id, weight, price

-- Orders (replace orders.json)
orders: id, user_id, customer_name, customer_email, customer_phone, customer_address, 
        total, payment_method, razorpay_payment_id, created_at
order_items: id, order_id, product_id, weight, price, quantity
```

### Tools

- **Prisma** – easy to use, type-safe, migrations
- **Drizzle** – lightweight, SQL-like
- **Raw pg** – simple, no ORM

### Railway Setup

1. Add PostgreSQL addon in Railway project
2. Use `DATABASE_URL` from the addon
3. Run migrations on deploy
4. Update API handlers to use DB instead of JSON

## Alternative: MongoDB

If you prefer document-based storage:

- **MongoDB Atlas** – free tier, or Railway MongoDB addon
- Schema maps naturally to current JSON structure
- Good for flexible schema

## Migration Order

1. Set up PostgreSQL (or MongoDB) on Railway
2. Add Prisma/Drizzle and define schema
3. Migrate products first (read-heavy, simpler)
4. Migrate users and auth
5. Migrate orders last (most critical)

## Quick Start with Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

Add to `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  image       String
  benefits    Json     @default("[]")
  variants    Json     @default("[]")
  createdAt   DateTime @default(now())
}
```

Then run `npx prisma migrate dev` and update your API handlers.
