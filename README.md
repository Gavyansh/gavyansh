# Gavyansh Premium Desi Cow Ghee

E-commerce website for Gavyansh Vedic Ghee – premium A2 Desi Cow Ghee, traditionally churned using the Bilona method.

## Features

- **Products**: Browse A2 Vedic Bilona Ghee and Gir Cow Ghee
- **Cart**: Add to cart, quantity control, localStorage persistence
- **Checkout**: Place orders with customer details; email confirmations (when configured)
- **Contact**: Contact form with backend submission and email alerts
- **Data**: PostgreSQL (users, orders, products, contacts) via Prisma

---

## Deploy on Vercel + Railway

### 1. Deploy Backend (Railway)

1. Go to [railway.app](https://railway.app) and sign in
2. **New Project** → **Deploy from GitHub**
3. Select your repo `gavyansh`
4. Railway will detect Node.js. In **Settings**:
   - **Start Command**: `npm run start:api`
   - **Root Directory**: leave default (project root)
5. Add **Environment Variables**:
   - `RESEND_API_KEY` = from [resend.com](https://resend.com) → API Keys (free tier: 100 emails/day)
   - `ORDER_NOTIFY_EMAIL` = your email (e.g. info1gavyansh@gmail.com) for order & contact alerts
   - `ORDER_FROM_EMAIL` = sender address on your verified domain (e.g. `orders@gavyansh.com`)
   - `JWT_SECRET` = a random string for auth tokens (e.g. `openssl rand -hex 32`)
   - **`DATABASE_URL`** = PostgreSQL connection string — add a **PostgreSQL** database in Railway and link it (see [docs/RAILWAY_POSTGRES.md](docs/RAILWAY_POSTGRES.md))
6. Click **Deploy**. When done, copy your app URL (e.g. `https://gavyansh-api-production.up.railway.app`)

### 2. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. **Add New Project** → Import your `gavyansh` GitHub repo
3. Vercel will detect Vite. Verify:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_URL` = your Railway URL (e.g. `https://gavyansh-api-production.up.railway.app`)
   - `VITE_CLOUDINARY_CLOUD_NAME` = from [cloudinary.com](https://cloudinary.com) (for image upload in admin)
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = unsigned preset from Cloudinary Upload settings
5. Click **Deploy**

**Admin product images:** Add Cloudinary variables (see [docs/CLOUDINARY.md](docs/CLOUDINARY.md)) so uploads work in the admin dashboard.

### 3. Add Custom Domain

- **Vercel**: Project → Settings → Domains → Add your domain
- **Railway**: If you use a subdomain for API (e.g. `api.yourdomain.com`), add it in Railway Settings and set `VITE_API_URL` to that

---

## Run Locally

### Development (monolith – frontend + backend together)

1. Copy `.env.example` to `.env` and set **`DATABASE_URL`** (local Postgres, Docker, or Railway’s public URL).
2. Apply migrations: `npx prisma migrate deploy` (or `npm run db:push` for quick local setup).

```bash
npm install
npm run dev
```
Opens at **http://localhost:3000**

### Production build & serve (local)
```bash
npm run build && npm run start
```

### API-only (simulates Railway)
```bash
npm run start:api
```
Backend runs on port 3000. Point frontend at it with `VITE_API_URL=http://localhost:3000`.

---

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/products` | GET | Product catalog |
| `/api/checkout` | POST | Place order |
| `/api/contact` | POST | Submit contact form |

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Local `.env` | Same as Railway – required for API |
| `VITE_API_URL` | Vercel | Railway API URL (empty for local monolith) |
| `VITE_RAZORPAY_KEY_ID` | Vercel | Razorpay Key ID (optional – backend returns it) |
| `PORT` | Railway | Port (set automatically) |
| `DATABASE_URL` | Railway | PostgreSQL connection string (from Railway Postgres plugin) |
| `RESEND_API_KEY` | Railway | Resend API key (resend.com) – Railway blocks SMTP |
| `ORDER_FROM_EMAIL` | Railway | Sender email on verified domain (e.g. orders@gavyansh.com) |
| `ORDER_NOTIFY_EMAIL` | Railway | Your email for order & contact alerts |
| `JWT_SECRET` | Railway | Secret for auth tokens (use a random string in production) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Vercel | Cloudinary cloud name (for admin image upload) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Vercel | Cloudinary unsigned upload preset |
| `RAZORPAY_KEY_ID` | Railway | Razorpay Key ID (from dashboard) |
| `RAZORPAY_KEY_SECRET` | Railway | Razorpay Secret |
| `SHIPROCKET_EMAIL` | Railway | Shiprocket login email |
| `SHIPROCKET_PASSWORD` | Railway | Shiprocket login password |
| `SHIPROCKET_PICKUP_LOCATION` | Railway | Pickup location name (e.g. Primary) |

---

## Testing Payments

### Razorpay (Test Mode)
When using **Test API keys** (rzp_test_xxx):
- **Card:** Use `4111 1111 1111 1111`, any future expiry, any CVV
- **UPI:** Use `success@razorpay` for success, `failure@razorpay` for failure
- No real money is charged

### COD (Cash on Delivery)
Select "Cash on Delivery" at checkout to place an order without payment. The order is created, emails are sent, and a Shiprocket shipment is created. Check your Shiprocket dashboard to verify the order appears.

---

## Database

Uses **PostgreSQL** + **Prisma**. See [docs/DATABASE.md](docs/DATABASE.md) and [docs/RAILWAY_POSTGRES.md](docs/RAILWAY_POSTGRES.md).

---

## Project Structure

```
├── server/           # Backend API handlers
│   └── api/
├── server.ts         # Full server (local dev + monolithic prod)
├── server-railway.ts  # API-only (Railway deploy)
├── prisma/           # Schema + migrations (PostgreSQL)
├── src/              # React frontend
├── vercel.json       # Vercel config
├── railway.json      # Railway start command
└── vite.config.ts
```
