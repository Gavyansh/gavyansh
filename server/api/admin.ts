import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { OrderRecord } from './checkout.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  image: string;
  benefits: string[];
  variants: { weight: string; price: number }[];
}

const DEFAULT_PRODUCTS: ProductRecord[] = [
  {
    id: 'a2-desi-ghee',
    name: 'A2 Vedic Bilona Ghee',
    description: 'Traditionally churned from the curd of A2 milk of grass-fed Desi Cows. Rich in aroma and granular in texture.',
    image: '/images/D2.jpeg',
    benefits: ['Rich in A2 Protein', 'Bilona Method', 'No Preservatives'],
    variants: [
      { weight: '500ml', price: 850 },
      { weight: '1L', price: 1600 },
    ],
  },
  {
    id: 'gir-cow-ghee',
    name: 'Gir Cow Ghee',
    description: 'Pure and authentic Gir Cow Ghee, traditionally churned for maximum health benefits and superior taste.',
    image: '/images/D1.jpeg',
    benefits: ['Pure Gir Cow Milk', 'Traditionally Churned', 'Superior Taste'],
    variants: [
      { weight: '500ml', price: 950 },
      { weight: '1L', price: 1800 },
    ],
  },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getProducts(): ProductRecord[] {
  ensureDataDir();
  if (fs.existsSync(PRODUCTS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    } catch {
      return [...DEFAULT_PRODUCTS];
    }
  }
  return [...DEFAULT_PRODUCTS];
}

function saveProducts(products: ProductRecord[]) {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function getOrders(): OrderRecord[] {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function handleGetAdminProducts(_req: Request, res: Response) {
  const products = getProducts();
  res.json(products);
}

export async function handlePostAdminProduct(req: Request, res: Response) {
  const product = req.body as Partial<ProductRecord>;

  if (!product.name || !product.id) {
    return res.status(400).json({ error: 'Product name and id are required' });
  }

  const products = getProducts();
  const id = String(product.id).trim().toLowerCase().replace(/\s+/g, '-');

  if (products.some((p) => p.id === id)) {
    return res.status(400).json({ error: 'A product with this ID already exists' });
  }

  const newProduct: ProductRecord = {
    id,
    name: String(product.name).trim(),
    description: String(product.description || '').trim(),
    image: String(product.image || '/images/D2.jpeg').trim(),
    benefits: Array.isArray(product.benefits) ? product.benefits.map(String) : [],
    variants: Array.isArray(product.variants)
      ? product.variants.map((v) => ({
          weight: String(v.weight).trim(),
          price: Number(v.price) || 0,
        }))
      : [{ weight: '500ml', price: 0 }],
  };

  products.push(newProduct);
  saveProducts(products);
  res.json({ success: true, product: newProduct });
}

export async function handlePutAdminProduct(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body as Partial<ProductRecord>;

  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = products[index];
  const updated: ProductRecord = {
    id: existing.id,
    name: updates.name !== undefined ? String(updates.name).trim() : existing.name,
    description: updates.description !== undefined ? String(updates.description).trim() : existing.description,
    image: updates.image !== undefined ? String(updates.image).trim() : existing.image,
    benefits: updates.benefits !== undefined ? updates.benefits.map(String) : existing.benefits,
    variants:
      updates.variants !== undefined
        ? updates.variants.map((v) => ({
            weight: String(v.weight).trim(),
            price: Number(v.price) || 0,
          }))
        : existing.variants,
  };

  products[index] = updated;
  saveProducts(products);
  res.json({ success: true, product: updated });
}

export async function handleDeleteAdminProduct(req: Request, res: Response) {
  const { id } = req.params;
  const products = getProducts().filter((p) => p.id !== id);
  if (products.length === getProducts().length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveProducts(products);
  res.json({ success: true });
}

export async function handleGetAdminOrders(_req: Request, res: Response) {
  const orders = getOrders();
  orders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  res.json({ success: true, orders });
}
