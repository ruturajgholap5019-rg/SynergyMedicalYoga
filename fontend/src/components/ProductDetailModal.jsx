import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { getImageUrl } from '../lib/api';

export default function ProductDetailModal({ product, onClose, onAddToCart, onBuyNow }) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdded, setIsAdded] = useState(false);

  const rawImages = product.images || [product.image];
  const images = rawImages.map(img => getImageUrl(img) || 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80');

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'; }}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-[#065750] ring-2 ring-teal-100' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'; }} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Purchase Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-teal-50 text-[#065750] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready to Dispatch
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-500">({product.reviewsCount} customer reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold text-[#065750]">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
                  Save ₹{(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>

              {/* Sizes Selection */}
              {product.sizes && (
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Size Variant:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          selectedSize === size
                            ? 'bg-[#065750] text-white border-[#065750] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isAdded 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#065750] hover:bg-[#043f3a] text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow?.(product, selectedSize, quantity);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer hover:scale-105"
                >
                  Buy Now Directly
                </button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#065750]" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#065750]" />
                  <span>Clinical Grade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-[#065750]" />
                  <span>7 Day Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Details Bottom Section */}
        <div className="border-t border-slate-200 p-6 md:p-8 bg-slate-50/50">
          <div className="flex border-b border-slate-200 space-x-6 mb-4 overflow-x-auto">
            {['description', 'features', 'clinical', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold capitalize transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[#065750] text-[#065750]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'clinical' ? 'Clinical Usage' : tab}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-600 leading-relaxed">
            {activeTab === 'description' && (
              <p>{product.description}</p>
            )}
            {activeTab === 'features' && (
              <ul className="list-disc list-inside space-y-1.5">
                {product.features?.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            {activeTab === 'clinical' && (
              <p>
                This product is designed by certified Rope & Belt Therapy specialists at iMediYog Healthcare LLP. For maximum therapeutic benefit, use in combination with prescribed daily 15-minute gentle traction exercises available on the Synergy Medical Yoga Mobile App.
              </p>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">Dr. Archana K.</span>
                    <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-600">Excellent build quality! I prescribe these belts to my orthopedic rehabilitation patients with great outcomes.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
