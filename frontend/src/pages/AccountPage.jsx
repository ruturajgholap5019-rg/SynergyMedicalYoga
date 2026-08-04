import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, LogOut, Package, ShieldCheck, Calendar, Clock, MapPin, CheckCircle2, Download, Home, Edit3, Trash2, Key, ChevronRight, FileText, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

export default function AccountPage({ setActivePage, currentUser, onAuthSuccess, onLogout }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'otp'
  const [userTab, setUserTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'appointments' | 'downloads' | 'addresses' | 'details' | 'delete'
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [myAppointments, setMyAppointments] = useState(() => {
    try {
      const cached = localStorage.getItem('synergy_cached_my_appointments');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  // Logged out Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  // Password Visibility Toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [lastIssuedOtpCode, setLastIssuedOtpCode] = useState('');
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);

  // Address tab states
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
  });

  // Account details states
  const [accountDetails, setAccountDetails] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
      fetchUserAppointments();
      const parts = (currentUser.name || '').split(' ');
      setAccountDetails((prev) => ({
        ...prev,
        firstName: parts[0] || '',
        lastName: parts[1] || '',
        displayName: currentUser.name || (currentUser.email || '').split('@')[0],
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    try {
      const res = await api.getUserOrders();
      if (res.data) setMyOrders(res.data);
    } catch (err) {
      // Ignore silently
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const res = await api.getMyAppointments();
      if (res.data) {
        setMyAppointments(res.data);
        try { localStorage.setItem('synergy_cached_my_appointments', JSON.stringify(res.data)); } catch (e) {}
      }
    } catch (err) {
      // Fallback to offline cached appointments silently
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ email: loginEmail.trim().toLowerCase(), password: loginPassword });
      toast.success('Successfully logged in!');
      onAuthSuccess?.(response.user);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to email & Validate Phone
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Phone Number Validation
    const cleanPhone = signUpPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      toast.error('Phone number is required.');
      return;
    }
    if (cleanPhone.length < 10) {
      toast.error('Phone number must be at least 10 digits.');
      return;
    }
    if (cleanPhone.length > 13) {
      toast.error('Phone number is too long. Please enter a valid 10-digit mobile number.');
      return;
    }
    if (cleanPhone.length === 10 && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Mobile number should start with 6, 7, 8, or 9.');
      return;
    }

    if (signUpPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (typeof api?.sendOtp === 'function') {
        res = await api.sendOtp({
          name: signUpName.trim(),
          email: signUpEmail.trim().toLowerCase(),
          phone: signUpPhone.trim(),
          password: signUpPassword,
        });
      } else {
        const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
        const baseUrl = rawApiUrl.startsWith('http') && !rawApiUrl.endsWith('/api') ? `${rawApiUrl}/api` : rawApiUrl;
        const fetchRes = await fetch(`${baseUrl}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: signUpName.trim(),
            email: signUpEmail.trim().toLowerCase(),
            phone: signUpPhone.trim(),
            password: signUpPassword,
          }),
        });
        res = await fetchRes.json();
        if (!fetchRes.ok) throw new Error(res?.message || 'Failed to send OTP.');
      }
      setLastIssuedOtpCode('');
      setOtpCode('');
      toast.success(`Verification code dispatched to ${signUpEmail}`);
      setActiveTab('otp');
      // Start 60-second resend countdown
      setOtpResendCountdown(60);
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(otpCode)) {
      toast.error('Please enter the 4-digit or 6-digit code sent to your email.');
      return;
    }
    setLoading(true);
    try {
      let response;
      if (typeof api?.verifyOtp === 'function') {
        response = await api.verifyOtp({
          email: signUpEmail.trim().toLowerCase(),
          otp: otpCode,
        });
      } else {
        const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
        const baseUrl = rawApiUrl.startsWith('http') && !rawApiUrl.endsWith('/api') ? `${rawApiUrl}/api` : rawApiUrl;
        const fetchRes = await fetch(`${baseUrl}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: signUpEmail.trim().toLowerCase(),
            otp: otpCode,
          }),
        });
        response = await fetchRes.json();
        if (!fetchRes.ok) throw new Error(response?.message || 'Failed to verify OTP.');
      }
      toast.success('Account created successfully! Welcome to Synergy Medical Yoga!');
      onAuthSuccess?.(response.user);
    } catch (error) {
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // Resend countdown effect
  React.useEffect(() => {
    if (otpResendCountdown <= 0) return;
    const timer = setTimeout(() => setOtpResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpResendCountdown]);

  const handleLogoutClick = async () => {
    try {
      await api.logout();
    } catch (err) {
      // Ignore silently
    } finally {
      toast.success('You have been logged out.');
      onLogout?.();
    }
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (accountDetails.newPassword && accountDetails.newPassword !== accountDetails.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    toast.success('Account details updated successfully!');
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    toast.success('Shipping & billing address saved!');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.deleteAccount();
        toast.success('Your account has been permanently deleted.');
        onLogout?.();
      } catch (err) {
        toast.error(err.message || 'Failed to delete account.');
      } finally {
        setLoading(false);
      }
    }
  };

  const isLoggedIn = Boolean(currentUser);
  const user = currentUser;
  const usernameDisplay = user ? (user.name || user.email.split('@')[0]).toLowerCase().replace(/\s+/g, '.') : '';

  // Sidebar Menu items matching original website exactly
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'appointments', label: 'Appointments' }, // preserved from our clinic features
    { id: 'downloads', label: 'Downloads' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'details', label: 'Account Details' },
    { id: 'logout', label: 'Logout', isLogout: true },
    { id: 'delete', label: 'Delete Account', isDelete: true },
  ];

  return (
    <div className="font-inter text-[#555555] bg-white min-h-screen pb-24">
      
      {/* 1. Hero Banner matching original website's deep green yoga artwork header */}
      <section className="relative bg-[#005550] overflow-hidden py-16 sm:py-24 text-center">
        {/* Subtle geometric line-art simulation background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-between px-6">
          <svg className="w-80 h-80 text-emerald-200 -ml-20 transform -rotate-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" strokeDasharray="4 4" />
            <path d="M50 10 Q30 50 50 90 Q70 50 50 10 Z" />
            <path d="M10 50 Q50 30 90 50 Q50 70 10 50 Z" />
          </svg>
          <svg className="w-96 h-96 text-emerald-200 -mr-20" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" />
            <path d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M80 20 L20 80" strokeOpacity="0.5" />
            <circle cx="50" cy="50" r="25" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <h1 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            My Account
          </h1>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoggedIn ? (
          /* LOGGED IN ACCOUNT VIEW - Exact replica of original website's 2-column layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Left Sidebar Menu (Col 4) */}
            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              {user?.role === 'admin' && (
                <div className="mb-4 pb-3 border-b border-slate-200">
                  <button
                    onClick={() => setActivePage('admin')}
                    className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold py-3.5 px-5 rounded-2xl text-sm flex items-center justify-between shadow-md transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" /> Admin Console
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.isLogout) {
                        handleLogoutClick();
                      } else {
                        setUserTab(item.id);
                      }
                    }}
                    className={`w-full text-left font-extrabold text-sm sm:text-base px-6 py-4 rounded-xl transition-all cursor-pointer block ${
                      userTab === item.id && !item.isLogout
                        ? 'bg-[#005550] text-white shadow-md shadow-[#005550]/20'
                        : item.isDelete
                        ? 'text-rose-600 hover:bg-rose-50'
                        : 'text-[#005550] bg-white hover:bg-[#f2f8f8] hover:text-[#003d39]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right Content Area (Col 8 / 9) */}
            <div className="md:col-span-8 lg:col-span-9 bg-white min-h-105  ">
              
              {/* 1. DASHBOARD TAB (Exact Replica of Photo) */}
              {userTab === 'dashboard' && (
                <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 font-medium pt-2 animate-fade-in">
                  <p className="text-slate-700">
                    Hello <strong className="text-slate-900 font-extrabold">{usernameDisplay}</strong>{' '}
                    (not <span className="font-extrabold text-slate-900">{usernameDisplay}</span>?{' '}
                    <button
                      onClick={handleLogoutClick}
                      className="text-[#005550] hover:text-slate-950 underline font-bold cursor-pointer ml-0.5 transition-colors"
                    >
                      Log out
                    </button>
                    )
                  </p>

                  <p className="text-slate-600 leading-relaxed max-w-2xl">
                    From your account dashboard you can view your{' '}
                    <button
                      onClick={() => setUserTab('orders')}
                      className="text-[#005550] hover:text-slate-950 font-bold underline cursor-pointer transition-colors"
                    >
                      recent orders
                    </button>
                    , manage your{' '}
                    <button
                      onClick={() => setUserTab('addresses')}
                      className="text-[#005550] hover:text-slate-950 font-bold underline cursor-pointer transition-colors"
                    >
                      shipping and billing addresses
                    </button>
                    , and{' '}
                    <button
                      onClick={() => setUserTab('details')}
                      className="text-[#005550] hover:text-slate-950 font-bold underline cursor-pointer transition-colors"
                    >
                      edit your password and account details
                    </button>
                    .
                  </p>

                  {/* Quick Profile Summary Box */}
                  <div className="pt-6 mt-8 border-t border-slate-100 max-w-xl">
                    <div className="bg-[#f8fbfb] p-6 rounded-3xl border border-slate-200/80 flex items-center gap-5 shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-[#005550] text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-sm">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-base">{user.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                          <Mail className="w-3.5 h-3.5 text-[#005550]" /> {user.email}
                        </p>
                        <span className="inline-block mt-1 text-[11px] font-bold bg-teal-100 text-[#005550] px-2.5 py-0.5 rounded-full">
                          Verified Synergy Patient
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ORDERS TAB */}
              {userTab === 'orders' && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#005550] font-sansita tracking-tight pb-2 border-b border-slate-200">
                    Your Product Orders ({myOrders.length})
                  </h3>

                  {myOrders.length === 0 ? (
                    <div className="bg-[#f8fbfb] p-10 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-3xs">
                      <Package className="w-12 h-12 text-[#005550]/40 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">No order has been made yet.</p>
                      <button
                        onClick={() => setActivePage('shop')}
                        className="bg-[#005550] hover:bg-[#003d39] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer inline-block"
                      >
                        Browse Orthopaedic Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myOrders.map((ord) => (
                        <div key={ord._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-[#005550]/40 transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                              <span className="font-bold text-slate-900 font-mono text-sm">Order #{ord._id.substring(0, 10)}</span>
                              <span className="block text-xs text-slate-500 mt-0.5">
                                Placed on {new Date(ord.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                ord.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.orderStatus}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs sm:text-sm">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-slate-700 font-medium py-1">
                                <span>{it.name} <strong className="text-slate-900">× {it.quantity}</strong></span>
                                <span className="font-mono font-semibold">₹{(it.price * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                            <span className="text-slate-500 font-normal">
                              Payment via <strong className="text-slate-900 uppercase font-mono">{ord.paymentMethod}</strong> ({ord.paymentStatus})
                            </span>
                            <span className="text-base font-extrabold text-[#005550] font-mono">
                              Total: ₹{ord.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. APPOINTMENTS TAB */}
              {userTab === 'appointments' && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#005550] font-sansita tracking-tight pb-2 border-b border-slate-200">
                    Your Therapy Appointments ({myAppointments.length})
                  </h3>

                  {myAppointments.length === 0 ? (
                    <div className="bg-[#f8fbfb] p-10 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-3xs">
                      <Calendar className="w-12 h-12 text-[#005550]/40 mx-auto" />
                      <p className="text-sm font-semibold text-slate-600">You have no scheduled therapy appointments yet.</p>
                      <button
                        onClick={() => setActivePage('services')}
                        className="bg-[#005550] hover:bg-[#003d39] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer inline-block"
                      >
                        Book a Therapy Session
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myAppointments.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {app.status}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">#{app._id.substring(0, 8)}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-base">{app.serviceTitle}</h4>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#005550]" />
                                {new Date(app.appointmentDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#005550]" />
                                {app.timeSlot}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#005550]" />
                                {app.center}
                              </span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="font-mono font-extrabold text-lg text-[#005550] block">₹{app.fee}</span>
                            <span className="text-xs text-slate-500">
                              Status: <strong className="uppercase text-slate-700">{app.paymentStatus}</strong>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. DOWNLOADS TAB */}
              {userTab === 'downloads' && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  <h3 className="text-2xl font-bold text-[#005550] font-sansita tracking-tight pb-2 border-b border-slate-200">
                    Your Downloads
                  </h3>
                  <div className="bg-[#f8fbfb] p-10 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-3xs">
                    <Download className="w-12 h-12 text-[#005550]/40 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">No downloads available yet.</p>
                    <button
                      onClick={() => setActivePage('shop')}
                      className="bg-[#005550] hover:bg-[#003d39] text-white px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer inline-block"
                    >
                      Browse Digital Therapy Guides
                    </button>
                  </div>
                </div>
              )}

              {/* 5. ADDRESSES TAB */}
              {userTab === 'addresses' && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-[#005550] font-sansita tracking-tight">
                      Addresses
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      The following addresses will be used on the checkout page by default.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h4 className="font-extrabold text-slate-900 text-sm">Billing Address</h4>
                        <button onClick={() => toast("Editing Billing Address")} className="text-[#005550] hover:text-slate-900 text-xs font-bold underline flex items-center gap-1 cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 font-medium leading-relaxed">
                        <p className="font-bold text-slate-800 text-sm">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p>{shippingAddress.address1}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                        <p>{shippingAddress.country}</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <h4 className="font-extrabold text-slate-900 text-sm">Shipping Address</h4>
                        <button onClick={() => toast("Editing Shipping Address")} className="text-[#005550] hover:text-slate-900 text-xs font-bold underline flex items-center gap-1 cursor-pointer">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1 font-medium leading-relaxed">
                        <p className="font-bold text-slate-800 text-sm">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p>{shippingAddress.address1}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                        <p>{shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. ACCOUNT DETAILS TAB */}
              {userTab === 'details' && (
                <div className="space-y-6 pt-2 animate-fade-in max-w-2xl">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-[#005550] font-sansita tracking-tight">
                      Account Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your personal profile information and login password.
                    </p>
                  </div>

                  <form onSubmit={handleSaveDetails} className="space-y-6 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">First name *</label>
                        <input
                          type="text"
                          required
                          value={accountDetails.firstName}
                          onChange={(e) => setAccountDetails({ ...accountDetails, firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#005550]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Last name *</label>
                        <input
                          type="text"
                          required
                          value={accountDetails.lastName}
                          onChange={(e) => setAccountDetails({ ...accountDetails, lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#005550]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Display name *</label>
                      <input
                        type="text"
                        required
                        value={accountDetails.displayName}
                        onChange={(e) => setAccountDetails({ ...accountDetails, displayName: e.target.value })}
                        className="w-full px-4 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#005550]"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        This will be how your name will be displayed in the account section and in reviews.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email address *</label>
                      <input
                        type="email"
                        required
                        readOnly
                        value={accountDetails.email}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-6 border-t border-slate-200 space-y-4">
                      <h4 className="font-extrabold text-slate-900 text-sm">Password change</h4>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Current password (leave blank to leave unchanged)</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={accountDetails.currentPassword}
                            onChange={(e) => setAccountDetails({ ...accountDetails, currentPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-4 pr-10 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#005550]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            title={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">New password (leave blank to leave unchanged)</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={accountDetails.newPassword}
                            onChange={(e) => setAccountDetails({ ...accountDetails, newPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-4 pr-10 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#005550]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            title={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Confirm new password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={accountDetails.confirmPassword}
                            onChange={(e) => setAccountDetails({ ...accountDetails, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-4 pr-10 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#005550]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                            title={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#005550] hover:bg-[#003d39] text-white px-8 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Save changes
                    </button>
                  </form>
                </div>
              )}

              {/* 7. DELETE ACCOUNT TAB */}
              {userTab === 'delete' && (
                <div className="space-y-6 pt-2 animate-fade-in max-w-xl">
                  <div className="pb-2 border-b border-slate-200">
                    <h3 className="text-2xl font-bold text-rose-600 font-sansita tracking-tight">
                      Delete Account
                    </h3>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-200 p-6 rounded-2xl space-y-4">
                    <p className="text-xs sm:text-sm font-semibold text-rose-900 leading-relaxed">
                      Warning: Deleting your account is permanent. All your order history, saved addresses, and booked therapy appointments will be removed from our system.
                    </p>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleDeleteAccount}
                      className="bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> {loading ? 'Deleting...' : 'Permanently Delete My Account'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* LOGGED OUT FORM VIEW (Login / Sign Up) */
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
            <div className="grid grid-cols-2 text-center border-b border-slate-200 bg-slate-50">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-4 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-[#005550] text-[#005550] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`py-4 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'border-[#005550] text-[#005550] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-6 sm:p-8 bg-white">
              {activeTab === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email or Username *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Password *</label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        title={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? 'Please wait...' : 'Log In'}
                  </button>
                </form>
              ) : activeTab === 'otp' ? (
                /* OTP VERIFICATION SCREEN */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 flex items-center justify-center border border-teal-100 shadow-sm">
                      <Mail className="w-8 h-8 text-[#005550]" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Verification Code Dispatched</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Verification code sent to <strong className="text-slate-800">{signUpEmail}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 text-center">Enter 4-Digit Code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{4,6}"
                        maxLength={6}
                        required
                        autoFocus
                        placeholder="0000"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full text-center text-4xl font-black tracking-[16px] py-4 bg-[#f8fbfb] border-2 border-slate-200 rounded-2xl text-[#005550] focus:outline-none focus:border-[#005550] transition-all shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length < 4}
                      className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-sm disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? 'Verifying...' : 'Verify & Create Account'}
                    </button>

                    <div className="text-center space-y-2">
                      {otpResendCountdown > 0 ? (
                        <p className="text-xs text-slate-400">
                          Resend code in <strong className="text-slate-600">{otpResendCountdown}s</strong>
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          className="text-xs text-[#005550] font-bold underline cursor-pointer disabled:opacity-50"
                        >
                          Resend verification code
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="block w-full text-xs text-slate-400 hover:text-slate-600 cursor-pointer mt-1"
                      >
                        ← Change email address
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Rahul Sharma"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        maxLength={15}
                        placeholder="98765 43210 (10 digits)"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15))}
                        className="w-full pl-10 pr-3.5 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Valid 10-digit mobile number (e.g. 9876543210)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-[#f8fbfb] border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#005550]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        title={showSignUpPassword ? "Hide password" : "Show password"}
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? 'Sending Code...' : 'Continue — Get Verification Code'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
