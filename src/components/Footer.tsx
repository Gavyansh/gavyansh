import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { LOGO_SRC } from '../constants/branding';

const Footer = () => {
  return (
    <footer className="bg-ghee-brown text-ghee-cream pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="block mb-6">
              <img src={LOGO_SRC} alt="Gavyansh" className="h-12 w-auto max-w-[200px] object-contain object-left drop-shadow-lg" />
            </Link>
            <p className="text-ghee-cream/60 text-sm leading-relaxed mb-8">
              Go the Vedic Way. Bringing the ancient wisdom of Ayurveda to your modern kitchen through traditionally churned, pure A2 Desi Cow Ghee.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-ghee-gold transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-ghee-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-ghee-gold transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-ghee-cream/60">
              <li><Link to="/" className="hover:text-ghee-gold transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-ghee-gold transition-colors">Our Products</Link></li>
              <li><Link to="/benefits" className="hover:text-ghee-gold transition-colors">Benefits of Ghee</Link></li>
              <li><Link to="/about" className="hover:text-ghee-gold transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-ghee-cream/60">
              <li><Link to="/contact" className="hover:text-ghee-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/reviews" className="hover:text-ghee-gold transition-colors">Reviews</Link></li>
              <li><a href="#" className="hover:text-ghee-gold transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-ghee-gold transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-ghee-cream/60">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-ghee-gold shrink-0" />
                <span>F6, A Wing, Sai Ashish Trade Centre, Opp Punyabhumi, Near Bhagvan mahavir University, VIP Rd Surat 395007</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-ghee-gold shrink-0" />
                <a href="tel:+919510416322" className="hover:text-ghee-gold transition-colors">+91 95104 16322</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-ghee-gold shrink-0" />
                <a href="mailto:info1gavyansh@gmail.com" className="hover:text-ghee-gold transition-colors">info1gavyansh@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ghee-cream/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ghee-cream/40 uppercase tracking-widest">
          <p>© 2024 Gavyansh. All rights reserved.</p>
          <p>Handcrafted with love in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
