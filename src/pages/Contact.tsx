import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_BASE } from '../api';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Contact Us | Gavyansh Vedic Ghee</title>
        <meta name="description" content="Get in touch with Gavyansh for orders, inquiries, or farm visits. We are located in Surat, Gujarat." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-ghee-gold font-bold tracking-[0.3em] uppercase text-xs"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif font-bold mt-4"
          >
            Connect With <span className="italic text-ghee-gold">Us</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-white transition-all">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-1">Call Us</p>
                    <a href="tel:+919510416322" className="text-lg font-medium text-ghee-brown hover:text-ghee-gold transition-colors">+91 95104 16322</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-1">Email Us</p>
                    <a href="mailto:info1gavyansh@gmail.com" className="text-lg font-medium text-ghee-brown hover:text-ghee-gold transition-colors">info1gavyansh@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-white transition-all">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-lg font-medium text-ghee-brown leading-relaxed">
                      F6, A Wing, Sai Ashish Trade Centre, Opp Punyabhumi, Near Bhagvan mahavir University, VIP Rd Surat 395007
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-ghee-gold group-hover:bg-ghee-gold group-hover:text-white transition-all">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-1">Working Hours</p>
                    <p className="text-lg font-medium text-ghee-brown">Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ghee-brown text-ghee-cream p-10 rounded-[40px] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-serif font-bold mb-4">Direct Order?</h3>
                <p className="text-ghee-cream/60 mb-8">Message us on WhatsApp for quick orders and bulk inquiries.</p>
                <a
                  href="https://wa.me/919510416322"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all"
                >
                  <MessageCircle size={20} />
                  WhatsApp Now
                </a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
            </div>
          </motion.div>

          {/* Map & Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-2 rounded-[40px] shadow-xl border border-ghee-gold/5 overflow-hidden h-[400px]">
              <iframe
                src="https://maps.google.com/maps?q=Sai%20Ashish%20Trade%20Centre,%20Opp%20Punyabhumi,%20Near%20Bhagvan%20mahavir%20University,%20VIP%20Rd%20Surat%20395007&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-[38px]"
              />
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-xl border border-ghee-gold/5 space-y-6">
              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl">
                  <CheckCircle2 size={20} />
                  <span className="font-medium">Thank you! We will get back to you soon.</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="text-red-600 bg-red-50 px-4 py-3 rounded-2xl font-medium">
                  Something went wrong. Please try again or reach us at info1gavyansh@gmail.com
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-ghee-warm border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ghee-gold transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-ghee-warm border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ghee-gold transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-ghee-warm border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ghee-gold transition-all"
                  placeholder="+91 00000 00000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-ghee-warm border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-ghee-gold transition-all"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-ghee-brown text-ghee-cream py-5 rounded-2xl font-bold hover:bg-ghee-gold transition-all shadow-lg shadow-ghee-brown/10 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? <><Loader2 size={20} className="animate-spin" /> Sending...</> : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
