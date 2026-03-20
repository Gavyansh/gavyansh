import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { handleCheckout } from './server/api/checkout';
import { handleContact } from './server/api/contact';
import { handleProducts } from './server/api/products';
import { handleHealth } from './server/api/health';
import { handleCreateOrder, handleVerifyPayment } from './server/api/razorpay';
import { handlePlaceOrderCOD } from './server/api/cod';
import { handleSignup, handleLogin } from './server/api/auth';
import { handleGetMyOrders } from './server/api/orders';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', handleHealth);
  app.get('/api/products', handleProducts);
  app.post('/api/auth/signup', handleSignup);
  app.post('/api/auth/login', handleLogin);
  app.get('/api/orders', handleGetMyOrders);
  app.post('/api/checkout', handleCheckout);
  app.post('/api/create-order', handleCreateOrder);
  app.post('/api/verify-payment', handleVerifyPayment);
  app.post('/api/place-order-cod', handlePlaceOrderCOD);
  app.post('/api/contact', handleContact);

  // Serve static assets from public/ (images, etc.)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Dev: Vite middleware | Prod: Serve static build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  Gavyansh server running at http://localhost:${PORT}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('  Mode: production (serving built files)\n');
    } else {
      console.log('  Mode: development (Vite HMR enabled)\n');
    }
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
