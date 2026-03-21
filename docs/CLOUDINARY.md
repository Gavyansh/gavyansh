# Cloudinary setup (admin product images)

Image uploads in **Admin → Products** use [Cloudinary](https://cloudinary.com) from the browser. No backend changes are required.

## 1. Create a Cloudinary account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier is enough).
2. After login, open the **Dashboard**.

## 2. Copy your Cloud name

On the Dashboard you’ll see:

- **Cloud name** — e.g. `dabc123xyz` (not your email).

You will use this as **`VITE_CLOUDINARY_CLOUD_NAME`**.

## 3. Create an unsigned upload preset

1. In the Cloudinary console: **Settings** (gear) → **Upload** (or **Upload** → **Upload presets**).
2. Click **Add upload preset** (or **New upload preset**).
3. Set:
   - **Upload preset name** — e.g. `gavyansh_products` (remember it exactly).
   - **Signing mode** — **Unsigned** (required for browser uploads without a server secret).
4. Optional but recommended:
   - **Folder** — e.g. `gavyansh/products` to keep uploads organized.
   - **Allowed formats** — restrict to `jpg`, `png`, `webp` if you want.
5. **Save** the preset.

You will use the preset **name** as **`VITE_CLOUDINARY_UPLOAD_PRESET`**.

## 4. Add environment variables to Vercel

1. **Vercel** → your project → **Settings** → **Environment Variables**.
2. Add:

| Name | Value | Example |
|------|--------|---------|
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloud name from the Dashboard | `dabc123xyz` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | The preset name you created | `gavyansh_products` |

3. Apply to **Production** (and **Preview** if you use previews).
4. **Redeploy** the project (Deployments → … → Redeploy) so the build picks up the new variables.

`VITE_*` variables are embedded at **build time**, so a new deploy is required after changing them.

## 5. Local development

Create or edit `.env` in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

Restart `npm run dev`.

## 6. Verify it works

1. Open the site → triple-click the logo → **Admin** (or go to `/admin` after unlocking).
2. **Products** → **Add Product** or edit a product → **Upload Image**.
3. If Cloudinary is configured, you see **Upload Image**; if not, you see a **URL** field and a tip about the env vars.

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| Still shows URL field | Env vars missing on Vercel or redeploy not done after adding them. |
| `Upload failed` / 401 | Preset must be **Unsigned**; name must match exactly (case-sensitive). |
| `Upload failed` / 400 | File type/size (max 5MB in our UI); or preset restrictions in Cloudinary. |

## Security note

Unsigned presets allow uploads from your frontend with only the preset name. For production hardening later, you can switch to **signed uploads** using Cloudinary’s API secret on the server only (requires code changes).
