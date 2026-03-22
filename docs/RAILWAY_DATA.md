# Persistent data on Railway

User accounts, orders, products, and contacts are stored as JSON files under **`DATA_DIR`** (default: `./data`).

Railway’s filesystem is **ephemeral**: when the service restarts or redeploys, the default `data/` folder is **wiped**. That is why logins “disappear” and you must sign up again.

## Fix: add a Volume

1. Open your **Railway** project → select the **gavyansh** service.
2. Go to **Settings** → **Volumes** → **Add volume**.
3. **Mount path:** `/data` (recommended).
4. Save and redeploy.

5. Add this **environment variable** on the same service:

| Name | Value |
|------|--------|
| `DATA_DIR` | `/data` |

6. Redeploy again.

All JSON files (`users.json`, `orders.json`, `products.json`, `contacts.json`) will be written under `/data` and **persist** across deploys.

## Local development

Leave `DATA_DIR` unset; the app uses `./data` next to the project root.
