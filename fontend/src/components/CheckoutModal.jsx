import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

export default function CheckoutModal({ isOpen, onClose, cart, currentUser, onOrderComplete }) {
  if (!isOpen) return null;

  const [step, setStep] = useState('form'); // 'form' | 'success' | 'redirect'
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: '',
    phone: '',
    address: '',
    city: 'Pune',
    pincode: '411033',
    paymentMethod: 'card'
  });
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.createCheckoutSession({
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: 'Maharashtra',
          country: 'India',
        },
      });

      setCheckoutUrl(response.data.url);
      setOrderId(response.data.orderId);
      setStep('redirect');
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      setStep('form');
      alert(error.message || 'Unable to start checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderComplete();
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#065750] to-[#043f3a] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
            <div>
              <h2 className="font-extrabold text-xl">Synergy Express Checkout</h2>
              <p className="text-xs text-teal-200">Secure 256-bit encrypted checkout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Inputs */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#065750]" /> Shipping & Delivery Address
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#065750]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <label className="flex text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#065750]" /> Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / GPay / PhonePe' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'cod', label: 'Cash on Delivery' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        formData.paymentMethod === pm.id
                          ? 'border-[#065750] bg-teal-50 text-[#065750]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-4 pb-2 border-b border-slate-200">
                  Order Summary ({cart.length} items)
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-35">{item.name}</p>
                        <p className="text-slate-500">Qty: {item.quantity} {item.selectedSize ? `(${item.selectedSize})` : ''}</p>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs border-t border-slate-200 pt-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#065750] pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-[#065750] hover:bg-[#043f3a] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm"
              >
                Confirm & Place Order
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State */
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Order Placed Successfully!</h2>
              <p className="text-sm text-slate-600">
                Thank you for choosing <span className="font-bold text-[#065750]">Synergy Medical Yoga</span>.
              </p>
              <div className="inline-block mt-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-2 text-xs font-mono text-[#065750]">
                Order Reference Number: <span className="font-bold">{orderId}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We have dispatched order details to <span className="font-bold text-slate-700">{formData.email}</span>. A representative from our Pune therapy care hub will also SMS you tracking updates.
            </p>

            <button
              onClick={handleFinish}
              className="bg-[#065750] hover:bg-[#043f3a] text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
