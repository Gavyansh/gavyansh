import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { handleCheckout } from './server/api/checkout';
import { handleContact } from './server/api/contact';
import { handleProducts } from './server/api/products';
import { handleHealth } from './server/api/health';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', handleHealth);
  app.get('/api/products', handleProducts);
  app.post('/api/checkout', handleCheckout);
  app.post('/api/contact', handleContact);

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
