import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Package, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../cartStore';
import { useAuthStore } from '../authStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());
  const logout = useAuthStore((s) => s.logout);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Benefits', path: '/benefits' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-ghee-cream/80 backdrop-blur-md border-b border-ghee-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-serif font-bold text-ghee-brown tracking-tighter uppercase">
              Gavyansh
            </span>
            <span className="text-xs font-bold text-ghee-gold tracking-[0.2em] uppercase -mt-0.5">
              Go the Vedic Way
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {isLoggedIn() && (
              <Link
                to="/my-orders"
                className={`text-sm font-medium transition-colors hover:text-ghee-gold flex items-center gap-1 ${
                  location.pathname === '/my-orders' ? 'text-ghee-gold' : 'text-ghee-brown/70'
                }`}
              >
                <Package size={16} />
                My Orders
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-ghee-gold ${
                  location.pathname === link.path ? 'text-ghee-gold' : 'text-ghee-brown/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/cart"
              className="relative p-2 text-ghee-brown hover:text-ghee-gold transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ghee-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            {isLoggedIn() ? (
              <button
                onClick={logout}
                className="p-2 text-ghee-brown/70 hover:text-ghee-gold transition-colors"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-ghee-brown/70 hover:text-ghee-gold transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn() && (
              <Link to="/my-orders" className="p-2 text-ghee-brown">
                <Package size={22} />
              </Link>
            )}
            <Link
              to="/cart"
              className="relative p-2 text-ghee-brown"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ghee-gold text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            {!isLoggedIn() && (
              <Link to="/login" className="text-sm font-medium text-ghee-brown/70 px-3">
                Sign In
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ghee-brown p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ghee-cream border-b border-ghee-gold/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {isLoggedIn() && (
                <Link
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-ghee-brown/70"
                >
                  My Orders
                </Link>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 text-base font-medium ${
                    location.pathname === link.path ? 'text-ghee-gold' : 'text-ghee-brown/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/products"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-ghee-brown text-ghee-cream px-6 py-3 rounded-xl text-base font-medium mt-4"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
