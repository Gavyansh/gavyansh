import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { API_BASE } from '../api';
import { Product } from '../types';

const Products = () => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Our Products | Gavyansh Vedic Ghee Shop</title>
        <meta name="description" content="Browse our range of premium Gavyansh A2 Desi Cow Ghee products. Available in various sizes from 250ml to 1L. Traditionally churned and 100% pure." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-20">
          <div className="text-center lg:text-left flex-1 max-w-3xl mx-auto lg:mx-0">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
            >
              The Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif font-bold mt-4"
            >
              Gavyansh <span className="italic text-ghee-gold">Vedic Ghee</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-ghee-brown/60 max-w-2xl mx-auto lg:mx-0 mt-6"
            >
              Every jar of our ghee is a result of patience, tradition, and purity. Churned using the ancient Bilona method for maximum nutrition and flavor.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="shrink-0 w-full max-w-sm mx-auto lg:mx-0 lg:text-right lg:self-start rounded-2xl border border-ghee-gold/20 bg-ghee-warm/50 p-6 md:p-7"
          >
            <p className="text-ghee-brown text-sm md:text-base font-medium leading-snug">
              Want to do ghee business or place bulk order?{' '}
              <span className="text-ghee-brown/90">Contact here.</span>
            </p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto lg:ml-auto rounded-xl bg-ghee-brown text-ghee-cream px-6 py-3 text-sm font-bold hover:bg-ghee-gold hover:text-ghee-brown transition-colors shadow-md"
            >
              <MessageCircle size={18} />
              Contact us
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Quality Assurance */}
        <div className="mt-32 bg-ghee-brown text-ghee-cream rounded-[40px] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-4xl font-serif font-bold text-ghee-gold mb-4">100%</h3>
              <p className="text-sm uppercase tracking-widest text-ghee-cream/60">Natural & Pure</p>
            </div>
            <div>
              <h3 className="text-4xl font-serif font-bold text-ghee-gold mb-4">Bilona</h3>
              <p className="text-sm uppercase tracking-widest text-ghee-cream/60">Traditional Method</p>
            </div>
            <div>
              <h3 className="text-4xl font-serif font-bold text-ghee-gold mb-4">A2</h3>
              <p className="text-sm uppercase tracking-widest text-ghee-cream/60">Gir Cow Milk</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-ghee-gold/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
        </div>
      </div>
    </div>
  );
};

export default Products;
