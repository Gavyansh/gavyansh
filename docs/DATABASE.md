# Database (PostgreSQL + Prisma)

Gavyansh uses **PostgreSQL** with **Prisma ORM**.

## Schema overview

| Model       | Purpose |
|------------|---------|
| `User`     | Sign up / login |
| `Product`  | Catalog (benefits & variants as JSON) |
| `Order`    | Orders |
| `OrderItem`| Line items per order |
| `Contact`  | Contact form submissions |
| `MediaAsset` | Optional URLs for images/videos (gallery, marketing) |

## Railway

See **[RAILWAY_POSTGRES.md](./RAILWAY_POSTGRES.md)**.

## Local Prisma commands

```bash
npx prisma migrate deploy   # apply migrations (production-like)
npx prisma db push          # push schema without migration files (dev only)
npx prisma studio           # GUI for data
```

## Why not store image/video binaries in Postgres?

Storing large BLOBs in the database is usually slower and more expensive than object storage. Recommended flow:

1. Upload files to **Cloudinary** (or S3).
2. Save the returned **URL** in `Product.image` or `MediaAsset.url`.

The `MediaAsset` table is ready for extra media records when you build that UI.
