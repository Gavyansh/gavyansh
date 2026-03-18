# Gavyansh Premium Desi Cow Ghee

E-commerce website for Gavyansh Vedic Ghee – premium A2 Desi Cow Ghee, traditionally churned using the Bilona method.

## Features

- **Products**: Browse A2 Vedic Bilona Ghee and Gir Cow Ghee
- **Cart**: Add to cart, quantity control, localStorage persistence
- **Checkout**: Place orders with customer details; email confirmations (when configured)
- **Contact**: Contact form with backend submission and email alerts
- **Order & Contact Storage**: Data saved in `data/` (JSON) for records

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
   - `EMAIL_USER` = your Gmail
   - `EMAIL_PASS` = Gmail App Password
6. Click **Deploy**. When done, copy your app URL (e.g. `https://gavyansh-api-production.up.railway.app`)

### 2. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. **Add New Project** → Import your `gavyansh` GitHub repo
3. Vercel will detect Vite. Verify:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = your Railway URL (e.g. `https://gavyansh-api-production.up.railway.app`)
5. Click **Deploy**

### 3. Add Custom Domain

- **Vercel**: Project → Settings → Domains → Add your domain
- **Railway**: If you use a subdomain for API (e.g. `api.yourdomain.com`), add it in Railway Settings and set `VITE_API_URL` to that

---

## Run Locally

### Development (monolith – frontend + backend together)
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
| `VITE_API_URL` | Vercel | Railway API URL (empty for local monolith) |
| `PORT` | Railway | Port (Railway sets this automatically) |
| `EMAIL_USER` | Railway | Gmail for order/contact emails |
| `EMAIL_PASS` | Railway | Gmail App Password |

---

## Project Structure

```
├── server/           # Backend API handlers
│   └── api/
├── server.ts         # Full server (local dev + monolithic prod)
├── server-railway.ts  # API-only (Railway deploy)
├── src/              # React frontend
├── data/             # JSON storage
├── vercel.json       # Vercel config
├── railway.json      # Railway start command
└── vite.config.ts
```
