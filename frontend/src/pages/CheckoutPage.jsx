import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Tag, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

export default function CheckoutPage({ cart, currentUser, onOrderComplete, setActivePage }) {
  // Form State matching original website fields exactly
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('India');
  const [streetAddress1, setStreetAddress1] = useState('');
  const [streetAddress2, setStreetAddress2] = useState('');
  const [townCity, setTownCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [shipDifferentAddress, setShipDifferentAddress] = useState(false);

  // Checkboxes matching original website
  const [inviteReview, setInviteReview] = useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Coupon state
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Payment Configuration & Process State
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiRefId, setUpiRefId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: 'synergymedical@upi',
    merchantName: 'Synergy Medical Yoga',
    customQrUrl: '',
    enableUpi: true,
    enableCod: true,
    enableStripe: true,
    enableCashfree: true,
    cashfreeMode: 'SANDBOX',
  });

  useEffect(() => {
    // Populate logged-in user details if available
    if (currentUser) {
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      if (currentUser.name) {
        const parts = currentUser.name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
    }

    // Fetch live gateway configuration from backend
    const fetchSettings = async () => {
      try {
        const res = await api.getPublicSettings();
        if (res?.data) {
          setPaymentConfig(res.data);
          if (!res.data.enableCashfree && res.data.enableUpi) {
            setPaymentMethod('upi');
          } else if (!res.data.enableCashfree && !res.data.enableUpi && res.data.enableCod) {
            setPaymentMethod('cod');
          }
        }
      } catch (err) {
        // Fallback silently if public settings error
      }
    };
    fetchSettings();
  }, [currentUser]);

  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const totalAmount = Math.max(0, rawSubtotal - discountAmount);

  const merchantUpi = paymentConfig.upiId || 'synergymedical@upi';
  const qrCodeUrl = paymentConfig.customQrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(paymentConfig.merchantName || 'Synergy Medical Yoga')}&am=${totalAmount.toFixed(2)}&cu=INR`
    )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    toast.success('Merchant UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'SYNERGY10' || cleanCode === 'YOGA10') {
      setDiscountPercent(10);
      setAppliedCoupon(cleanCode);
      toast.success('🎉 Coupon SYNERGY10 applied! You saved 10% on your order.');
    } else if (cleanCode === 'WELLNESS20' || cleanCode === 'YOGA20') {
      setDiscountPercent(20);
      setAppliedCoupon(cleanCode);
      toast.success('🎉 Coupon WELLNESS20 applied! You saved 20% on your order.');
    } else {
      toast.error('Invalid coupon code. Try SYNERGY10 or WELLNESS20');
    }
  };

  // Helper to dynamically load Cashfree PG SDK v3
  const loadCashfreeSdk = () => new Promise((resolve) => {
    if (window.Cashfree) return resolve(window.Cashfree);
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(window.Cashfree);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      toast.error('Your cart is empty! Please add products before checking out.');
      setActivePage('shop');
      return;
    }

    let cleanPhone = (phone || currentUser?.phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit mobile number (e.g. 9876543210).', { toastId: 'phone-err' });
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName} ${lastName}`.trim() || 'Valued Customer';
    const fullAddress = `${streetAddress1} ${streetAddress2 ? ', ' + streetAddress2 : ''}`.trim() || 'No Address Listed';

    try {
      const payload = {
        shippingAddress: {
          address: fullAddress,
          city: townCity || 'Pune',
          state: state || 'Maharashtra',
          pincode: pinCode || '411001',
          country: country || 'India',
        },
        paymentMethod: paymentMethod,
        upiId: upiRefId || undefined,
        customerInfo: {
          name: fullName,
          email: email || currentUser?.email || 'customer@synergymedicalyoga.com',
          phone: phone || currentUser?.phone || '9999999999',
        },
        items: cart.map((item) => ({
          productId: item.id || item.productId,
          selectedSize: item.selectedSize || 'Standard',
          quantity: item.quantity,
          price: discountPercent > 0 ? item.price * (1 - discountPercent / 100) : item.price,
        })),
      };

      const response = await api.createCheckoutSession(payload);

      // 1. Process Cashfree PG Checkout (Primary Gateway - Original Website Parity)
      if (paymentMethod === 'cashfree') {
        if (!response?.paymentSessionId) {
          toast.error('Unable to initialize Cashfree payment. Please check Cashfree App ID & Secret Key in settings.');
          return;
        }
        toast.info('⏳ Launching secure Cashfree payment portal...', { autoClose: 2000, toastId: 'cf-launch' });
        const CashfreeSDK = await loadCashfreeSdk();
        if (CashfreeSDK) {
          const cashfree = CashfreeSDK({ mode: response.cfMode || 'sandbox' });
          cashfree.checkout({
            paymentSessionId: response.paymentSessionId,
            redirectTarget: '_self',
          });
          return;
        } else {
          toast.error('Failed to load Cashfree Payment SDK. Please try again.');
          return;
        }
      }

      // 2. Process Stripe Checkout Gateway
      if (paymentMethod === 'stripe' && response?.sessionUrl) {
        toast.info('⏳ Redirecting to secure Stripe Checkout...', { autoClose: 2500 });
        window.location.href = response.sessionUrl;
        return;
      }

      // 3. Fallback / UPI / Cash on Delivery / Offline test mode confirmation
      const createdOrderId = response?.order?._id || response?.data?.orderId || response?.orderId || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderSuccessId(createdOrderId);
      toast.success('Order placed successfully!', { toastId: 'order-success' });

    } catch (err) {
      toast.error(err.message || 'Failed to process checkout. Please verify your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndExit = () => {
    onOrderComplete?.();
    setActivePage('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If order was successfully completed directly
  if (orderSuccessId) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white max-w-xl w-full rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-[#005550] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-[#005550]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Order Placed Successfully!</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Thank you for your purchase with <strong className="text-[#005550]">Synergy Medical Yoga</strong>. Your order has been placed and is currently being processed. Your order reference is:
          </p>
          <div className="bg-slate-50 border-2 border-dashed border-[#005550] py-3.5 px-6 rounded-2xl inline-block font-mono font-bold text-lg text-[#005550]">
            #{orderSuccessId}
          </div>
          <p className="text-xs text-slate-400">
            A confirmation email will be sent to <span className="font-medium text-slate-700">{email}</span> with order and tracking details.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleFinishAndExit}
              className="w-full sm:w-auto bg-[#005550] hover:bg-[#033c38] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              View Orders in My Account
            </button>
            <button
              onClick={() => {
                onOrderComplete?.();
                setActivePage('shop');
              }}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-xl transition-all text-sm cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafe] min-h-screen pb-20 selection:bg-[#005550] selection:text-white font-sans">
      
      {/* 1. Deep Teal Hero Header exactly matching original website */}
      <div className="bg-gradient-to-r from-[#005550] via-[#03403c] to-[#005550] text-white py-14 sm:py-20 px-4 relative overflow-hidden flex items-center justify-center shadow-md">
        {/* Background Decorative Elements simulating yoga ropes/leaf patterns */}
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            Checkout
          </h1>
        </div>
      </div>

      {/* 2. Main 2-Column Content Section */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 mt-10 sm:mt-12">
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Billing Details (Col 7) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Billing Details Card */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#005550] tracking-tight">
                Billing Details
              </h2>

              <div className="bg-white p-6 sm:p-9 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 space-y-5">
                
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                  />
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      First Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Last Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Country / Region */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Country / Region <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium cursor-pointer"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States (US)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>

                {/* Street Address */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800">
                    Street address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={streetAddress1}
                    onChange={(e) => setStreetAddress1(e.target.value)}
                    placeholder="House number, street name, building"
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                  />
                  <input
                    type="text"
                    value={streetAddress2}
                    onChange={(e) => setStreetAddress2(e.target.value)}
                    placeholder="Apartment, suite, unit, landmark (optional)"
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                  />
                </div>

                {/* Town / City */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Town / City <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={townCity}
                    onChange={(e) => setTownCity(e.target.value)}
                    placeholder="City or Town"
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    State <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium cursor-pointer"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Kerala">Kerala</option>
                  </select>
                </div>

                {/* PIN Code & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      PIN Code <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      maxLength={15}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15))}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Ship to a different address checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={shipDifferentAddress}
                      onChange={(e) => setShipDifferentAddress(e.target.checked)}
                      className="w-4 h-4 rounded text-[#005550] focus:ring-[#005550] border-slate-300 cursor-pointer"
                    />
                    <span>Ship to a different address?</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Notes (Optional) Card */}
            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-bold text-[#005550] tracking-tight">
                Order notes (optional)
              </h3>
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80">
                <textarea
                  rows={3}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  className="w-full px-4 py-3.5 bg-[#f5f8f8] border border-transparent focus:border-[#005550] focus:bg-white rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#005550]/10 transition-all font-medium resize-none"
                />
              </div>
            </div>
          </div>


          {/* RIGHT COLUMN: Your Order & Payment Gateway Process (Col 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            
            {/* 1. Your Order Summary Card */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#005550] tracking-tight">
                Your Order
              </h2>

              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] border border-slate-100/80 divide-y divide-slate-100">
                
                {/* Header */}
                <div className="flex justify-between items-center pb-4 font-bold text-sm text-slate-800 tracking-wide">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                {/* Item list */}
                <div className="py-4 space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-xs sm:text-sm gap-4 py-1">
                      <span className="text-[#005550] font-semibold leading-relaxed">
                        {item.name}{' '}
                        <span className="text-slate-600 font-bold ml-0.5">× {item.quantity}</span>
                      </span>
                      <span className="text-slate-700 font-semibold font-mono shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="py-4 flex justify-between items-center text-sm font-semibold text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{rawSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Discount Line if Coupon applied */}
                {discountPercent > 0 && (
                  <div className="py-3 flex justify-between items-center text-sm text-emerald-700 font-semibold bg-emerald-50 px-3 rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4" /> Coupon ({appliedCoupon})
                    </span>
                    <span>
                      - ₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {/* Shipping */}
                <div className="py-4 flex justify-between items-center text-sm text-slate-700">
                  <span>Shipping</span>
                  <span className="text-[#005550] font-bold bg-teal-50 px-2.5 py-0.5 rounded-full text-xs">
                    Free shipping
                  </span>
                </div>

                {/* Total */}
                <div className="pt-5 flex justify-between items-baseline font-black text-lg sm:text-xl text-[#005550]">
                  <span>Total</span>
                  <span className="font-mono text-xl sm:text-2xl">
                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Coupon Code Banner matching WooCommerce style */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.04)] border border-slate-100/80 text-sm">
              {!showCoupon ? (
                <div className="flex items-center text-slate-600 font-medium">
                  <span>Have a coupon?</span>
                  <button
                    type="button"
                    onClick={() => setShowCoupon(true)}
                    className="font-bold text-[#005550] hover:text-[#03403c] underline cursor-pointer ml-1.5 transition-colors"
                  >
                    Click here to enter your coupon code
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs font-semibold text-slate-600">If you have a coupon code, please apply it below:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. SYNERGY10"
                      className="flex-1 px-3.5 py-2 uppercase font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005550]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-[#005550] hover:bg-[#03403c] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-all shrink-0"
                    >
                      Apply Coupon
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-emerald-600 font-bold">✅ Discount applied successfully!</p>
                  )}
                </div>
              )}
            </div>

              {/* 3. Payment status card: payment gateways are intentionally disabled for staging */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_6px_30px_-5px_rgba(0,0,0,0.07)] border border-slate-100/80 space-y-6">
              
              {/* Gateway Selector Toggles - Cashfree Online Payment (Cards, UPI, Netbanking) & COD */}
              <div className="space-y-3">
                
                {/* 1. Cashfree Online Payment (Primary Gateway) */}
                <div
                  onClick={() => setPaymentMethod('cashfree')}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer select-none ${
                    paymentMethod === 'cashfree'
                      ? 'border-[#005550] bg-[#f8fbfa] shadow-sm ring-1 ring-[#005550]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="cashfree"
                        name="pay_method"
                        checked={paymentMethod === 'cashfree'}
                        onChange={() => setPaymentMethod('cashfree')}
                        className="w-4 h-4 text-[#005550] focus:ring-[#005550] cursor-pointer"
                      />
                      <div>
                        <label htmlFor="cashfree" className="font-bold text-sm text-slate-800 block cursor-pointer">
                          Online Payment (Cashfree)
                        </label>
                        <span className="text-xs text-slate-500 font-medium">Google Pay, PhonePe, Paytm, Cards &amp; Netbanking</span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-1 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                      <span>UPI / Cards</span>
                    </div>
                  </div>

                  {paymentMethod === 'cashfree' && (
                    <div className="mt-3 bg-white p-3.5 rounded-xl border border-teal-100 text-xs text-slate-600 font-medium shadow-2xs space-y-1">
                      <p>✨ After clicking <strong>"Pay Now via Cashfree"</strong>, a secure window will open where you can pay using <strong>GPay, PhonePe, Paytm, Credit/Debit Cards or Netbanking</strong>.</p>
                    </div>
                  )}
                </div>

                {/* 2. Cash on Delivery (COD) Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer select-none ${
                    paymentMethod === 'cod'
                      ? 'border-[#005550] bg-[#f8fbfa] shadow-sm ring-1 ring-[#005550]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="cod"
                        name="pay_method"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-[#005550] focus:ring-[#005550] cursor-pointer"
                      />
                      <div>
                        <label htmlFor="cod" className="font-bold text-sm text-slate-800 block cursor-pointer">
                          Cash on Delivery (COD)
                        </label>
                        <span className="text-xs text-slate-500 font-medium">Pay cash upon delivery at your doorstep</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Privacy Legal Notice from original website */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{' '}
                  <span onClick={() => setActivePage('privacy-policy')} className="text-[#005550] underline font-medium cursor-pointer">
                    privacy policy
                  </span>.
                </p>
              </div>

              {/* Checkboxes matching WooCommerce CusRev & Newsletter exactly */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inviteReview}
                    onChange={(e) => setInviteReview(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#005550] focus:ring-[#005550] border-slate-300 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-600 leading-normal">
                    Would you like to be invited to review your order? Check here to receive a message from CusRev (an independent reviews service) with a review form.
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none font-bold text-xs sm:text-sm text-slate-800">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 sm:text-[#005550] focus:ring-[#005550] border-slate-300 cursor-pointer shrink-0"
                  />
                  <span>Subscribe to our Newsletter</span>
                </label>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#005550] hover:bg-[#02433f] active:scale-[0.99] disabled:opacity-70 text-white font-extrabold py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(0,85,80,0.35)] transition-all text-sm sm:text-base cursor-pointer mt-6 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Connecting Payment Gateway...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-emerald-300" />
                    <span>{paymentMethod === 'cashfree' ? 'Pay Now via Cashfree' : 'Place Order'}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-bit SSL Encrypted &amp; RBI Compliant Checkout
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
