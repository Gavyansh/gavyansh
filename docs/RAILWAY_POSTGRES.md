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
