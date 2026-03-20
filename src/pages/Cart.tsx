import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, CreditCard, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../cartStore';
import { getAuthHeaders } from '../authStore';
import { API_BASE } from '../api';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderCOD = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/place-order-cod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          customer: formData,
          items: items,
          total: totalPrice(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsOrderPlaced(true);
        clearCart();
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('COD order error:', err);
      alert('Failed to place order. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      await handlePlaceOrderCOD(e);
      return;
    }
    setIsLoading(true);

    try {
      const createRes = await fetch(`${API_BASE}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          customer: formData,
          items: items,
          total: totalPrice(),
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok || !createData.razorpayOrderId) {
        alert(createData.error || 'Failed to create order. Please try again.');
        setIsLoading(false);
        return;
      }

      const { razorpayOrderId, orderId, amount } = createData;
      const rzpKey = RAZORPAY_KEY || createData.razorpayKeyId;

      if (!rzpKey || !window.Razorpay) {
        alert('Payment gateway not configured. Please contact support.');
        setIsLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: rzpKey,
        amount: amount,
        currency: 'INR',
        name: 'Gavyansh Vedic Ghee',
        description: `Order ${orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#5A4A32' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                customer: formData,
                items: items,
                total: totalPrice(),
                orderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setIsOrderPlaced(true);
              clearCart();
            } else {
              alert(verifyData.error || 'Payment verification failed. Please contact support with your payment ID.');
            }
          } catch (err) {
            console.error('Verify payment error:', err);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => setIsLoading(false),
        },
      });

      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to initiate payment. Please check your connection.');
      setIsLoading(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Order Placed!</h1>
          <p className="text-ghee-brown/60 mb-10">
            Thank you for choosing Gavyansh. We've sent a confirmation email to <strong>{formData.email}</strong>. Our team will ship your order shortly.
          </p>
          <Link
            to="/"
            className="inline-block bg-ghee-brown text-ghee-cream px-10 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>Shopping Cart | Gavyansh Vedic Ghee</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Your <span className="italic text-ghee-gold">Cart</span></h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-ghee-gold/5 shadow-sm">
            <div className="w-20 h-20 bg-ghee-warm rounded-full flex items-center justify-center mx-auto mb-6 text-ghee-gold">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
            <p className="text-ghee-brown/60 mb-10">Looks like you haven't added any liquid gold to your cart yet.</p>
            <Link
              to="/products"
              className="inline-block bg-ghee-brown text-ghee-cream px-10 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.weight}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-3xl border border-ghee-gold/5 shadow-sm flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-serif font-bold mb-1">{item.name}</h3>
                      <p className="text-ghee-gold font-bold text-sm mb-2">{item.weight}</p>
                      <p className="text-ghee-brown/40 text-sm">₹{item.price} per unit</p>
                    </div>
                    <div className="flex items-center gap-4 bg-ghee-warm rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-ghee-brown hover:text-ghee-gold transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-ghee-brown hover:text-ghee-gold transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right shrink-0 min-w-[100px]">
                      <p className="text-xl font-serif font-bold text-ghee-brown">₹{item.price * item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.weight)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[40px] border border-ghee-gold/5 shadow-xl sticky top-32">
                <h3 className="text-2xl font-serif font-bold mb-8">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-ghee-brown/60">
                    <span>Subtotal</span>
                    <span>₹{totalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-ghee-brown/60">
                    <span>Shipping</span>
                    <span className="text-emerald-500 font-bold uppercase text-xs">Free</span>
                  </div>
                  <div className="border-t border-ghee-gold/10 pt-4 flex justify-between items-baseline">
                    <span className="font-bold">Total</span>
                    <span className="text-3xl font-serif font-bold text-ghee-gold">₹{totalPrice()}</span>
                  </div>
                </div>

                {!isCheckingOut ? (
                  <button
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-ghee-brown text-ghee-cream py-5 rounded-2xl font-bold hover:bg-ghee-gold transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={20} />
                  </button>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Full Name</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="Your Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Email</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Phone</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="+91 00000 00000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Full Address</label>
                      <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="Street, Area, Landmark" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">City</label>
                        <input name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">State</label>
                        <input name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="State" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Pincode</label>
                        <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-ghee-warm border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-ghee-gold transition-all" placeholder="395007" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">Payment Method</label>
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-ghee-gold bg-ghee-warm' : 'border-ghee-gold/20 hover:border-ghee-gold/40'}`}>
                          <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="sr-only" />
                          <CreditCard size={20} className="text-ghee-gold" />
                          <span className="font-medium">Pay Online (Razorpay)</span>
                        </label>
                        <label className={`flex-1 flex items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-ghee-gold bg-ghee-warm' : 'border-ghee-gold/20 hover:border-ghee-gold/40'}`}>
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="sr-only" />
                          <Banknote size={20} className="text-ghee-gold" />
                          <span className="font-medium">Cash on Delivery (COD)</span>
                        </label>
                      </div>
                    </div>
                    <button disabled={isLoading} type="submit" className="w-full bg-ghee-brown text-ghee-cream py-5 rounded-2xl font-bold hover:bg-ghee-gold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {isLoading ? (paymentMethod === 'cod' ? 'Placing order...' : 'Opening payment...') : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay with Razorpay'}
                    </button>
                    <button type="button" onClick={() => setIsCheckingOut(false)} className="w-full text-ghee-brown/40 text-sm font-bold hover:text-ghee-brown transition-colors">
                      Back to Cart
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
