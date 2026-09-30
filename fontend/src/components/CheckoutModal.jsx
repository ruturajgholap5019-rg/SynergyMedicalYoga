import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export default function CheckoutModal({ isOpen, onClose, cart, currentUser, onOrderComplete }) {
  if (!isOpen) return null;

  const [step, setStep] = useState('form'); // 'form' | 'redirect' | 'success'
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    city: 'Pune',
    pincode: '411033',
    paymentMethod: 'card',
  });
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingPayload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    pincode: formData.pincode,
    state: 'Maharashtra',
    country: 'India',
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (formData.paymentMethod === 'cod') {
        const response = await api.createOrder({
          shippingAddress: shippingPayload,
          paymentMethod: 'cod',
        });

        setOrderId(response.data.order._id);
        setStep('success');
        return;
      }

      setStep('redirect');
      const response = await api.createCheckoutSession({
        shippingAddress: shippingPayload,
      });

      setOrderId(response.data.orderId);
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      setStep('form');
      setErrorMessage(error.message || 'Unable to start checkout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderComplete();
    setStep('form');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-8">

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
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#065750]" /> Shipping & Delivery Address
              </h3>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

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

              <div className="pt-2">
                <label className="flex text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#065750]" /> Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'card', label: 'Pay Online (Card / UPI via Stripe)' },
                    { id: 'cod', label: 'Cash on Delivery' },
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
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#065750] hover:bg-[#043f3a] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm inline-flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Proceed to Secure Payment'}
              </button>
            </div>
          </form>
        ) : step === 'redirect' ? (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#065750] animate-spin mx-auto" />
            <h2 className="text-xl font-extrabold text-slate-900">Redirecting to Stripe...</h2>
            <p className="text-sm text-slate-600">Please wait while we open the secure payment page.</p>
          </div>
        ) : (
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
              {formData.paymentMethod === 'cod'
                ? 'Your Cash on Delivery order is confirmed. Pay when your items arrive.'
                : `We have dispatched order details to ${formData.email}.`}
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
