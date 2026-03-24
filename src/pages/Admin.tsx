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
  Star,
  CircleCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminUnlocked, isAdminPinVerified, submitAdminPin, lockAdmin } from '../adminStore';
import { API_BASE } from '../api';
import { Product, Review } from '../types';
import ProductImagesEditor from '../components/ProductImagesEditor';
import { getProductImages } from '../utils/productImages';

interface ProductRecord extends Product {}

const Admin = () => {
  const [tab, setTab] = useState<'products' | 'orders' | 'reviews'>('products');
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductRecord>>({});
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState<Partial<Review>>({});
  const [pinVerified, setPinVerified] = useState(() => isAdminPinVerified());
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminUnlocked()) {
      navigate('/', { replace: true });
      return;
    }
    if (!pinVerified) return;
    fetchProducts();
    fetchOrders();
    fetchReviews();
  }, [navigate, pinVerified]);

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

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setReviews(
          data.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            name: String(r.name),
            rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
            comment: String(r.comment),
            date: String(r.date),
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const handleMarkOrderComplete = async (orderId: string) => {
    if (!confirm('Mark this order as complete? It will be removed from this list.')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${encodeURIComponent(orderId)}/complete`, {
        method: 'PATCH',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOrders((o) => o.filter((x) => x.id !== orderId));
        setExpandedOrder((e) => (e === orderId ? null : e));
      } else {
        alert((data as { error?: string }).error || 'Failed to update order');
      }
    } catch {
      alert('Failed to update order');
    }
  };

  const handleSaveReview = async (id: string) => {
    const r = reviews.find((x) => x.id === id);
    if (!r) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          date: r.date,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((list) => list.map((x) => (x.id === id ? { ...data.review } : x)));
        setEditingReviewId(null);
      } else {
        alert(data.error || 'Failed to save review');
      }
    } catch {
      alert('Failed to save review');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name?.trim() || !reviewForm.comment?.trim()) {
      alert('Name and comment are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewForm.name.trim(),
          rating: Math.min(5, Math.max(1, Number(reviewForm.rating) || 5)),
          comment: reviewForm.comment.trim(),
          date: reviewForm.date?.trim() || new Date().toISOString().slice(0, 10),
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((list) => [data.review, ...list]);
        setShowAddReview(false);
        setReviewForm({});
      } else {
        alert(data.error || 'Failed to add review');
      }
    } catch {
      alert('Failed to add review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/reviews/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReviews((list) => list.filter((x) => x.id !== id));
        setEditingReviewId(null);
      }
    } catch {
      alert('Failed to delete review');
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
    const imgs = (formData.images || []).filter(Boolean);
    if (imgs.length === 0) {
      alert('Please add at least one product image (up to 3).');
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
          image: imgs[0],
          images: imgs.slice(0, 3),
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

  if (!pinVerified) {
    return (
      <div className="min-h-screen bg-ghee-warm/30 pt-24 pb-24 flex items-center justify-center px-4">
        <Helmet>
          <title>Admin Access | Gavyansh</title>
        </Helmet>
        <div className="bg-white rounded-[32px] border border-ghee-gold/10 shadow-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-serif font-bold text-ghee-brown text-center mb-2">Admin access</h2>
          <p className="text-ghee-brown/60 text-sm text-center mb-8">Enter the access code to continue</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPinError('');
              if (submitAdminPin(pinInput)) {
                setPinVerified(true);
                setPinInput('');
              } else {
                setPinError('Invalid code. Try again.');
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Access code"
              className="w-full bg-ghee-warm rounded-xl px-4 py-4 text-center text-2xl tracking-[0.3em] font-mono border-none focus:ring-2 focus:ring-ghee-gold"
              maxLength={8}
            />
            {pinError && <p className="text-red-500 text-sm text-center">{pinError}</p>}
            <button
              type="submit"
              className="w-full bg-ghee-brown text-ghee-cream py-4 rounded-xl font-bold hover:bg-ghee-gold transition-all"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => {
                lockAdmin();
                navigate('/', { replace: true });
              }}
              className="w-full text-ghee-brown/50 text-sm font-medium hover:text-ghee-brown"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => setTab('reviews')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${
              tab === 'reviews' ? 'bg-ghee-brown text-ghee-cream' : 'text-ghee-brown/60 hover:text-ghee-brown'
            }`}
          >
            <Star size={18} />
            Reviews ({reviews.length})
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
                  <ProductImagesEditor
                    requireFirst
                    urls={formData.images || []}
                    onChange={(urls) =>
                      setFormData({
                        ...formData,
                        images: urls,
                        image: urls[0] || formData.image,
                      })
                    }
                  />
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
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-ghee-warm/30">
                        <img
                          src={getProductImages(product)[0] || product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
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
                            <ProductImagesEditor
                              urls={getProductImages(product)}
                              onChange={(urls) =>
                                setProducts((p) =>
                                  p.map((x) =>
                                    x.id === product.id
                                      ? { ...x, images: urls, image: urls[0] || x.image }
                                      : x
                                  )
                                )
                              }
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 hover:bg-ghee-warm/30 transition-colors">
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="flex-1 text-left min-w-0"
                    >
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
                    </button>
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMarkOrderComplete(order.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-800 px-3 py-2 text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <CircleCheck size={16} />
                        Mark complete
                      </button>
                      <span className="text-xl font-serif font-bold text-ghee-gold">₹{order.total}</span>
                      <button
                        type="button"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="p-1 text-ghee-brown/60 hover:text-ghee-brown"
                        aria-label={expandedOrder === order.id ? 'Collapse' : 'Expand'}
                      >
                        {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>
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

        {tab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddReview(true);
                  setReviewForm({ name: '', rating: 5, comment: '', date: new Date().toISOString().slice(0, 10) });
                }}
                className="flex items-center gap-2 bg-ghee-gold text-ghee-brown px-6 py-3 rounded-xl font-bold hover:bg-ghee-gold/90 transition-all"
              >
                <Plus size={20} />
                Add review
              </button>
            </div>

            {showAddReview && (
              <div className="bg-white rounded-3xl border border-ghee-gold/10 p-8 shadow-sm">
                <h3 className="text-xl font-serif font-bold mb-6">New review</h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Name</label>
                      <input
                        required
                        value={reviewForm.name || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Date (YYYY-MM-DD)</label>
                      <input
                        type="text"
                        value={reviewForm.date || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                        placeholder="2024-02-15"
                        className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Rating (1–5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={reviewForm.rating ?? 5}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })
                      }
                      className="w-full max-w-xs bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-ghee-gold uppercase mb-2">Comment</label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.comment || ''}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full bg-ghee-warm rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-ghee-gold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex items-center gap-2 bg-ghee-brown text-ghee-cream px-6 py-3 rounded-xl font-bold">
                      <Save size={18} />
                      Save review
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddReview(false);
                        setReviewForm({});
                      }}
                      className="px-6 py-3 rounded-xl font-bold text-ghee-brown/60 hover:text-ghee-brown"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {reviews.length === 0 && !showAddReview ? (
              <div className="bg-white rounded-3xl border border-ghee-gold/10 p-16 text-center">
                <Star size={48} className="mx-auto text-ghee-gold/40 mb-4" />
                <p className="text-ghee-brown/60">No reviews yet. Add one above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-3xl border border-ghee-gold/10 overflow-hidden shadow-sm p-6"
                  >
                    {editingReviewId === review.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-xs font-bold text-ghee-gold uppercase">Name</span>
                            <input
                              value={review.name}
                              onChange={(e) =>
                                setReviews((list) =>
                                  list.map((x) => (x.id === review.id ? { ...x, name: e.target.value } : x))
                                )
                              }
                              className="w-full mt-1 bg-ghee-warm rounded-xl px-4 py-2"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-ghee-gold uppercase">Date</span>
                            <input
                              value={review.date}
                              onChange={(e) =>
                                setReviews((list) =>
                                  list.map((x) => (x.id === review.id ? { ...x, date: e.target.value } : x))
                                )
                              }
                              className="w-full mt-1 bg-ghee-warm rounded-xl px-4 py-2"
                            />
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-ghee-gold uppercase">Rating (1–5)</span>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={review.rating}
                            onChange={(e) =>
                              setReviews((list) =>
                                list.map((x) =>
                                  x.id === review.id
                                    ? { ...x, rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) }
                                    : x
                                )
                              )
                            }
                            className="w-full max-w-xs mt-1 bg-ghee-warm rounded-xl px-4 py-2"
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-ghee-gold uppercase">Comment</span>
                          <textarea
                            rows={4}
                            value={review.comment}
                            onChange={(e) =>
                              setReviews((list) =>
                                list.map((x) => (x.id === review.id ? { ...x, comment: e.target.value } : x))
                              )
                            }
                            className="w-full mt-1 bg-ghee-warm rounded-xl px-4 py-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveReview(review.id)}
                            className="flex items-center gap-2 bg-ghee-gold text-ghee-brown px-4 py-2 rounded-lg font-bold text-sm"
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReviewId(null)}
                            className="px-4 py-2 rounded-lg font-bold text-sm text-ghee-brown/60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={16} className="text-ghee-gold fill-ghee-gold" />
                          ))}
                        </div>
                        <p className="text-ghee-brown/80 italic mb-4">"{review.comment}"</p>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-ghee-brown">{review.name}</p>
                            <p className="text-xs text-ghee-brown/50">{review.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingReviewId(review.id)}
                              className="flex items-center gap-1 text-ghee-gold hover:text-ghee-brown text-sm font-bold"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(review.id)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-bold"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
