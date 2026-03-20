import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';
import { API_BASE } from '../api';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
      const body = mode === 'signin' ? { email, password } : { email, password, name };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setAuth(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Helmet>
        <title>Sign In | Gavyansh Vedic Ghee</title>
      </Helmet>

      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1200"
          alt="Vedic Farm"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ghee-brown/90 via-ghee-brown/70 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-ghee-gold rounded-2xl flex items-center justify-center">
              <Leaf size={28} className="text-ghee-brown" />
            </div>
            <div>
              <span className="text-3xl font-serif font-bold text-ghee-cream tracking-tight">
                Gavyansh
              </span>
              <span className="block text-xs font-bold text-ghee-gold tracking-[0.3em] uppercase">
                Go the Vedic Way
              </span>
            </div>
          </div>
          <p className="text-ghee-cream/90 text-lg max-w-md leading-relaxed">
            Welcome to the home of pure A2 Desi Cow Ghee. Sign in to explore our premium collection and track your orders.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-ghee-cream">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12">
            <Link to="/" className="inline-flex flex-col items-center">
              <span className="text-3xl font-serif font-bold text-ghee-brown tracking-tight">
                Gavyansh
              </span>
              <span className="text-xs font-bold text-ghee-gold tracking-[0.2em] uppercase">
                Go the Vedic Way
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-[32px] border border-ghee-gold/10 shadow-xl p-8 md:p-10">
            <div className="flex gap-2 mb-8 p-1 bg-ghee-warm rounded-xl">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  mode === 'signin' ? 'bg-white text-ghee-brown shadow-sm' : 'text-ghee-brown/60 hover:text-ghee-brown'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  mode === 'signup' ? 'bg-white text-ghee-brown shadow-sm' : 'text-ghee-brown/60 hover:text-ghee-brown'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ghee-brown/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === 'signup'}
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-4 bg-ghee-warm border-none rounded-xl focus:ring-2 focus:ring-ghee-gold transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ghee-brown/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-ghee-warm border-none rounded-xl focus:ring-2 focus:ring-ghee-gold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ghee-brown/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Your password'}
                    minLength={mode === 'signup' ? 6 : undefined}
                    className="w-full pl-12 pr-4 py-4 bg-ghee-warm border-none rounded-xl focus:ring-2 focus:ring-ghee-gold transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ghee-brown text-ghee-cream py-5 rounded-2xl font-bold hover:bg-ghee-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-ghee-brown/50 text-sm">
            By continuing, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
