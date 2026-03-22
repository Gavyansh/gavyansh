import { Request, Response } from 'express';
import { prisma } from '../db.js';

export function handleHealth(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

/** Confirms DATABASE_URL + Prisma can query Postgres (use on Railway for debugging). */
export async function handleHealthDb(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('[health/db]', err);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
}
