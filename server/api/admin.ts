import { Request, Response } from 'express';
import { prisma } from '../db.js';
import { orderToRecord } from '../orderMapper.js';
import { OrderRecord } from './checkout.js';

export interface ProductRecord {
  id: string;
  name: string;
  description: string;
  image: string;
  benefits: string[];
  variants: { weight: string; price: number }[];
}

function productToRecord(p: {
  id: string;
  name: string;
  description: string;
  image: string;
  benefits: unknown;
  variants: unknown;
}): ProductRecord {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    image: p.image,
    benefits: Array.isArray(p.benefits) ? (p.benefits as string[]) : [],
    variants: Array.isArray(p.variants)
      ? (p.variants as { weight: string; price: number }[])
      : [],
  };
}

export async function getProducts(): Promise<ProductRecord[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  return rows.map(productToRecord);
}

export async function handleGetAdminProducts(_req: Request, res: Response) {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    console.error('handleGetAdminProducts:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
}

export async function handlePostAdminProduct(req: Request, res: Response) {
  const product = req.body as Partial<ProductRecord>;

  if (!product.name || !product.id) {
    return res.status(400).json({ error: 'Product name and id are required' });
  }

  const id = String(product.id).trim().toLowerCase().replace(/\s+/g, '-');

  const exists = await prisma.product.findUnique({ where: { id } });
  if (exists) {
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

  await prisma.product.create({
    data: {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      image: newProduct.image,
      benefits: newProduct.benefits,
      variants: newProduct.variants,
    },
  });

  res.json({ success: true, product: newProduct });
}

export async function handlePutAdminProduct(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body as Partial<ProductRecord>;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const cur = productToRecord(existing);
  const updated: ProductRecord = {
    id: existing.id,
    name: updates.name !== undefined ? String(updates.name).trim() : cur.name,
    description: updates.description !== undefined ? String(updates.description).trim() : cur.description,
    image: updates.image !== undefined ? String(updates.image).trim() : cur.image,
    benefits: updates.benefits !== undefined ? updates.benefits.map(String) : cur.benefits,
    variants:
      updates.variants !== undefined
        ? updates.variants.map((v) => ({
            weight: String(v.weight).trim(),
            price: Number(v.price) || 0,
          }))
        : cur.variants,
  };

  await prisma.product.update({
    where: { id },
    data: {
      name: updated.name,
      description: updated.description,
      image: updated.image,
      benefits: updated.benefits,
      variants: updated.variants,
    },
  });

  res.json({ success: true, product: updated });
}

export async function handleDeleteAdminProduct(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    return res.status(404).json({ error: 'Product not found' });
  }
}

export async function handleGetAdminOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const asRecords: OrderRecord[] = orders.map((o) => orderToRecord(o));
  res.json({ success: true, orders: asRecords });
}
