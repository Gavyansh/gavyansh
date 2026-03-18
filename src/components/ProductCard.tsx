import React, { useState } from 'react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { useCartStore } from '../cartStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-ghee-gold/5 group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ghee-gold text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Premium A2
          </span>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-serif font-bold mb-2">{product.name}</h3>
        <p className="text-ghee-brown/60 text-sm mb-6 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.weight}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedVariant.weight === v.weight
                    ? 'bg-ghee-gold text-white shadow-md'
                    : 'bg-ghee-warm text-ghee-brown/60 hover:bg-ghee-gold/10'
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-ghee-gold">
              ₹{selectedVariant.price}
            </span>
            <span className="text-ghee-brown/40 text-sm">inclusive of taxes</span>
          </div>
        </div>

        <ul className="space-y-2 mb-8">
          {product.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-ghee-brown/70">
              <Check size={14} className="text-ghee-gold" />
              {benefit}
            </li>
          ))}
        </ul>

        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            isAdded 
              ? 'bg-emerald-500 text-white' 
              : 'bg-ghee-brown text-ghee-cream hover:bg-ghee-gold shadow-ghee-brown/10'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={20} />
              Added to Cart
            </>
          ) : (
            <>
              <Plus size={20} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
