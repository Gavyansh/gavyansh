import { prisma } from './db.js';
import { DEFAULT_PRODUCTS } from './defaultProducts.js';

export async function bootstrapDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not set. Add a PostgreSQL database in Railway and link DATABASE_URL, or set it in .env for local dev.'
    );
  }
  await prisma.$connect();

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const p of DEFAULT_PRODUCTS) {
      const imgs = 'images' in p && Array.isArray((p as { images: string[] }).images)
        ? (p as { images: string[] }).images
        : [p.image];
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          description: p.description,
          image: p.image,
          images: imgs,
          benefits: p.benefits,
          variants: p.variants,
        },
      });
    }
    console.log('Database: seeded default products');
  }
}
