import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, QrCode, Copy, Check } from 'lucide-react';
import { api } from '../lib/api';

export default function CheckoutModal({ isOpen, onClose, cart, currentUser, onOrderComplete }) {
  const [step, setStep] = useState('form'); // 'form' | 'success' | 'redirect'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Pune',
    pincode: '411033',
    paymentMethod: 'upi',
    upiId: '',
  });
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: 'synergymedical@upi',
    merchantName: 'Synergy Medical Yoga',
    customQrUrl: '',
    enableUpi: true,
    enableCod: true,
    enableStripe: true,
  });

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData((prev) => ({
        ...prev,
        name: currentUser?.name || prev.name || '',
        email: currentUser?.email || prev.email || '',
        phone: currentUser?.phone || prev.phone || '',
      }));
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchSettings = async () => {
      try {
        const res = await api.getPublicSettings();
        if (res.data) {
          setPaymentConfig(res.data);
          if (!res.data.enableUpi && res.data.enableCod) {
            setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }));
          }
        }
      } catch (err) {
        console.error('Failed to load payment config:', err);
      }
    };
    fetchSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const merchantUpi = paymentConfig.upiId || 'synergymedical@upi';
  const qrCodeUrl = paymentConfig.customQrUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `upi://pay?pa=${merchantUpi}&pn=${encodeURIComponent(paymentConfig.merchantName || 'Synergy Medical Yoga')}&am=${subtotal}&cu=INR`
    )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.createCheckoutSession({
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
        upiId: formData.upiId || undefined,
        items: cart.map((item) => ({
          productId: item.id || item.productId,
          selectedSize: item.selectedSize || 'Standard',
          quantity: item.quantity,
          price: item.price,
        })),
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      });

      if (formData.paymentMethod === 'stripe' && response.sessionUrl) {
        setStep('redirect');
        window.location.href = response.sessionUrl;
      } else {
        const createdId = response.order?._id || response.data?.orderId || response.data?.order?._id || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(createdId);
        setStep('success');
      }
    } catch (err) {
      alert(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderComplete?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header (Sticky top) */}
        <div className="bg-gradient-to-r from-[#065750] to-[#043f3a] px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" />
            <div>
              <h2 className="font-extrabold text-lg sm:text-xl leading-tight">Synergy Express Checkout</h2>
              <p className="text-[11px] text-teal-200">Secure 256-bit encrypted checkout</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Inputs */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#065750]" /> Shipping &amp; Delivery Address
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / House No *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat No, Building Name, Landmark..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pune"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="411033"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                  />
                </div>
              </div>

              {/* Payment Selection */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#065750]" /> Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {paymentConfig.enableUpi && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.paymentMethod === 'upi'
                          ? 'border-[#065750] bg-teal-50/70 text-[#065750] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 mx-auto mb-1 text-[#065750]" />
                      <p className="text-[11px] leading-tight">UPI / GPay / PhonePe</p>
                    </button>
                  )}

                  {paymentConfig.enableStripe && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.paymentMethod === 'stripe'
                          ? 'border-[#065750] bg-teal-50/70 text-[#065750] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#065750]" />
                      <p className="text-[11px] leading-tight">Credit / Debit Card</p>
                    </button>
                  )}

                  {paymentConfig.enableCod && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#065750] bg-teal-50/70 text-[#065750] font-bold shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-5 h-5 mx-auto mb-1 text-[#065750]" />
                      <p className="text-[11px] leading-tight">Cash on Delivery</p>
                    </button>
                  )}
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#065750]">
                      <QrCode className="w-4 h-4" /> Scan &amp; Pay using any UPI App (GPay / PhonePe / Paytm)
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-teal-100">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-32 h-32 object-contain border border-slate-200 rounded-lg p-1" />
                      <div className="space-y-2 text-center sm:text-left">
                        <p className="text-xs font-semibold text-slate-700">{paymentConfig.merchantName || 'Synergy Medical Yoga'}:</p>
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-mono text-[#065750]">
                          <span>{merchantUpi}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="text-slate-400 hover:text-[#065750] cursor-pointer"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500">Scan QR Code or copy UPI ID in GPay/PhonePe to pay ₹{subtotal.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your UPI ID (Optional reference)</label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210@paytm or username@okaxis"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#065750]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary */}
            <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between h-fit">
              <div>
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
                </h4>

                <div className="space-y-3 max-h-44 overflow-y-auto pr-1 text-xs">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-b border-slate-200/60">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[140px]">{item.name}</p>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity} ({item.selectedSize || 'Universal'})</p>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3 mt-4 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Express Delivery</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-[#065750] pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-[#065750] hover:bg-[#043f3a] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? 'Processing Payment...' : 'Confirm & Place Order'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-2xl text-slate-800">Order Placed Successfully!</h3>
            <p className="text-slate-600 text-xs max-w-md mx-auto">
              Thank you for ordering with Synergy Medical Yoga. Your order reference ID is{' '}
              <span className="font-mono font-bold text-[#065750]">{orderId}</span>. We are processing your delivery!
            </p>
            <button
              onClick={handleFinish}
              className="mt-4 bg-[#065750] hover:bg-[#043f3a] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
