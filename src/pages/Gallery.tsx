import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { GALLERY_IMAGES } from '../constants';

const Gallery = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Gallery | Gavyansh Vedic Ghee</title>
        <meta name="description" content="Take a look at Gavyansh farm, our cows, and the traditional Bilona process we use to create our premium A2 Desi Cow Ghee." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Visual Journey
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            From Farm to <span className="italic text-ghee-gold">Jar</span>
          </motion.h1>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <img
                src={img}
                alt={`Gallery ${i}`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
