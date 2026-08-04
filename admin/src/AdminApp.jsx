import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
  Lock,
  Eye,
  EyeOff,
  Palette,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { api, clearClientLogoutMarker, wasClientLoggedOut } from './lib/api';

import OverviewTab from './components/OverviewTab';
import ProductsTab from './components/ProductsTab';
import UsersTab from './components/UsersTab';
import OrdersTab from './components/OrdersTab';

function ContentManager({ items = [], refresh, showToast }) {
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [form, setForm] = useState({
    type: 'blog',
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    imageUrl: '',
    imageAlt: '',
    buttonText: '',
    buttonLink: '',
    isPublished: true,
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      type: 'blog',
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      imageUrl: '',
      imageAlt: '',
      buttonText: '',
      buttonLink: '',
      isPublished: true,
    });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      type: item.type || 'blog',
      title: item.title || '',
      slug: item.slug || '',
      excerpt: item.excerpt || '',
      body: item.body || '',
      imageUrl: item.imageUrl || item.src || item.image || '',
      imageAlt: item.imageAlt || item.alt || '',
      buttonText: item.buttonText || '',
      buttonLink: item.buttonLink || '',
      isPublished: item.isPublished ?? true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateAdminContentItem(editingId, form);
        showToast?.('Content updated');
      } else {
        await api.createAdminContentItem(form);
        showToast?.('Content created');
      }
      resetForm();
      refresh?.();
    } catch (err) {
      alert(err.message || 'Failed to save CMS item');
    }
  };

  const togglePublished = async (item) => {
    try {
      await api.updateAdminContentItem(item._id, { isPublished: !item.isPublished });
      showToast?.(item.isPublished ? 'Content unpublished' : 'Content published');
      refresh?.();
    } catch (err) {
      alert(err.message || 'Failed to toggle publish status');
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      await api.deleteAdminContentItem(item._id);
      showToast?.('Content deleted');
      refresh?.();
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const filteredItems = filterType === 'all'
    ? items
    : items.filter((i) => (i.type || 'blog').toLowerCase() === filterType.toLowerCase());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* CMS CREATE / EDIT FORM */}
      <form onSubmit={handleSubmit} className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-sansita text-2xl font-bold text-[#005550]">
            {editingId ? 'Edit CMS Item' : 'Create New CMS Item'}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-slate-100 px-3 py-1 rounded-xl cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Content Type *</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          >
            <option value="blog">Blog Post / Article</option>
            <option value="carousel">Hero Banner Carousel</option>
            <option value="faq">FAQ Question &amp; Answer</option>
            <option value="testimonial">Patient / Course Testimonial</option>
            <option value="gallery">Media Gallery Item</option>
            <option value="video">Clinical Video</option>
            <option value="course">Course / Syllabus Entry</option>
            <option value="policy">Policy / Terms Page</option>
            <option value="page">Custom Page</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Title / Headline *</label>
          <input
            required
            type="text"
            placeholder="e.g. Benefits of Rope & Belt Therapy for Knee Pain"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Slug (URL Keyword - Optional)</label>
          <input
            type="text"
            placeholder="knee-pain-rbt-benefits"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Excerpt / Subtitle / Short Summary</label>
          <textarea
            rows={2}
            placeholder="Brief summary displayed on cards or hero banners..."
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Full Body Content / Description</label>
          <textarea
            rows={4}
            placeholder="Full article body, FAQ detailed answer, or course overview..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              placeholder="https://.../banner.jpg"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Image Alt Text</label>
            <input
              type="text"
              placeholder="Synergy Medical Therapy"
              value={form.imageAlt}
              onChange={(e) => setForm({ ...form, imageAlt: e.target.value })}
              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
        </div>

        {form.type === 'carousel' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/60 p-3 rounded-2xl border border-teal-100">
            <div>
              <label className="block font-bold text-teal-900 mb-1">Button Text</label>
              <input
                type="text"
                placeholder="Explore Shop / Book Now"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-teal-900 mb-1">Button Link</label>
              <input
                type="text"
                placeholder="/shop or /contact"
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                className="w-full bg-white border border-teal-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="cmsPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
          />
          <label htmlFor="cmsPublished" className="font-bold text-gray-800 cursor-pointer">
            Publish immediately to website
          </label>
        </div>

        <button className="w-full bg-[#005550] hover:bg-[#003d39] text-white py-3 rounded-xl font-bold shadow-md shadow-[#005550]/20 transition-all cursor-pointer">
          {editingId ? 'Update CMS Item' : 'Create CMS Content'}
        </button>
      </form>

      {/* CMS LIBRARY DISPLAY */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-sansita text-2xl font-bold text-[#005550]">Website Content Library</h3>
            <p className="text-xs text-gray-500">Manage published articles, banners, FAQs, and pages.</p>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['all', 'blog', 'carousel', 'faq', 'testimonial', 'policy'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  filterType === t
                    ? 'bg-[#005550] text-white shadow-xs'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          {filteredItems.map((item) => (
            <div key={item._id} className="border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-teal-200 transition-all bg-slate-50/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-teal-100 text-[#005550]">
                    {item.type || 'blog'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.title}</h4>
                {item.excerpt && <p className="text-xs text-gray-600 line-clamp-1">{item.excerpt}</p>}
                {item.slug && <p className="text-[11px] text-teal-700 font-mono">/{item.slug}</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#005550] text-xs font-bold transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => togglePublished(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {item.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => deleteItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-1">
              <p className="text-sm font-bold text-gray-600">No CMS items found</p>
              <p className="text-xs text-gray-400">Use the form on the left to publish new content to your website.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EnquiriesManager({ enquiries = [], refresh, showToast }) {
  const updateStatus = async (enquiry, status) => {
    try {
      await api.updateAdminContactMessageStatus(enquiry._id, { status });
      showToast?.('Enquiry updated');
      refresh?.();
    } catch (err) {
      alert(err.message || 'Failed to update enquiry status');
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      await api.deleteAdminContactMessage(id);
      showToast?.('Enquiry deleted');
      refresh?.();
    } catch (err) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-sansita text-2xl font-bold text-[#005550]">Website Enquiries &amp; Patient Messages</h3>
        <p className="text-xs text-gray-500">Contact form submissions from ruturajgholap5019@gmail.com testing mode &amp; website users.</p>
      </div>

      <div className="space-y-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry._id} className="border border-gray-200/90 rounded-2xl p-5 space-y-3 bg-slate-50/50 hover:border-teal-200 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-base">{enquiry.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{enquiry.email} • {enquiry.phone}</p>
                <p className="text-xs font-bold text-[#005550] mt-1 bg-teal-50 px-2.5 py-1 rounded-lg inline-block border border-teal-100">
                  Subject: {enquiry.subject || 'General Enquiry'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={enquiry.status || 'new'}
                  onChange={(e) => updateStatus(enquiry, e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 shadow-xs outline-none cursor-pointer focus:border-[#005550]"
                >
                  <option value="new">New Inquiry</option>
                  <option value="read">Mark Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => deleteEnquiry(enquiry._id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all cursor-pointer"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100 text-xs text-gray-700 whitespace-pre-line leading-relaxed">
              {enquiry.message}
            </div>
          </div>
        ))}

        {enquiries.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200 space-y-1">
            <p className="text-sm font-bold text-gray-600">No contact enquiries received yet</p>
            <p className="text-xs text-gray-400">Submissions from the website Contact Us page will appear here.</p>
          </div>
        )}
      </div>
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

  // Admin Control Panel Background Theme State
  const [adminBgTheme, setAdminBgTheme] = useState(() => {
    try {
      return localStorage.getItem('synergy_admin_bg_theme') || 'mint-teal';
    } catch (e) {
      return 'mint-teal';
    }
  });

  // Password visibility states
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);

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

  // Single clean toast handler (short 2-4 words)
  const showToast = (msg) => {
    if (!msg) return;
    toast.success(msg, { toastId: msg, autoClose: 2000 });
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
      showToast('Logged in');
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
      showToast('Logged out');
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
        showToast('Product updated');
      } else {
        await api.createAdminProduct(payload);
        showToast('Product created');
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
      showToast('Product deleted');
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
    if (userFormData.phone) {
      let cleanPhone = userFormData.phone.replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(2);
      }
      if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        alert('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
        return;
      }
    }
    try {
      if (editingUser) {
        const payload = {
          name: userFormData.name,
          email: userFormData.email,
          phone: userFormData.phone,
          role: userFormData.role,
        };
        await api.updateAdminUser(editingUser._id, payload);
        showToast('User updated');
      } else {
        if (!userFormData.password || userFormData.password.length < 8) {
          alert('Password must be at least 8 characters long for new users.');
          return;
        }
        await api.createAdminUser(userFormData);
        showToast('User created');
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
      showToast('User deleted');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Order CRUD
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { orderStatus: newStatus });
      showToast('Order updated');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { paymentStatus: newPaymentStatus });
      showToast('Payment status updated');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await api.deleteAdminOrder(id);
      showToast('Order deleted');
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
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                  title={showAdminPassword ? "Hide password" : "Show password"}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
    <div className="min-h-screen bg-[#F4F8F8] font-inter text-slate-800 pb-24">
      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#003D39] text-white border-b border-teal-500/20 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005550] flex items-center justify-center border border-teal-400/30 text-white font-black text-lg shadow-md">
              🌿
            </div>
            <div>
              <span className="font-sansita font-bold text-lg text-white tracking-wide block leading-none">
                Synergy Medical Yoga
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-white/20 backdrop-blur-xs transition-all cursor-pointer shadow-xs"
              title="Open main website in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-200" />
              <span>View Live Website</span>
            </a>
            
            <div className="hidden lg:flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-teal-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.name}</span>
            </div>

            <button
              onClick={triggerRefresh}
              className="bg-white/10 hover:bg-white/20 text-white p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
              title="Refresh console data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-200 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-400/30 backdrop-blur-xs transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Header Banner */}
      <div className="bg-[#003D39] text-white py-10 px-4 sm:px-8 shadow-xl relative overflow-hidden border-b border-teal-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-[#002d2a] via-[#004d47] to-[#003834] opacity-95"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                System Operational
              </span>
              <span className="text-teal-200 font-semibold text-xs">Synergy Medical Management</span>
            </div>
            <h1 className="font-sansita text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3 drop-shadow-sm">
              Admin Control Panel
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1.5 font-medium">
              Authorized Session: <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">{currentUser.name}</span> <span className="text-teal-200">({currentUser.email})</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#005550] hover:bg-teal-50 px-4.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02]"
            >
              <ExternalLink className="w-4 h-4 text-[#005550]" />
              <span>Go to Website</span>
            </a>
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
                  maxLength={15}
                  placeholder="98765 43210 (10 digits)"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15) })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Valid 10-digit mobile number</span>
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Account Password</label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      title={showUserPassword ? "Hide password" : "Show password"}
                    >
                      {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
