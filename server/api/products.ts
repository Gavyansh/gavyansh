import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

export function handleProducts(_req: Request, res: Response) {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const products = JSON.parse(data);
      return res.json(products);
    }
  } catch (err) {
    console.error('Products API error:', err);
  }

  res.status(404).json({ error: 'Products file not found' });
}
