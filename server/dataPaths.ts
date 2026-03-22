import fs from 'fs';
import path from 'path';

/**
 * All JSON data (users, orders, products, contacts) lives here.
 * On Railway: add a Volume and set DATA_DIR to the mount path (e.g. /data)
 * so data survives redeploys. See docs/RAILWAY_DATA.md
 */
export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}
