import React, { useState } from 'react';
import { User, Lock, Mail, Phone, LogOut, Package, BookOpen } from 'lucide-react';
import { api } from '../lib/api';

export default function AccountPage({ setActivePage, currentUser, onAuthSuccess, onLogout }) {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ email: loginEmail, password: loginPassword });
      onAuthSuccess?.(response.user);
      setActivePage('shop');
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
      setActivePage('shop');
    } catch (error) {
      alert(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error(error);
    } finally {
      onLogout?.();
    }
  };

  const isLoggedIn = Boolean(currentUser);
  const user = currentUser;

  return (
    <div className="font-inter text-[#555555] space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0] py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">
            SYNERGY PATIENT &amp; THERAPIST PORTAL
          </p>
          <h1 className="font-sansita text-4xl sm:text-5xl font-bold text-[#005550]">
            {isLoggedIn ? `Welcome back, ${user.name}!` : 'Account Login & Sign Up'}
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {isLoggedIn ? 'Manage your orthopaedic kit orders and access app video routines.' : 'Access your registered Rope & Belt therapy programs, order tracking, and appointments.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-md mx-auto px-4 sm:px-6">
        {isLoggedIn ? (
          /* LOGGED IN DASHBOARD VIEW */
          <div className="bg-[#f4f7f8] rounded-3xl border border-gray-200/80 shadow-md p-8 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-[#005550] text-white flex items-center justify-center font-bold text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-poppins font-bold text-gray-900 text-lg">{user.name}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold bg-teal-100 text-[#005550] px-2 py-0.5 rounded">
                  Member since {user.joinedDate}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-[#005550]" />
                  <div>
                    <h5 className="font-bold text-gray-900">Recent Kit Orders</h5>
                    <p className="text-gray-500">2 active orders in transit</p>
                  </div>
                </div>
                <button onClick={() => setActivePage('shop')} className="text-[#005550] font-bold hover:underline">
                  View
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#005550]" />
                  <div>
                    <h5 className="font-bold text-gray-900">App Video Modules</h5>
                    <p className="text-gray-500">Knee &amp; Cervical Pain Guides</p>
                  </div>
                </div>
                <button onClick={() => setActivePage('services')} className="text-[#005550] font-bold hover:underline">
                  Access
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of Account</span>
            </button>
          </div>
        ) : (
          /* MULTI TAB LOGIN & SIGNUP FORMS */
          <div className="bg-[#f4f7f8] rounded-3xl border border-gray-200/80 shadow-md overflow-hidden">
            
            {/* Tabs */}
            <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-100/50">
              <button
                onClick={() => setActiveTab('login')}
                className={`py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'login'
                    ? 'border-[#005550] text-[#005550] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setActiveTab('signup')}
                className={`py-4 text-sm font-bold transition-all border-b-2 ${
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
                      <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your email."); }} className="text-[11px] font-bold text-[#005550] hover:underline">
                        Forgot Password?
                      </a>
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

                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="remember" className="rounded text-[#005550] focus:ring-[#005550]" />
                    <label htmlFor="remember" className="text-xs text-gray-600 font-medium">
                      Remember me on this browser
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70"
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
                        placeholder="e.g. Poonam Shinde"
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
                        placeholder="name@example.com"
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
                        placeholder="+91 97303 21042"
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
                        placeholder="At least 6 characters"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input type="checkbox" required id="terms" className="mt-0.5 rounded text-[#005550]" />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      I agree to the <a href="#" className="text-[#005550] font-bold hover:underline">Terms of Service</a> &amp; <a href="#" className="text-[#005550] font-bold hover:underline">Privacy Policy</a> of iMediYog Healthcare LLP.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm mt-2 disabled:opacity-70"
                  >
                    {loading ? 'Please wait...' : 'Create Synergy Account'}
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
