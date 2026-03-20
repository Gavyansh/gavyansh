import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getUserFromToken } from './auth.js';
import { OrderRecord } from './checkout.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function getOrders(): OrderRecord[] {
  if (!fs.existsSync(ORDERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
}

export async function handleGetMyOrders(req: Request, res: Response) {
  const user = getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Please sign in to view your orders' });
  }

  const orders = getOrders();
  const myOrders = orders.filter(
    (o) =>
      (o.userId && o.userId === user.id) ||
      (o.customer?.email?.toLowerCase() === user.email.toLowerCase())
  );

  // Sort by date descending
  myOrders.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  res.json({ success: true, orders: myOrders });
}
