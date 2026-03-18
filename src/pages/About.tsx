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
            <div className="space-y-6 text-ghee-brown/70 leading-relaxed">
              <p>
                Gavyansh, a sacred Sanskrit word meaning the essence of the cow, embodies our commitment to age-old living rooted in Indian traditions.
              </p>
              <p>
                We revere the desi cow as the heart of Indian life—its nurturing gifts sustain health, spirituality, and harmony. Our pure ghee, crafted from her milk, directly supports gaushalas, channeling every purchase into her care. We are devoted cow devotees, not mere commercial sellers—pouring love into every jar.
              </p>
              <p>
                Experience the unadulterated purity that blesses body and soul. Blessed by divine grace, Gavyansh brings nourishment to your home.
              </p>
              <p>
                Join us in honoring the cow, the mother of all prosperity.
              </p>
            </div>
            <div className="mt-12 p-8 bg-ghee-warm rounded-[32px] border-l-4 border-ghee-gold">
              <p className="text-xl font-serif italic text-ghee-brown font-medium">
                Gavo vishvasy Matarah
              </p>
              <p className="text-ghee-brown/70 mt-2">
                The Indian cow is the divine mother of the world.
              </p>
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
                src="/images/D5.jpeg"
                alt="Gavyansh - The essence of the cow"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-xl max-w-xs hidden md:block">
              <p className="text-sm italic text-ghee-brown/60">
                "We are devoted cow devotees, not mere commercial sellers—pouring love into every jar."
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
