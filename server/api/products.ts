import { Request, Response } from 'express';
import { getProducts } from './admin.js';

export function handleProducts(_req: Request, res: Response) {
  try {
    const products = getProducts();
    return res.json(products);
  } catch (err) {
    console.error('Products API error:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
}
