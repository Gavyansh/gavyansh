import { Request, Response } from 'express';
import { getUserFromToken } from './auth.js';
import { prisma } from '../db.js';
import { orderToRecord } from '../orderMapper.js';

export async function handleGetMyOrders(req: Request, res: Response) {
  const user = getUserFromToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Please sign in to view your orders' });
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ userId: user.id }, { customerEmail: { equals: user.email, mode: 'insensitive' } }],
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, orders: orders.map((o) => orderToRecord(o)) });
}
