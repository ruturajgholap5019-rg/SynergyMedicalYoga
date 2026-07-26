import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onProceedToCheckout, onNavigateToShop }) {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Cart Header */}
          <div className="p-5 bg-gradient-to-r from-[#065750] to-[#043f3a] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-xs">
                <ShoppingBag className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">Your Cart</h2>
                <p className="text-xs text-teal-200">{cart.length} item{cart.length !== 1 ? 's' : ''} added</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-teal-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-teal-50/80 px-5 py-3 border-b border-teal-100/60 text-xs">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Congratulations! You qualified for FREE Express Shipping!
              </p>
            ) : (
              <div>
                <p className="text-slate-700 font-medium mb-1.5">
                  Add <span className="font-bold text-[#065750]">₹{(freeShippingThreshold - subtotal).toFixed(2)}</span> more for <span className="font-bold text-amber-700">FREE Express Delivery</span>
                </p>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#065750] to-[#00a896] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-4 text-[#065750]">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Explore our clinically designed orthopedic belts and rope therapy kits.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToShop?.();
                  }}
                  className="bg-[#065750] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md hover:bg-[#043f3a] transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">{item.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.selectedSize && (
                        <span className="inline-block mt-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-extrabold text-sm text-[#065750]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/80 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="font-semibold text-slate-900">Included</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-extrabold text-[#065750]">
                  <span>Total Amount</span>
                  <span className="text-base">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-gradient-to-r from-[#065750] to-[#0a7369] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex justify-center items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">🔒 100% Secure Checkout</span>
                <span>•</span>
                <span>📦 Fast Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
