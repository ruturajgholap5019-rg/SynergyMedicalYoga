import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  RefreshCw,
  X,
  AlertCircle,
  ShieldCheck,
  Images,
  Activity,
  QrCode,
  Calendar,
  Upload,
  Link,
  Loader2,
  Check,
  Globe,
} from 'lucide-react';
import { api, getImageUrl } from '../lib/api';

import OverviewTab from './components/OverviewTab';
import ProductsTab from './components/ProductsTab';
import UsersTab from './components/UsersTab';
import OrdersTab from './components/OrdersTab';
import CarouselsTab from './components/CarouselsTab';
import ServicesTab from './components/ServicesTab';
import PaymentSettingsTab from './components/PaymentSettingsTab';
import AppointmentsTab from './components/AppointmentsTab';
import CmsContentTab from './components/CmsContentTab';

export default function AdminDashboard({ showToast, currentUser }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Dashboard Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCarousels: 0,
    totalServices: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });

  // Data Lists
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [settings, setSettings] = useState(null);

  // Modals & Active Edit Items
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

  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState(null);
  const [carouselFormData, setCarouselFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: 'Explore Shop',
    buttonLink: '/shop',
    order: 1,
    isActive: true,
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    category: 'Spine Therapy',
    description: '',
    price: '',
    duration: '60 mins',
    imageUrl: '',
    isActive: true,
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    type: null,
    id: null,
    title: '',
  });

  // Image Upload UX State (Multer vs URL Option)
  const [carouselImageMode, setCarouselImageMode] = useState('upload');
  const [uploadingCarouselImage, setUploadingCarouselImage] = useState(false);
  const [productImageMode, setProductImageMode] = useState('upload');
  const [uploadingProductImage, setUploadingProductImage] = useState(false);

  // Load Admin Data on mount or tab change
  useEffect(() => {
    if (currentUser?.role !== 'admin') return;
    fetchDashboardStats();
    if (activeTab === 'products' || activeTab === 'dashboard') fetchProducts();
    if (activeTab === 'users' || activeTab === 'dashboard') fetchUsers();
    if (activeTab === 'orders' || activeTab === 'dashboard') fetchOrders();
    if (activeTab === 'carousels' || activeTab === 'dashboard') fetchCarousels();
    if (activeTab === 'services' || activeTab === 'dashboard') fetchServices();
    if (activeTab === 'appointments' || activeTab === 'dashboard') fetchAppointments();
    if (activeTab === 'settings' || activeTab === 'cms' || activeTab === 'dashboard') fetchPaymentSettings();
  }, [activeTab, refreshKey, currentUser]);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  // API Fetchers
  const fetchDashboardStats = async () => {
    try {
      const res = await api.getAdminDashboard();
      if (res.data) setStats(res.data);
    } catch (err) {
      // Ignore silently
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProducts();
      if (res.data) setProducts(res.data);
    } catch (err) {
      showToast?.(err.message || 'Failed to fetch products');
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
      showToast?.(err.message || 'Failed to fetch users');
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
      showToast?.(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchCarousels = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCarousels();
      if (res.data) setCarousels(res.data);
    } catch (err) {
      showToast?.(err.message || 'Failed to fetch carousels');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminServices();
      if (res.data) setServices(res.data);
    } catch (err) {
      showToast?.(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAppointments();
      if (res.data) setAppointments(res.data);
    } catch (err) {
      showToast?.(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await api.getAdminPaymentSettings();
      if (res.data) setSettings(res.data);
    } catch (err) {
      // Ignore silently
    }
  };

  // --- APPOINTMENT HANDLERS ---
  const handleUpdateAppointmentStatus = async (id, newStatus) => {
    try {
      await api.updateAdminAppointmentStatus(id, { status: newStatus });
      showToast?.(`Appointment status updated to ${newStatus}`);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update appointment status');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await api.deleteAdminAppointment(id);
      showToast?.('Appointment deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete appointment');
    }
  };

  // --- CAROUSEL HANDLERS ---
  const openAddCarouselModal = () => {
    setEditingCarousel(null);
    setCarouselImageMode('upload');
    setCarouselFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: 'Explore Shop',
      buttonLink: '/shop',
      page: 'home',
      order: carousels.length + 1,
      isActive: true,
    });
    setIsCarouselModalOpen(true);
  };

  const openEditCarouselModal = (slide) => {
    setEditingCarousel(slide);
    setCarouselImageMode('url');
    setCarouselFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl || '',
      buttonText: slide.buttonText || 'Explore Shop',
      buttonLink: slide.buttonLink || '/shop',
      page: slide.page || 'home',
      order: slide.order || 1,
      isActive: slide.isActive ?? true,
    });
    setIsCarouselModalOpen(true);
  };

  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCarousel) {
        await api.updateAdminCarousel(editingCarousel._id, carouselFormData);
        showToast?.(`Carousel slide #${carouselFormData.order || 1} updated successfully!`);
      } else {
        await api.createAdminCarousel(carouselFormData);
        showToast?.(`Carousel slide #${carouselFormData.order || 1} created successfully!`);
      }
      setIsCarouselModalOpen(false);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to save carousel slide');
    }
  };

  const handleDeleteCarousel = async (id) => {
    try {
      await api.deleteAdminCarousel(id);
      showToast?.('Carousel slide deleted');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete carousel slide');
    }
  };

  const handleCarouselFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCarouselImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadAdminImage(formData);
      if (res && res.url) {
        setCarouselFormData((prev) => ({ ...prev, imageUrl: res.url }));
        showToast?.('Image uploaded successfully to Cloudinary!');
      }
    } catch (err) {
      alert(err.message || 'Failed to upload image file');
    } finally {
      setUploadingCarouselImage(false);
    }
  };

  // --- SERVICE HANDLERS ---
  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceFormData({
      title: '',
      category: 'Spine Therapy',
      description: '',
      price: '',
      duration: '60 mins',
      imageUrl: '',
      isActive: true,
    });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title || '',
      category: service.category || 'Spine Therapy',
      description: service.description || '',
      price: service.price ?? '',
      duration: service.duration || '60 mins',
      imageUrl: service.imageUrl || '',
      isActive: service.isActive ?? true,
    });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...serviceFormData,
        price: Number(serviceFormData.price),
      };
      if (editingService) {
        await api.updateAdminService(editingService._id, payload);
        showToast?.(`Service "${payload.title}" updated!`);
      } else {
        await api.createAdminService(payload);
        showToast?.(`Service "${payload.title}" created!`);
      }
      setIsServiceModalOpen(false);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await api.deleteAdminService(id);
      showToast?.('Service deleted');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    }
  };

  // --- PAYMENT SETTINGS HANDLER ---
  const handleSavePaymentSettings = async (formData) => {
    setSavingSettings(true);
    try {
      const res = await api.updateAdminPaymentSettings(formData);
      if (res.data) setSettings(res.data);
      showToast?.('Payment Gateway & UPI Scanner settings updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update payment settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // --- PRODUCT HANDLERS ---
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductImageMode('upload');
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
    setProductImageMode('url');
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
          : ['https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'],
        inStock: Boolean(productFormData.inStock),
      };

      if (editingProduct) {
        await api.updateAdminProduct(editingProduct._id, payload);
        showToast?.(`Product "${payload.name}" updated successfully!`);
      } else {
        await api.createAdminProduct(payload);
        showToast?.(`Product "${payload.name}" created successfully!`);
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
      showToast?.('Product deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleProductFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingProductImage(true);
    try {
      const formData = new FormData();
      if (files.length === 1) {
        formData.append('image', files[0]);
        const res = await api.uploadAdminImage(formData);
        if (res && res.url) {
          setProductFormData((prev) => ({
            ...prev,
            images: prev.images ? `${prev.images}, ${res.url}` : res.url,
          }));
          showToast?.('Product image uploaded successfully via Multer!');
        }
      } else {
        files.forEach((file) => formData.append('images', file));
        const res = await api.uploadAdminImages(formData);
        if (res && res.urls) {
          const newUrls = res.urls.join(', ');
          setProductFormData((prev) => ({
            ...prev,
            images: prev.images ? `${prev.images}, ${newUrls}` : newUrls,
          }));
          showToast?.(`${res.urls.length} product images uploaded successfully via Multer!`);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to upload product images');
    } finally {
      setUploadingProductImage(false);
    }
  };

  // --- USER HANDLERS ---
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
        showToast?.(`User "${payload.name}" updated successfully!`);
      } else {
        if (!userFormData.password || userFormData.password.length < 8) {
          alert('Password must be at least 8 characters long for new users.');
          return;
        }
        await api.createAdminUser(userFormData);
        showToast?.(`User "${userFormData.name}" created successfully!`);
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
      showToast?.('User deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // --- ORDER HANDLERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { orderStatus: newStatus });
      showToast?.(`Order status updated to ${newStatus}`);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      await api.updateAdminOrderStatus(orderId, { paymentStatus: newPaymentStatus });
      showToast?.(`Payment status updated to ${newPaymentStatus}`);
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await api.deleteAdminOrder(id);
      showToast?.('Order deleted successfully');
      triggerRefresh();
    } catch (err) {
      alert(err.message || 'Failed to delete order');
    }
  };

  // Confirm Delete Handler
  const confirmDelete = () => {
    const { type, id } = deleteConfirmModal;
    if (type === 'product') handleDeleteProduct(id);
    if (type === 'user') handleDeleteUser(id);
    if (type === 'order') handleDeleteOrder(id);
    if (type === 'carousel') handleDeleteCarousel(id);
    if (type === 'service') handleDeleteService(id);
    setDeleteConfirmModal({ isOpen: false, type: null, id: null, title: '' });
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-xl border border-gray-200 space-y-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="font-poppins font-bold text-2xl text-gray-900">Admin Access Restricted</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              You must be logged in with an administrator account to view the control panel.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-left text-xs space-y-1">
            <span className="font-bold text-gray-700 block">Default Admin Credentials:</span>
            <p className="font-mono text-[#005550]">Email: admin@synergy.com</p>
            <p className="font-mono text-[#005550]">Password: Admin@123456</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-[#444444] pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003d39] via-[#005550] to-[#007068] text-white py-10 px-4 sm:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Synergy Medical Yoga Management Console</span>
            </div>
            <h1 className="font-sansita text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Admin Control Panel
            </h1>
            <p className="text-teal-100 text-sm mt-1">
              Logged in as <span className="font-semibold text-white">{currentUser?.name || 'Administrator'}</span> ({currentUser?.email})
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
            onClick={() => setActiveTab('cms')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cms'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website CMS &amp; Live Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments ({appointments.length})</span>
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
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('carousels')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'carousels'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Images className="w-4 h-4" />
            <span>Carousels ({carousels.length})</span>
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
            <span>Users ({users.length})</span>
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
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI &amp; Scanner Config</span>
          </button>
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && <OverviewTab stats={stats} setActiveTab={setActiveTab} />}
        {activeTab === 'appointments' && (
          <AppointmentsTab
            appointments={appointments}
            handleUpdateStatus={handleUpdateAppointmentStatus}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            openAddProductModal={openAddProductModal}
            openEditProductModal={openEditProductModal}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'services' && (
          <ServicesTab
            services={services}
            openAddServiceModal={openAddServiceModal}
            openEditServiceModal={openEditServiceModal}
            setDeleteConfirmModal={setDeleteConfirmModal}
          />
        )}
        {activeTab === 'carousels' && (
          <CarouselsTab
            carousels={carousels}
            openAddCarouselModal={openAddCarouselModal}
            openEditCarouselModal={openEditCarouselModal}
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
        {activeTab === 'settings' && (
          <PaymentSettingsTab
            settings={settings}
            onSaveSettings={handleSavePaymentSettings}
            saving={savingSettings}
          />
        )}
        {activeTab === 'cms' && (
          <CmsContentTab
            settings={settings}
            onSaveSettings={handleSavePaymentSettings}
            saving={savingSettings}
          />
        )}
      </div>

      {/* --- MODAL: CAROUSEL CREATE / EDIT --- */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsCarouselModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sansita text-2xl font-bold text-gray-900 mb-6">
              {editingCarousel ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}
            </h3>

            <form onSubmit={handleCarouselSubmit} className="space-y-4 text-xs">

              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-gray-200/80">
                <label className="block font-bold text-gray-800 text-xs">Banner Image Source *</label>
                
                {/* Option Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCarouselImageMode('upload')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                      carouselImageMode === 'upload'
                        ? 'bg-white text-[#005550] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File (Cloudinary)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCarouselImageMode('url')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                      carouselImageMode === 'url'
                        ? 'bg-white text-[#005550] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Image URL Option</span>
                  </button>
                </div>

                {carouselImageMode === 'upload' ? (
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-white text-[#005550] rounded-xl border-2 border-dashed border-[#005550]/30 hover:border-[#005550] hover:bg-teal-50/30 transition-all cursor-pointer group">
                      {uploadingCarouselImage ? (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Loader2 className="w-6 h-6 animate-spin text-[#005550]" />
                          <span className="text-xs font-semibold">Uploading to Cloudinary cloud storage...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#005550] transition-colors" />
                          <span className="text-xs font-bold">Click to upload banner image</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP, GIF (Max 5MB)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCarouselFileUpload}
                        disabled={uploadingCarouselImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={carouselFormData.imageUrl}
                      onChange={(e) => setCarouselFormData({ ...carouselFormData, imageUrl: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                  </div>
                )}

                {/* Live Preview */}
                {carouselFormData.imageUrl && (
                  <div className="mt-3 p-2 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                    <img
                      src={getImageUrl(carouselFormData.imageUrl)}
                      alt="Banner Preview"
                      className="w-16 h-10 object-cover rounded-lg bg-slate-900 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Image ready
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">{carouselFormData.imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-800 text-xs mb-1">Target Display Page / Section *</label>
                <select
                  value={carouselFormData.page || 'home'}
                  onChange={(e) => setCarouselFormData({ ...carouselFormData, page: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#005550] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                >
                  <option value="home">Home Page Banner (Hero Slider)</option>
                  <option value="services">Services Page Banner (Promotional Slider)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="Explore Shop"
                    value={carouselFormData.buttonText}
                    onChange={(e) => setCarouselFormData({ ...carouselFormData, buttonText: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Slide Order (#)</label>
                  <input
                    type="number"
                    min="1"
                    value={carouselFormData.order}
                    onChange={(e) => setCarouselFormData({ ...carouselFormData, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="carouselIsActive"
                  checked={carouselFormData.isActive}
                  onChange={(e) => setCarouselFormData({ ...carouselFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <label htmlFor="carouselIsActive" className="font-bold text-gray-800 cursor-pointer">
                  Slide is active and visible on website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCarouselModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#005550] hover:bg-[#003d39] text-white shadow-md shadow-[#005550]/20 transition-all cursor-pointer"
                >
                  {editingCarousel ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: SERVICE CREATE / EDIT --- */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-sansita text-2xl font-bold text-gray-900 mb-6">
              {editingService ? 'Edit Therapy Service' : 'Add New Therapy Service'}
            </h3>

            <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cervical Traction Therapy"
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  >
                    <option value="Spine Therapy">Spine Therapy</option>
                    <option value="Joint Care">Joint Care</option>
                    <option value="Medical Yoga">Medical Yoga</option>
                    <option value="Postpartum Care">Postpartum Care</option>
                    <option value="General Wellness">General Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="1499"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Session Duration</label>
                  <input
                    type="text"
                    placeholder="60 mins"
                    value={serviceFormData.duration}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={serviceFormData.imageUrl}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Medical benefits, treatment process, and target conditions..."
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="serviceIsActive"
                  checked={serviceFormData.isActive}
                  onChange={(e) => setServiceFormData({ ...serviceFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <label htmlFor="serviceIsActive" className="font-bold text-gray-800 cursor-pointer">
                  Service is active for booking
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#005550] hover:bg-[#003d39] text-white shadow-md shadow-[#005550]/20 transition-all cursor-pointer"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-gray-200/80">
                <label className="block font-bold text-gray-800 text-xs">Product Image Source</label>
                
                {/* Option Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/60 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setProductImageMode('upload')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                      productImageMode === 'upload'
                        ? 'bg-white text-[#005550] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File (Multer)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductImageMode('url')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                      productImageMode === 'url'
                        ? 'bg-white text-[#005550] shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Image URL Option</span>
                  </button>
                </div>

                {productImageMode === 'upload' ? (
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-white text-[#005550] rounded-xl border-2 border-dashed border-[#005550]/30 hover:border-[#005550] hover:bg-teal-50/30 transition-all cursor-pointer group">
                      {uploadingProductImage ? (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <Loader2 className="w-6 h-6 animate-spin text-[#005550]" />
                          <span className="text-xs font-semibold">Uploading via Multer...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-2 text-gray-400 group-hover:text-[#005550] transition-colors" />
                          <span className="text-xs font-bold">Click to upload product image(s)</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">Select single or multiple images (PNG, JPG, WEBP)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProductFileUpload}
                        disabled={uploadingProductImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..., https://..."
                      value={productFormData.images}
                      onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">For multiple URLs, separate them with commas.</p>
                  </div>
                )}

                {/* Live Previews */}
                {productFormData.images && (
                  <div className="mt-3 p-2.5 bg-white rounded-xl border border-gray-200">
                    <p className="text-[11px] font-bold text-gray-800 flex items-center gap-1 mb-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Selected Image Previews
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {productFormData.images.split(',').map((url, index) => {
                        const trimmed = url.trim();
                        if (!trimmed) return null;
                        return (
                          <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden w-14 h-14 bg-slate-50">
                            <img src={getImageUrl(trimmed)} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
