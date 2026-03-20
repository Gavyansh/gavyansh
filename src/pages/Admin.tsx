import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import {
  Package,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminUnlocked, lockAdmin } from '../adminStore';
import { API_BASE } from '../api';
import { Product } from '../types';

interface ProductRecord extends Product {}

const Admin = () => {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductRecord>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminUnlocked()) {
      navigate('/', { replace: true });
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setProducts(data);
      else if (res.ok && data.products) setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`);
      const data = await res.json();
      if (res.ok && data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleSaveProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        setEditingId(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update');
      }
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) {
      alert('Name and ID are required');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: String(formData.id).trim().toLowerCase().replace(/\s+/g, '-'),
          name: formData.name,
          description: formData.description || '',
          image: formData.image || '/images/D2.jpeg',
          benefits: formData.benefits || [],
          variants: formData.variants || [{ weight: '500ml', price: 0 }],
        }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts((p) => [...p, data.product]);
        setShowAddForm(false);
        setFormData({});
      } else {
        alert(data.error || 'Failed to add product');
      }
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((p) => p.filter((x) => x.id !== id));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    lockAdmin();
    navigate('/', { replace: true });
  };

  if (!isAdminUnlocked()) return null;

  return (
    <div className="min-h-screen bg-ghee-warm/30 pt-24 pb-24">
      <Helmet>
        <title>Admin Dashboard | Gavyansh</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 text-ghee-brown/70 hover:text-ghee-brown transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-ghee-brown">
              Admin <span className="italic text-ghee-gold">Dashboard</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-ghee-brown/60 hover:text-ghee-brown font-medium"
          >
            Exit Admin
          </button>
        </div>

        <div className="flex gap-2 mb-8 p-1 bg-white rounded-xl border border-ghee-gold/10 w-fit">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
              tab === 'products' ? 'bg-ghee-brown text-ghee-cream' : 'text-ghee-brown/60 hover:text-ghee-brown'
            }`}
          >
            <ShoppingBag size={18} />
            Products
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
              tab === 'orders' ? 'bg-ghee-brown text-ghee-cream' : 'text-ghee-brown/60 hover:text-ghee-brown'
            }`}
          >
            <Package size={18} />
            Orders ({orders.length})
          </button>
        </div>

        {tab === 'products' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-ghee-gold text-ghee-brown px-6 py-3 rounded-xl font-bold hover:bg-ghee-gold/90 transition-all"
              >
                <Plus size={20} />
                Add Product
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-3xl border border-ghee-gold/10 p-8 shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-6">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">ID (slug)</label>
                      <input
                        required
                        value={formData.id || ''}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        placeholder="e.g. new-ghee"
                        className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Name</label>
                      <input
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Product name"
                        className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Image URL</label>
                    <input
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/D2.jpeg"
                      className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Benefits (comma-separated)</label>
                    <input
                      value={(formData.benefits || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Benefit 1, Benefit 2"
                      className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Variants (weight:price)</label>
                    <input
                      value={
                        (formData.variants || [])
                          .map((v) => `${v.weight}:${v.price}`)
                          .join(', ')
                      }
                      onChange={(e) => {
                        const parts = e.target.value.split(',').map((s) => s.trim());
                        const variants = parts
                          .filter(Boolean)
                          .map((p) => {
                            const [w, pr] = p.split(':');
                            return { weight: w || '500ml', price: Number(pr) || 0 };
                          });
                        setFormData({ ...formData, variants: variants.length ? variants : [{ weight: '500ml', price: 0 }] });
                      }}
                      placeholder="500ml:850, 1L:1600"
                      className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex items-center gap-2 bg-ghee-brown text-ghee-cream px-6 py-3 rounded-xl font-bold">
                      <Save size={18} />
                      Add Product
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddForm(false); setFormData({}); }}
                      className="px-6 py-3 rounded-xl font-bold text-ghee-brown/60 hover:text-ghee-brown"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-ghee-gold/30 border-t-ghee-gold rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-ghee-gold/10 overflow-hidden shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        {editingId === product.id ? (
                          <div className="space-y-4">
                            <input
                              value={product.name}
                              onChange={(e) =>
                                setProducts((p) =>
                                  p.map((x) => (x.id === product.id ? { ...x, name: e.target.value } : x))
                                )
                              }
                              className="w-full text-xl font-bold bg-ghee-warm rounded-xl px-4 py-2"
                            />
                            <textarea
                              value={product.description}
                              onChange={(e) =>
                                setProducts((p) =>
                                  p.map((x) => (x.id === product.id ? { ...x, description: e.target.value } : x))
                                )
                              }
                              rows={2}
                              className="w-full bg-ghee-warm rounded-xl px-4 py-2 text-sm"
                            />
                            <input
                              value={product.image}
                              onChange={(e) =>
                                setProducts((p) =>
                                  p.map((x) => (x.id === product.id ? { ...x, image: e.target.value } : x))
                                )
                              }
                              placeholder="Image URL"
                              className="w-full bg-ghee-warm rounded-xl px-4 py-2 text-sm"
                            />
                            <div>
                              <span className="text-xs font-bold text-ghee-gold uppercase">Benefits (comma-separated)</span>
                              <input
                                value={(product.benefits || []).join(', ')}
                                onChange={(e) =>
                                  setProducts((p) =>
                                    p.map((x) =>
                                      x.id === product.id
                                        ? { ...x, benefits: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }
                                        : x
                                    )
                                  )
                                }
                                placeholder="Benefit 1, Benefit 2"
                                className="w-full bg-ghee-warm rounded-xl px-4 py-2 text-sm mt-1"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-ghee-gold uppercase">Variants (weight: price)</span>
                              {product.variants.map((v, i) => (
                                <div key={i} className="flex gap-2 mt-1 items-center">
                                  <input
                                    value={v.weight}
                                    onChange={(e) => {
                                      const nv = [...product.variants];
                                      nv[i] = { ...v, weight: e.target.value };
                                      setProducts((p) =>
                                        p.map((x) => (x.id === product.id ? { ...x, variants: nv } : x))
                                      );
                                    }}
                                    placeholder="500ml"
                                    className="w-24 bg-ghee-warm rounded-lg px-2 py-1 text-sm"
                                  />
                                  <input
                                    type="number"
                                    value={v.price}
                                    onChange={(e) => {
                                      const nv = [...product.variants];
                                      nv[i] = { ...v, price: Number(e.target.value) || 0 };
                                      setProducts((p) =>
                                        p.map((x) => (x.id === product.id ? { ...x, variants: nv } : x))
                                      );
                                    }}
                                    placeholder="850"
                                    className="w-24 bg-ghee-warm rounded-lg px-2 py-1 text-sm"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nv = product.variants.filter((_, j) => j !== i);
                                      if (nv.length > 0) {
                                        setProducts((p) =>
                                          p.map((x) => (x.id === product.id ? { ...x, variants: nv } : x))
                                        );
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-600 text-sm"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const nv = [...product.variants, { weight: '500ml', price: 0 }];
                                  setProducts((p) =>
                                    p.map((x) => (x.id === product.id ? { ...x, variants: nv } : x))
                                  );
                                }}
                                className="mt-2 text-sm text-ghee-gold font-bold hover:text-ghee-brown"
                              >
                                + Add variant
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveProduct(product.id)}
                                className="flex items-center gap-2 bg-ghee-gold text-ghee-brown px-4 py-2 rounded-lg font-bold text-sm"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 rounded-lg font-bold text-sm text-ghee-brown/60"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-xl font-serif font-bold">{product.name}</h3>
                            <p className="text-ghee-brown/60 text-sm mt-1">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {product.variants.map((v) => (
                                <span
                                  key={v.weight}
                                  className="bg-ghee-warm px-3 py-1 rounded-lg text-sm"
                                >
                                  {v.weight}: ₹{v.price}
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => setEditingId(product.id)}
                                className="flex items-center gap-1 text-ghee-gold hover:text-ghee-brown text-sm font-bold"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-bold"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {tab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-ghee-gold/10 p-16 text-center">
                <Package size={48} className="mx-auto text-ghee-gold/40 mb-4" />
                <p className="text-ghee-brown/60">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-ghee-gold/10 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-ghee-warm/30 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-ghee-brown">{order.id}</p>
                      <p className="text-sm text-ghee-brown/50">
                        {order.customer?.name} • {order.customer?.email}
                      </p>
                      <p className="text-xs text-ghee-brown/40 mt-1">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-serif font-bold text-ghee-gold">₹{order.total}</span>
                      {expandedOrder === order.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>
                  {expandedOrder === order.id && (
                    <div className="border-t border-ghee-gold/10 px-6 pb-6 pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>
                              {item.name} ({item.weight}) × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-ghee-brown/70">
                        <strong>Address:</strong> {order.customer?.address}
                      </p>
                      <p className="text-sm text-ghee-brown/70">
                        <strong>Phone:</strong> {order.customer?.phone}
                      </p>
                      {order.paymentMethod && (
                        <p className="text-xs text-ghee-brown/50 mt-2">
                          Payment: {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
