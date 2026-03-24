import { Request, Response } from 'express';
import { prisma } from '../db.js';

export type ReviewPayload = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

function rowToPayload(r: { id: string; name: string; rating: number; comment: string; date: string }): ReviewPayload {
  return {
    id: r.id,
    name: r.name,
    rating: Math.min(5, Math.max(1, r.rating)),
    comment: r.comment,
    date: r.date,
  };
}

/** Public + admin list */
export async function handleGetReviews(_req: Request, res: Response) {
  try {
    const rows = await prisma.review.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows.map(rowToPayload));
  } catch (err) {
    console.error('handleGetReviews:', err);
    res.status(500).json({ error: 'Failed to load reviews' });
  }
}

export async function handlePostAdminReview(req: Request, res: Response) {
  const body = req.body as Partial<ReviewPayload>;
  const name = String(body.name || '').trim();
  const comment = String(body.comment || '').trim();
  const date = String(body.date || '').trim() || new Date().toISOString().slice(0, 10);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    const created = await prisma.review.create({
      data: { name, rating, comment, date },
    });
    res.json({ success: true, review: rowToPayload(created) });
  } catch (err) {
    console.error('handlePostAdminReview:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
}

export async function handlePutAdminReview(req: Request, res: Response) {
  const { id } = req.params;
  const body = req.body as Partial<ReviewPayload>;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Review not found' });
  }

  const name = body.name !== undefined ? String(body.name).trim() : existing.name;
  const comment = body.comment !== undefined ? String(body.comment).trim() : existing.comment;
  const date = body.date !== undefined ? String(body.date).trim() : existing.date;
  const rating =
    body.rating !== undefined ? Math.min(5, Math.max(1, Number(body.rating) || existing.rating)) : existing.rating;

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    const updated = await prisma.review.update({
      where: { id },
      data: { name, rating, comment, date },
    });
    res.json({ success: true, review: rowToPayload(updated) });
  } catch (err) {
    console.error('handlePutAdminReview:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
}

export async function handleDeleteAdminReview(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.review.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    return res.status(404).json({ error: 'Review not found' });
  }
}
