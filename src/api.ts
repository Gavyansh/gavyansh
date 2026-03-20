// API base URL - empty for same-origin (local dev, monolithic deploy), or Railway URL for Vercel frontend
// Must include https:// (e.g. https://gavyansh-production.up.railway.app)
const raw = import.meta.env.VITE_API_URL || '';
export const API_BASE = raw && !raw.startsWith('http') ? `https://${raw}` : raw;
