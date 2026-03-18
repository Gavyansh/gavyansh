import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Award, Heart, Leaf, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>About Us | Gavyansh Vedic Ghee Story</title>
        <meta name="description" content="Learn about Gavyansh's journey of bringing authentic A2 Desi Cow Ghee to your home. Our commitment to tradition, quality, and purity." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            Tradition in Every <span className="italic text-ghee-gold">Drop</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-bold mb-8">The Vedic Way of Life</h2>
            <p className="text-ghee-brown/70 leading-relaxed mb-6">
              Our journey began with a simple mission: to revive the ancient Vedic method of ghee making. In an era of mass production, we chose the slow, traditional path of the Bilona method.
            </p>
            <p className="text-ghee-brown/70 leading-relaxed mb-8">
              We believe that ghee is not just an ingredient; it's a sacred food that nourishes both body and soul. That's why we source our milk exclusively from grass-fed Gir cows, known for their superior A2 milk quality.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-ghee-gold mb-1">10+</h4>
                <p className="text-xs uppercase tracking-widest text-ghee-brown/40">Years of Purity</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-ghee-gold mb-1">5000+</h4>
                <p className="text-xs uppercase tracking-widest text-ghee-brown/40">Happy Families</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-[40px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1000"
                alt="Farm Life"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-xl max-w-xs hidden md:block">
              <p className="text-sm italic text-ghee-brown/60">
                "Our cows are part of our family. We ensure they are happy, healthy, and grass-fed."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: 'Integrity', desc: 'Honest practices from farm to jar.' },
            { icon: Heart, title: 'Compassion', desc: 'Ethical treatment of our cows.' },
            { icon: Award, title: 'Quality', desc: 'No compromises on purity.' },
            { icon: Leaf, title: 'Sustainability', desc: 'Eco-friendly farming methods.' },
          ].map((value, i) => (
            <div key={i} className="bg-ghee-warm/50 p-10 rounded-[40px] text-center">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-ghee-gold mx-auto mb-6 shadow-sm">
                <value.icon size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-sm text-ghee-brown/60">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
