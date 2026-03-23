import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { REVIEWS } from '../constants';

const Reviews = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Blogs and Reviews | Gavyansh Vedic Ghee</title>
        <meta name="description" content="Blogs and customer reviews for Gavyansh authentic A2 Desi Cow Ghee. Stories and experiences from our community." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Community
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            Blogs and <span className="italic text-ghee-gold">Reviews</span>
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
