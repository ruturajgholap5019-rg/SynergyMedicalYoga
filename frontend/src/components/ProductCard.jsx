import React, { useState } from 'react';
import { Star, Eye, Check, ShoppingBag, Zap } from 'lucide-react';
import { getImageUrl } from '../lib/api';

export default function ProductCard({ product, onAddToCart, onQuickView, onViewDetails, onBuyNow }) {
  const defaultSize = product.sizes ? product.sizes[0] : 'Standard';
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, defaultSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleNavigateToDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:border-teal-400/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group relative animate-scale-up">
      
      {/* Top Image Container */}
      <div>
        <div
          onClick={handleNavigateToDetails}
          className="relative bg-[#f5f7f8] rounded-2xl flex justify-center items-center h-56 sm:h-64 mb-4 overflow-hidden cursor-pointer w-full shadow-inner"
        >
          <img
            src={getImageUrl(product.images?.[0] || product.image) || '/favicon.svg'}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/favicon.svg';
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Category Pill */}
          <span className="absolute top-3 left-3 bg-[#005550] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            {product.category}
          </span>

          {/* Quick view button */}
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="absolute top-3 right-3 p-2 bg-white/95 text-gray-700 hover:text-[#005550] rounded-full shadow-lg sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
            title="Quick View Modal"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Rating Stars (if available) */}
        {Boolean(product.rating && product.rating >= 4.0) && (
          <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-[11px] text-gray-500 font-semibold ml-1">({Number(product.rating || 0).toFixed(1)})</span>
          </div>
        )}
      </div>

      <div>
        <h3
          onClick={handleNavigateToDetails}
          className="font-poppins font-extrabold text-[#005550] text-base sm:text-lg mb-2 text-center leading-snug cursor-pointer group-hover:text-[#007a73] transition-colors line-clamp-2"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <p className="font-bold text-[#2C2D33] text-lg sm:text-xl">₹{product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through font-medium">₹{product.originalPrice.toFixed(2)}</p>
          )}
        </div>

        {/* Two Action Options: Add to Cart & Buy Now (which opens the product information screen) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleAdd}
            className={`font-extrabold py-2.5 px-2 text-[11px] sm:text-xs rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1 cursor-pointer hover:scale-105 active:scale-95 truncate ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-teal-50 hover:bg-teal-100 text-[#005550] border border-teal-200/80 hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0 animate-bounce" /> <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuy}
            className="font-extrabold py-2.5 px-2 text-[11px] sm:text-xs rounded-xl bg-[#005550] hover:bg-[#003d39] text-white transition-all duration-200 shadow-md shadow-[#005550]/20 flex items-center justify-center gap-1 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#005550]/30 truncate"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" /> <span className="truncate">Buy Now</span>
          </button>
        </div>

      </div>

    </div>
  );
}
