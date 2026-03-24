import React from 'react';
import { motion } from 'motion/react';
import WhatsAppIcon from './WhatsAppIcon';
import { CONTACT_PHONE_WHATSAPP } from '../constants/branding';

const WhatsAppButton = () => {
  const phoneNumber = CONTACT_PHONE_WHATSAPP;
  const message = 'Hello! I would like to order some Gavyansh Vedic Ghee.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
    >
      <WhatsAppIcon size={32} className="text-white shrink-0" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-medium whitespace-nowrap">
        Order on WhatsApp
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
