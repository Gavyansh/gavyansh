import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gavyansh-vedic-secret-change-in-production';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

function hashPassword(password: string): string {
  return crypto.scryptSync(password, 'gavyansh-salt', 64).toString('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  try {
    const h = hashPassword(password);
    const a = Buffer.from(h, 'hex');
    const b = Buffer.from(hash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getUserFromToken(req: Request): { id: string; email: string; name: string } | null {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    return { id: payload.userId, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export async function handleSignup(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['email', 'password', 'name'],
    });
  }

  const emailStr = String(email).trim().toLowerCase();
  const nameStr = String(name).trim();
  const passwordStr = String(password);

  if (passwordStr.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await prisma.user.findUnique({ where: { email: emailStr } });
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const user = await prisma.user.create({
    data: {
      id: `user-${Date.now()}`,
      email: emailStr,
      name: nameStr,
      passwordHash: hashPassword(passwordStr),
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

export async function handleLogin(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password',
    });
  }

  const emailStr = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: emailStr } });

  if (!user || !verifyPassword(String(password), user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    success: true,
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
