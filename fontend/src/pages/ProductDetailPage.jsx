import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { api, getImageUrl } from '../lib/api';

export default function ProductDetailPage({ productId, onAddToCart, onBuyNow, goBack }) {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.getProduct(productId);
        setProduct(response.data);
        setSelectedSize(response.data.sizes?.[0] || 'Standard');
      } catch (error) {
        // Handle failure silently
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-700">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-700">
        Product not found.
      </div>
    );
  }

  const rawImages = product.images?.length > 0 ? product.images : [product.image];
  const images = rawImages.map(img => getImageUrl(img) || 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80');

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="font-inter text-[#555555] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#005550] hover:text-[#003d39] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="rounded-3xl overflow-hidden border border-slate-200 mb-4">
              <img
                src={images[0]}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'; }}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`${product.name} view ${idx + 1}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'; }}
                    className="w-full h-28 object-cover rounded-3xl border border-slate-200"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 bg-teal-50 text-[#005550] text-xs font-bold uppercase px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5" /> {product.rating.toFixed(1)}
                </span>
              </div>

              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <p className="text-3xl font-extrabold text-[#005550]">₹{product.price.toFixed(2)}</p>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-sm leading-7 text-slate-600">{product.description}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              {product.sizes && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all border ${
                          selectedSize === size
                            ? 'bg-[#005550] text-white border-[#005550]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#005550]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Quantity</p>
                <div className="inline-flex items-center rounded-full border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                    className="px-4 py-3 text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="px-6 text-sm font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((qty) => qty + 1)}
                    className="px-4 py-3 text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleAdd}
                  className={`inline-flex items-center justify-center gap-2 rounded-3xl py-4 px-5 text-sm font-bold text-white transition-all ${
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#005550] hover:bg-[#043f3a]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isAdded ? 'Added' : 'Add to Cart'}
                </button>

                <button
                  onClick={() => {
                    onBuyNow?.(product, selectedSize, quantity);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl py-4 px-5 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-md transition-all hover:scale-105"
                >
                  <Check className="w-4 h-4" /> Buy Product
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#005550]" /> Fast dispatch
                </div>
                <div className="inline-flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#005550]" /> Secure payment
                </div>
                <div className="inline-flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#005550]" /> Easy returns
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Product Details</h2>
                <span className="text-xs font-semibold text-[#005550]">100% medical grade</span>
              </div>
              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-900">Description</p>
                  <p>{product.description}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ideal Use</p>
                  <p>Support, posture correction, joint stabilization, and rehabilitation mobility.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Customer reviews</p>
                  <p>{product.reviewsCount || 4} reviews • Rating {product.rating.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
