// API base URL - empty for same-origin (local dev, monolithic deploy), or Railway URL for Vercel frontend
// Must include https:// (e.g. https://gavyansh-production.up.railway.app)
const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
export const API_BASE = raw && !raw.startsWith('http') ? `https://${raw}` : raw;

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Gavyansh] VITE_API_URL is not set. Auth and orders will call your Vercel domain /api/* and fail (SPA HTML).\n' +
      'Set VITE_API_URL in Vercel to your Railway API URL (e.g. https://xxx.up.railway.app) and redeploy.'
  );
}
