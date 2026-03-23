import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../authStore';
import { API_BASE } from '../api';
import { LOGO_SRC } from '../constants/branding';

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

      {/* Left — light logo watermark + welcome copy (logo lives in site header only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-ghee-cream">
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat bg-center opacity-[0.07] [background-size:min(92%,520px)]"
          style={{ backgroundImage: `url(${LOGO_SRC})` }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ghee-cream/95 via-ghee-cream/85 to-ghee-warm/70" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 py-16">
          <p className="text-ghee-brown/90 text-lg md:text-xl max-w-md leading-relaxed font-medium">
            Welcome to the home of pure A2 Desi Cow Ghee. Sign in to explore our premium collection and track your orders.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-ghee-cream">
        <div className="w-full max-w-md">
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
