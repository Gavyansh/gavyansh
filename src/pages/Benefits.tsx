import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { BENEFITS } from '../constants';

const Benefits = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Benefits of A2 Desi Ghee | Pure Vedic Ghee</title>
        <meta name="description" content="Learn about the incredible health benefits of A2 Desi Cow Ghee. From heart health to brain function, discover why ghee is a superfood." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Liquid Gold
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            The Power of <span className="italic text-ghee-gold">Ayurveda</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-ghee-gold/5 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-ghee-warm rounded-2xl flex items-center justify-center text-ghee-gold mb-8 group-hover:bg-ghee-gold group-hover:text-white transition-all">
                <benefit.icon size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4">{benefit.title}</h3>
              <p className="text-ghee-brown/60 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Nutritional Info */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="/images/D3.jpeg"
                alt="Benefits of A2 Desi Ghee"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-serif font-bold mb-8">Nutritional Excellence</h2>
            <div className="space-y-6">
              {[
                { label: 'A2 Protein', value: 'Rich in beta-casein protein' },
                { label: 'Vitamins', value: 'Loaded with Vitamin A, D, E, and K' },
                { label: 'Omega-3', value: 'High concentration of healthy fatty acids' },
                { label: 'Butyric Acid', value: 'Essential for gut health and immunity' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-ghee-gold/10 pb-4">
                  <span className="font-bold text-ghee-gold uppercase tracking-widest text-xs">{item.label}</span>
                  <span className="text-ghee-brown/70">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
