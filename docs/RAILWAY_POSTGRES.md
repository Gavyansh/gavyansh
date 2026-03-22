# PostgreSQL on Railway (Gavyansh)

The API uses **Prisma** with **PostgreSQL**. JSON files are no longer used for users, orders, or products.

## 1. Create the database

1. In [Railway](https://railway.app), open your project.
2. Click **+ New** → **Database** → **PostgreSQL**.
3. After it provisions, open the **PostgreSQL** service → **Variables**.
4. Copy **`DATABASE_URL`** (or use **Connect** and add the variable to your app).

## 2. Link `DATABASE_URL` to the API

1. Open your **gavyansh** (Node/API) service.
2. **Variables** → **Add Variable** → **Reference** → select the Postgres service’s `DATABASE_URL`, **or** paste the connection string manually.

Railway often auto-injects `DATABASE_URL` when you connect services—check that your API service has `DATABASE_URL` set.

## 3. Deploy

On each deploy, `npm run start:api` runs:

1. `prisma migrate deploy` — applies migrations (creates tables).
2. `tsx server-railway.ts` — starts the API and seeds default products if the catalog is empty.

## 4. Local development

1. Install PostgreSQL locally, or use a free cloud DB (Neon, Supabase, etc.).
2. In project root `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gavyansh"
```

3. First-time setup:

```bash
npx prisma migrate deploy
# or during dev:
npx prisma db push
npm run dev
```

## Images & videos

- Product images stay as **URLs** (e.g. Cloudinary) in the `Product.image` field.
- Optional: use the `MediaAsset` table to store extra image/video URLs for galleries or future features (`kind`: `image` | `video`).

## Migrations

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name describe_change
```

Commit the `prisma/migrations` folder and deploy.

## Troubleshooting: login works once / “Invalid email or password”

1. **Vercel must have `VITE_API_URL`** set to your **Railway API URL** (e.g. `https://your-service.up.railway.app`), then **redeploy** the frontend.  
   If it is missing, the browser calls `/api/*` on **Vercel** (static SPA), not Railway — sign-up/login will not hit your database reliably. Open the browser **Console** on your live site: you should see a warning if `VITE_API_URL` was not set at build time.

2. **Same environment**: Registering on **localhost** uses your **local** Postgres; the **production** site uses **Railway’s** Postgres. Use the same site (or same API URL) for sign-up and sign-in.

3. **Check DB from Railway**: open `https://YOUR-RAILWAY-URL/api/health/db` — expect `{ "status": "ok", "database": "connected" }`. If you get `503`, fix `DATABASE_URL` on the API service.

4. **Inspect users** (optional): run `npx prisma studio` locally with `DATABASE_URL` pointed at Railway’s **public** connection string (from Postgres **Connect** tab), and check the `User` table.
