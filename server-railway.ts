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
import { handleProducts } from './server/api/products';
import { handleHealth } from './server/api/health';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// API Routes
app.get('/api/health', handleHealth);
app.get('/api/products', handleProducts);
app.post('/api/checkout', handleCheckout);
  app.post('/api/create-order', handleCreateOrder);
  app.post('/api/verify-payment', handleVerifyPayment);
  app.post('/api/contact', handleContact);

// Serve images (for /images/* used in product data)
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gavyansh API running on port ${PORT}`);
});
