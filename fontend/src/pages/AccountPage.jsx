import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, LogOut, Package, ShieldCheck, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

export default function AccountPage({ setActivePage, currentUser, onAuthSuccess, onLogout }) {
  const [activeTab, setActiveTab] = useState('login');
  const [userTab, setUserTab] = useState('appointments'); // 'appointments' | 'orders'
  const [loading, setLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
      fetchUserAppointments();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    try {
      const res = await api.getUserOrders();
      if (res.data) setMyOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserAppointments = async () => {
    try {
      const res = await api.getMyAppointments();
      if (res.data) setMyAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ email: loginEmail, password: loginPassword });
      onAuthSuccess?.(response.user);
      if (response.user?.role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('home');
      }
    } catch (error) {
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.register({
        name: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        password: signUpPassword,
      });
      onAuthSuccess?.(response.user);
      setActivePage('home');
    } catch (error) {
      alert(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error(err);
    } finally {
      onLogout?.();
    }
  };

  const isLoggedIn = Boolean(currentUser);
  const user = currentUser;

  return (
    <div className="font-inter text-[#555555] space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">
            SYNERGY PATIENT &amp; THERAPIST PORTAL
          </p>
          <h1 className="font-sansita text-4xl sm:text-5xl font-bold text-[#005550]">
            {isLoggedIn ? `Welcome back, ${user.name}!` : 'Account Login & Sign Up'}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isLoggedIn ? 'Manage your therapy appointments, kit orders, and account details.' : 'Access your registered Rope & Belt therapy programs, order tracking, and appointments.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        {isLoggedIn ? (
          /* LOGGED IN DASHBOARD VIEW */
          <div className="bg-[#f4f7f8] rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#005550] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-gray-900 text-xl">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold bg-teal-100 text-[#005550] px-2 py-0.5 rounded">
                      Member
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <button
                    onClick={() => setActivePage('admin')}
                    className="bg-purple-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-purple-950 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin Console
                  </button>
                )}
                <button
                  onClick={handleLogoutClick}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>

            {/* Patient Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-2">
              <button
                onClick={() => setUserTab('appointments')}
                className={`pb-2 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
                  userTab === 'appointments'
                    ? 'border-[#005550] text-[#005550]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Appointments ({myAppointments.length})</span>
              </button>

              <button
                onClick={() => setUserTab('orders')}
                className={`pb-2 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
                  userTab === 'orders'
                    ? 'border-[#005550] text-[#005550]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Product Orders ({myOrders.length})</span>
              </button>
            </div>

            {/* Appointments Tab Content */}
            {userTab === 'appointments' && (
              <div className="space-y-4">
                {myAppointments.length === 0 ? (
                  <div className="bg-white p-8 text-center rounded-2xl border border-gray-200 text-gray-500 text-xs">
                    You have no booked appointments yet.{' '}
                    <button
                      onClick={() => setActivePage('services')}
                      className="font-bold text-[#005550] hover:underline cursor-pointer ml-1"
                    >
                      Book a Therapy Session
                    </button>
                  </div>
                ) : (
                  myAppointments.map((app) => (
                    <div key={app._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">#{app._id.substring(0, 8)}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">{app.serviceTitle}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#005550]" />
                            {new Date(app.appointmentDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#005550]" />
                            {app.timeSlot}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#005550]" />
                            {app.center}
                          </span>
                        </div>
                      </div>

                      <div className="text-right sm:text-right">
                        <span className="font-extrabold text-base text-gray-900 block">₹{app.fee}</span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          Payment: <span className="font-bold text-gray-800 uppercase">{app.paymentStatus}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Orders Tab Content */}
            {userTab === 'orders' && (
              <div className="space-y-4">
                {myOrders.length === 0 ? (
                  <div className="bg-white p-8 text-center rounded-2xl border border-gray-200 text-gray-500 text-xs">
                    You have no order history yet.{' '}
                    <button
                      onClick={() => setActivePage('shop')}
                      className="font-bold text-[#005550] hover:underline cursor-pointer ml-1"
                    >
                      Browse Orthopaedic Products
                    </button>
                  </div>
                ) : (
                  myOrders.map((ord) => (
                    <div key={ord._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900 font-mono text-xs">Order #{ord._id.substring(0, 10)}</p>
                          <p className="text-[10px] text-gray-400">{new Date(ord.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-teal-100 text-[#005550] font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>{it.name} (x{it.quantity})</span>
                            <span className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
                        <span className="text-gray-500">Method: <strong className="uppercase">{ord.paymentMethod}</strong></span>
                        <span className="font-extrabold text-sm text-gray-900">Total: ₹{ord.totalAmount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* LOGGED OUT FORM VIEW */
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden max-w-md mx-auto">
            <div className="grid grid-cols-2 text-center border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'login'
                    ? 'border-[#005550] text-[#005550] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                  activeTab === 'signup'
                    ? 'border-[#005550] text-[#005550] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
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
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email or Username *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-gray-700">Password *</label>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? 'Please wait...' : 'Log In'}
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Rahul Sharma"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Create Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? 'Creating Account...' : 'Create Synergy Account'}
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
