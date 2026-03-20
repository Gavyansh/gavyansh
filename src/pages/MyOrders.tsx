import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Package, ChevronDown, ChevronUp, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore, useIsLoggedIn, getAuthHeaders } from '../authStore';
import { API_BASE } from '../api';

interface OrderItem {
  id: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; address: string };
  items: OrderItem[];
  total: number;
  createdAt: string;
  paymentMethod?: string;
  awb?: string | null;
}

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-ghee-brown/60 mb-6">Please sign in to view your orders.</p>
          <Link
            to="/login"
            className="inline-block bg-ghee-brown text-ghee-cream px-10 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <title>My Orders | Gavyansh Vedic Ghee</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold">
            My <span className="italic text-ghee-gold">Orders</span>
          </h1>
          <p className="text-ghee-brown/60 mt-2">Your order history at a glance</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-ghee-gold/30 border-t-ghee-gold rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-[40px] border border-ghee-gold/5 shadow-sm"
          >
            <div className="w-20 h-20 bg-ghee-warm rounded-full flex items-center justify-center mx-auto mb-6 text-ghee-gold">
              <Package size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">No orders yet</h2>
            <p className="text-ghee-brown/60 mb-10">Start your journey with pure A2 Desi Cow Ghee.</p>
            <Link
              to="/products"
              className="inline-block bg-ghee-brown text-ghee-cream px-10 py-4 rounded-full font-bold hover:bg-ghee-gold transition-all"
            >
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[24px] border border-ghee-gold/10 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-ghee-warm/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ghee-warm rounded-2xl flex items-center justify-center text-ghee-gold">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-ghee-brown">{order.id}</p>
                      <p className="text-sm text-ghee-brown/50 flex items-center gap-1 mt-0.5">
                        <Calendar size={14} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-serif font-bold text-ghee-gold">₹{order.total}</span>
                    {expandedId === order.id ? (
                      <ChevronUp size={20} className="text-ghee-brown/50" />
                    ) : (
                      <ChevronDown size={20} className="text-ghee-brown/50" />
                    )}
                  </div>
                </button>

                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-ghee-gold/10 px-6 pb-6"
                  >
                    <div className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2">
                          Items
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={`${item.id}-${item.weight}`}
                              className="flex justify-between text-ghee-brown/80"
                            >
                              <span>
                                {item.name} ({item.weight}) × {item.quantity}
                              </span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ghee-gold uppercase tracking-widest mb-2 flex items-center gap-1">
                          <MapPin size={12} />
                          Delivery Address
                        </p>
                        <p className="text-ghee-brown/80">{order.customer.address}</p>
                        <p className="text-sm text-ghee-brown/50 mt-1">
                          {order.customer.phone}
                        </p>
                      </div>
                      {order.paymentMethod && (
                        <p className="text-xs text-ghee-brown/50">
                          Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online (Razorpay)'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
