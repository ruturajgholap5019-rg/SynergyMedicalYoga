import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  FileText,
  Mail,
  RefreshCw,
  X,
  AlertCircle,
  ShieldCheck,
  LogOut,
  Lock
} from 'lucide-react';
import { api, clearClientLogoutMarker, wasClientLoggedOut } from './lib/api';

import OverviewTab from './components/OverviewTab';
import ProductsTab from './components/ProductsTab';
import UsersTab from './components/UsersTab';
import OrdersTab from './components/OrdersTab';

function ContentManager({ items, refresh, showToast }) {
  const [form, setForm] = useState({
    type: 'blog',
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    imageUrl: '',
    imageAlt: '',
    isPublished: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.createAdminContentItem(form);
    showToast?.('CMS content item created');
    setForm({ type: 'blog', title: '', slug: '', excerpt: '', body: '', imageUrl: '', imageAlt: '', isPublished: false });
    refresh();
  };

  const togglePublished = async (item) => {
    await api.updateAdminContentItem(item._id, { isPublished: !item.isPublished });
    showToast?.('Publish status updated');
    refresh();
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    await api.deleteAdminContentItem(item._id);
    showToast?.('CMS content item deleted');
    refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-sansita text-2xl font-bold text-gray-900">Create CMS Item</h3>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2">
          {['blog', 'faq', 'testimonial', 'gallery', 'video', 'course', 'courseBatch', 'team', 'policy', 'page'].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <textarea placeholder="Excerpt / short answer" rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <textarea placeholder="Body content" rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <input placeholder="Image alt text" value={form.imageAlt} onChange={(e) => setForm({ ...form, imageAlt: e.target.value })} className="w-full bg-slate-50 border rounded-xl px-3 py-2" />
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
          Published
        </label>
        <button className="w-full bg-[#005550] text-white py-3 rounded-xl font-bold">Create Content</button>
      </form>

      <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <h3 className="font-sansita text-2xl font-bold text-gray-900 mb-4">CMS Library</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#005550]">{item.type}</span>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => togglePublished(item)} className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold">
                  {item.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => deleteItem(item)} className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No CMS content created yet.</p>}
        </div>
      </div>
    </div>
  );
}

function EnquiriesManager({ enquiries, refresh, showToast }) {
  const updateStatus = async (enquiry, status) => {
    await api.updateAdminContactMessageStatus(enquiry._id, { status });
    showToast?.('Enquiry status updated');
    refresh();
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="font-sansita text-2xl font-bold text-gray-900">Contact Enquiries</h3>
      {enquiries.map((enquiry) => (
        <div key={enquiry._id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-gray-900">{enquiry.name}</h4>
              <p className="text-xs text-gray-500">{enquiry.email} | {enquiry.phone}</p>
              <p className="text-sm font-semibold text-[#005550] mt-1">{enquiry.subject}</p>
            </div>
            <select value={enquiry.status} onChange={(e) => updateStatus(enquiry, e.target.value)} className="bg-slate-50 border rounded-xl px-3 py-2 text-xs font-bold">
              {['new', 'read', 'replied', 'archived'].map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line">{enquiry.message}</p>
        </div>
      ))}
      {enquiries.length === 0 && <p className="text-sm text-gray-500">No enquiries yet.</p>}
    </div>
  );
}

export default function AdminApp({ initialUser = null, onAuthSuccess, onLogout }) {
  const shouldUseInitialUser = initialUser?.role === 'admin' && !wasClientLoggedOut();
  const [currentUser, setCurrentUser] = useState(shouldUseInitialUser ? initialUser : null);
  const [authChecked, setAuthChecked] = useState(Boolean(shouldUseInitialUser));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Stats & Lists
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contentItems, setContentItems] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Orthopaedic Belts',
    price: '',
    originalPrice: '',
    description: '',
    features: '',
    sizes: 'Small, Medium, Large',
    images: '',
    inStock: true,
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
  });

  // Toast handler
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      if (wasClientLoggedOut()) {
        setCurrentUser(null);
        setAuthChecked(true);
        return;
      }

      try {
        const profile = await api.getProfile();
        if (profile?.user && profile.user.role === 'admin') {
          setCurrentUser(profile.user);
          onAuthSuccess?.(profile.user);
        }
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  // Fetch admin data when logged in
  useEffect(() => {
    if (!currentUser) return;
    fetchDashboardStats();
    if (activeTab === 'products' || activeTab === 'dashboard') fetchProducts();
    if (activeTab === 'users' || activeTab === 'dashboard') fetchUsers();
    if (activeTab === 'orders' || activeTab === 'dashboard') fetchOrders();
    if (activeTab === 'content' || activeTab === 'dashboard') fetchContentItems();
    if (activeTab === 'enquiries' || activeTab === 'dashboard') fetchEnquiries();
  }, [activeTab, refreshKey, currentUser]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  // API Fetchers
  const fetchDashboardStats = async () => {
    try {
      const res = await api.getAdminDashboard();
      if (res.data) setStats(res.data);
    } catch (err) {
      console.error('Failed to load database stats:', err);
    }
  };

  const fetchContentItems = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminContentItems();
      if (res.data) setContentItems(res.data);
    } catch (err) {
      if (!String(err.message || '').includes('/api/admin/content')) {
        showToast(err.message || 'Failed to fetch CMS content');
      }
      setContentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminContactMessages();
      if (res.data) setEnquiries(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProducts();
      if (res.data) setProducts(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch products from database');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminUsers();
      if (res.data) setUsers(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch users from database');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders();
      if (res.data) setOrders(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch orders from database');
    } finally {
      setLoading(false);
    }
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPassword });
      if (res.user?.role !== 'admin') {
        alert('Access denied. Administrator privileges required.');
        return;
      }
      setCurrentUser(res.user);
      clearClientLogoutMarker();
      onAuthSuccess?.(res.user);
      showToast(`Welcome back, ${res.user.name}!`);
    } catch (err) {
      alert(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentUser(null);
      showToast('Logged out of Admin Console');
      onLogout?.();
    }
  };

  // Product CRUD
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'Orthopaedic Belts',
      price: '',
      originalPrice: '',
      description: '',
      features: '',
      sizes: 'Small, Medium, Large',
      images: '',
      inStock: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name || '',
      category: product.category || 'Orthopaedic Belts',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      images: Array.isArray(product.images) ? product.images.join(', ') : product.image || '',
      inStock: product.inStock ?? true,
    });
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productFormData.name,
        category: productFormData.category,
        price: Number(productFormData.price),
        originalPrice: productFormData.originalPrice ? Number(productFormData.originalPrice) : undefined,
        description: productFormData.description,
        features: productFormData.features
          ? productFormData.features.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        sizes: productFormData.sizes
          ? productFormData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Standard'],
        images: productFormData.images
          ? productFormData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        inStock: Boolean(productFormData.inStock),
      };

      if (editingProduct) {
        await api.updateAdminProduct(editingProduct._id, payload);
        showToast(`Product "${payload.name}" updated successfully!`);
      } else {
        await api.createAdminProduct(payload);
        showToast(`Product "${payload.name}" created successfully!`);
      }

      setIsProductModalOpen(false);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.deleteAdminProduct(id);
      showToast('Product deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  // User CRUD
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'customer',
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'customer',
    });
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const payload = {
          name: userFormData.name,
          email: userFormData.email,
          phone: userFormData.phone,
          role: userFormData.role,
        };
        await api.updateAdminUser(editingUser._id, payload);
        showToast(`User "${payload.name}" updated successfully!`);
      } else {
        if (!userFormData.password || userFormData.password.length < 8) {
          alert('Password must be at least 8 characters long for new users.');
          return;
        }
        await api.createAdminUser(userFormData);
        showToast(`User "${userFormData.name}" created successfully!`);
      }

      setIsUserModalOpen(false);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.deleteAdminUser(id);
      showToast('User deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Order CRUD
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { orderStatus: newStatus });
      showToast(`Order status updated to ${newStatus}`);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { paymentStatus: newPaymentStatus });
      showToast(`Payment status updated to ${newPaymentStatus}`);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await api.deleteAdminOrder(id);
      showToast('Order deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete order');
    }
  };

  const confirmDelete = () => {
    const { type, id } = deleteConfirmModal;
    if (type === 'product') handleDeleteProduct(id);
    if (type === 'user') handleDeleteUser(id);
    if (type === 'order') handleDeleteOrder(id);
    setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '' });
  };

  // IF NOT LOGGED IN AS ADMIN: DISPLAY LOGIN FORM
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-900 text-white grid place-items-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#005550] mx-auto grid place-items-center">
            <ShieldCheck className="w-7 h-7 text-teal-200" />
          </div>
          <p className="text-sm font-bold text-slate-300">Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#005550] text-teal-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-sansita text-2xl font-bold">Synergy Admin Console</h1>
            <p className="text-xs text-slate-400">Strictly for authorized management personnel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#005550] hover:bg-[#007068] text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Console'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-[#444444] pb-24">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003d39] via-[#005550] to-[#007068] text-white py-10 px-4 sm:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Synergy Medical Yoga Management Console</span>
            </div>
            <h1 className="font-sansita text-3xl sm:text-4xl font-bold tracking-tight">
              Admin Control Panel
            </h1>
            <p className="text-teal-100 text-sm mt-1">
              Logged in as <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerRefresh}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border border-rose-400/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Management ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Users &amp; Therapists ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Website CMS ({contentItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'enquiries'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Enquiries ({enquiries.length})</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && <OverviewTab stats={stats} setActiveTab={setActiveTab} />}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            openAddProductModal={openAddProductModal}
            openEditProductModal={openEditProductModal}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'users' && (
          <UsersTab
            users={users}
            openAddUserModal={openAddUserModal}
            openEditUserModal={openEditUserModal}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleUpdatePaymentStatus={handleUpdatePaymentStatus}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'content' && (
          <ContentManager
            items={contentItems}
            refresh={triggerRefresh}
            showToast={showToast}
          />
        )}
        {activeTab === 'enquiries' && (
          <EnquiriesManager
            enquiries={enquiries}
            refresh={triggerRefresh}
            showToast={showToast}
          />
        )}
      </div>

      {/* --- MODAL: PRODUCT CREATE / EDIT --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sansita text-2xl font-bold text-gray-900 mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Back Support Lumbar Belt"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  >
                    <option value="Orthopaedic Belts">Orthopaedic Belts</option>
                    <option value="Therapy Ropes & Kits">Therapy Ropes &amp; Kits</option>
                    <option value="Yoga Props">Yoga Props</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="1299"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Original Price (₹ - Optional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1599"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Small, Medium, Large"
                    value={productFormData.sizes}
                    onChange={(e) => setProductFormData({ ...productFormData, sizes: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://your-cdn.example/path/product.jpg"
                  value={productFormData.images}
                  onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Product features and medical benefit details..."
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Features (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Ergonomic Velcro adjustment, Medical grade neoprene"
                  value={productFormData.features}
                  onChange={(e) => setProductFormData({ ...productFormData, features: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={productFormData.inStock}
                  onChange={(e) => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <label htmlFor="inStock" className="font-bold text-gray-800 cursor-pointer">
                  Product is currently in stock
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#005550] hover:bg-[#003d39] text-white shadow-md shadow-[#005550]/20 transition-all cursor-pointer"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: USER CREATE / EDIT --- */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sansita text-2xl font-bold text-gray-900 mb-6">
              {editingUser ? 'Edit User Details' : 'Add New User Account'}
            </h3>

            <form onSubmit={handleUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Sharma"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Account Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-700 mb-1">Account Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                >
                  <option value="customer">Customer / Patient</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#005550] hover:bg-[#003d39] text-white shadow-md shadow-[#005550]/20 transition-all cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CONFIRM DELETE --- */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Confirm Deletion</h4>
            <p className="text-xs text-gray-600 mt-2">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{deleteConfirmModal.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
