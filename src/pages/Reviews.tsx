import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../constants';

const Reviews = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Customer Reviews | Gavyansh Vedic Ghee</title>
        <meta name="description" content="Read what our customers have to say about Gavyansh authentic A2 Desi Cow Ghee. Real stories from real ghee lovers." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Testimonials
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            Trusted by <span className="italic text-ghee-gold">Families</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-12 rounded-[40px] shadow-sm border border-ghee-gold/5 relative"
            >
              <Quote className="absolute top-8 right-8 text-ghee-gold/10" size={64} />
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <p className="text-xl italic text-ghee-brown/80 leading-relaxed mb-10">
                "{review.comment}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-ghee-gold rounded-full flex items-center justify-center font-bold text-white text-xl">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{review.name}</h4>
                  <p className="text-xs text-ghee-brown/40 uppercase tracking-widest">{review.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-32 text-center">
          <h3 className="text-3xl font-serif font-bold mb-6">Loved our Ghee?</h3>
          <p className="text-ghee-brown/60 mb-10">Share your experience with us and help others choose purity.</p>
          <button className="bg-ghee-brown text-ghee-cream px-12 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all shadow-xl shadow-ghee-brown/10">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
