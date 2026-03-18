// API base URL - empty for same-origin (local dev, monolithic deploy), or Railway URL for Vercel frontend
export const API_BASE = import.meta.env.VITE_API_URL || '';
