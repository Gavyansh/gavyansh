/**
 * API-only server for Railway deployment.
 * Frontend is deployed separately on Vercel.
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { handleCheckout } from './server/api/checkout';
import { handleContact } from './server/api/contact';
import { handleCreateOrder, handleVerifyPayment } from './server/api/razorpay';
import { handlePlaceOrderCOD } from './server/api/cod';
import { handleProducts } from './server/api/products';
import { handleHealth } from './server/api/health';
import { handleSignup, handleLogin } from './server/api/auth';
import { handleGetMyOrders } from './server/api/orders';
import {
  handleGetAdminProducts,
  handlePostAdminProduct,
  handlePutAdminProduct,
  handleDeleteAdminProduct,
  handleGetAdminOrders,
} from './server/api/admin';

import { bootstrapDatabase } from './server/bootstrapDb.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const app = express();

// Handle CORS preflight (OPTIONS) - must be before other middleware
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Routes
app.get('/api/health', handleHealth);
app.get('/api/products', handleProducts);
app.post('/api/auth/signup', handleSignup);
app.post('/api/auth/login', handleLogin);
app.get('/api/orders', handleGetMyOrders);
app.get('/api/admin/products', handleGetAdminProducts);
app.post('/api/admin/products', handlePostAdminProduct);
app.put('/api/admin/products/:id', handlePutAdminProduct);
app.delete('/api/admin/products/:id', handleDeleteAdminProduct);
app.get('/api/admin/orders', handleGetAdminOrders);
app.post('/api/checkout', handleCheckout);
  app.post('/api/create-order', handleCreateOrder);
  app.post('/api/verify-payment', handleVerifyPayment);
  app.post('/api/place-order-cod', handlePlaceOrderCOD);
  app.post('/api/contact', handleContact);

// Serve images (for /images/* used in product data)
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

async function start() {
  await bootstrapDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gavyansh API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
