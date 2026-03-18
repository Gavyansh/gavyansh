import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, Star, Shield, Award, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS, BENEFITS, REVIEWS } from '../constants';
import ProductCard from '../components/ProductCard';

const Home = () => {
  return (
    <div className="pt-20">
      <Helmet>
        <title>Gavyansh | Go the Vedic Way | Authentic A2 Desi Cow Ghee</title>
        <meta name="description" content="Gavyansh: Go the Vedic Way. Discover the purest A2 Desi Cow Ghee churned using traditional Bilona method. Healthy, organic, and premium quality ghee." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=2000"
            alt="Vedic Farm"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ghee-cream/0 via-ghee-cream/50 to-ghee-cream" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs mb-6"
            >
              Go the Vedic Way
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-serif font-bold text-ghee-brown leading-[0.9] mb-8"
            >
              Gavyansh: Pure Gold for Your <span className="italic text-ghee-gold">Well-being.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-ghee-brown/70 mb-10 leading-relaxed"
            >
              Experience the authentic taste of A2 Desi Cow Ghee, traditionally churned using the Bilona method from grass-fed Gir cows.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="bg-ghee-brown text-ghee-cream px-10 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all flex items-center gap-2 shadow-xl shadow-ghee-brown/20"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="bg-white text-ghee-brown border border-ghee-gold/20 px-10 py-4 rounded-full font-bold hover:bg-ghee-warm transition-all"
              >
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Shield, title: '100% Pure', desc: 'No additives or preservatives' },
              { icon: Award, title: 'Bilona Method', desc: 'Traditionally hand-churned' },
              { icon: Leaf, title: 'Grass Fed', desc: 'Happy cows, healthy ghee' },
              { icon: Star, title: 'A2 Certified', desc: 'Pure Gir cow A2 milk' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-ghee-warm rounded-2xl flex items-center justify-center mx-auto mb-6 text-ghee-gold">
                  <feature.icon size={32} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-ghee-brown/60 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-ghee-warm/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-ghee-gold font-bold tracking-widest uppercase text-xs">Our Collection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">Premium Vedic Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Preview */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-ghee-gold font-bold tracking-widest uppercase text-xs">Health Benefits</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-8">Why Choose A2 Desi Ghee?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {BENEFITS.slice(0, 4).map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-ghee-warm rounded-full flex items-center justify-center text-ghee-gold">
                      <benefit.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ghee-brown mb-1">{benefit.title}</h4>
                      <p className="text-xs text-ghee-brown/60 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/benefits"
                className="inline-block mt-12 text-ghee-gold font-bold border-b-2 border-ghee-gold pb-1 hover:text-ghee-brown hover:border-ghee-brown transition-all"
              >
                View All Benefits
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl">
                <img
                  src="/input_file_2.png"
                  alt="Traditional Bilona Method"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-ghee-gold/10 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-ghee-brown/5 rounded-full blur-3xl z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-ghee-brown text-ghee-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white/5 p-10 rounded-[32px] border border-white/10">
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <p className="text-lg italic mb-8 text-ghee-cream/80 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ghee-gold rounded-full flex items-center justify-center font-bold text-white">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-xs text-ghee-cream/40 uppercase tracking-widest">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
