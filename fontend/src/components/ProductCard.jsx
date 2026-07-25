import React, { useState } from 'react';
import { Star, Eye, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView, onViewDetails }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'Standard');
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const hasOptions = product.sizes && product.sizes.length > 1;

  return (
    <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100/90 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative">
      
      {/* Top Image Container */}
      <div>
        <div className="relative bg-[#f5f7f8] rounded-3xl p-6 flex justify-center items-center h-64 mb-6 overflow-hidden">
          <img
            src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Pill */}
          <span className="absolute top-3 left-3 bg-[#005550] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            {product.category}
          </span>

          {/* Quick view button */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute top-3 right-3 p-2 bg-white/90 text-gray-700 hover:text-[#005550] rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Rating Stars (if available) */}
        {product.rating >= 4.5 && (
          <div className="flex justify-center items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-gray-500 font-semibold ml-1">({product.rating.toFixed(2)})</span>
          </div>
        )}

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="font-poppins font-bold text-[#2C2D33] text-lg text-center leading-snug mb-3 cursor-pointer group-hover:text-[#005550] transition-colors"
        >
          {product.name}
        </h3>
      </div>

      {/* Bottom Price & Button */}
      <div className="text-center space-y-4 pt-4 border-t border-gray-100">
        
        {/* Size selector if available */}
        {hasOptions && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Size:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:border-[#005550]"
            >
              {product.sizes.map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
        )}

        <p className="font-bold text-[#2C2D33] text-xl">₹{product.price.toFixed(2)}</p>

        <button
          onClick={hasOptions ? () => onViewDetails?.(product) : handleAdd}
          className={`w-full font-bold py-3.5 px-6 rounded-lg transition-colors shadow-sm ${
            isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#005550] hover:bg-[#003d39] text-white'
          }`}
        >
          {isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Added to cart!
            </span>
          ) : (
            hasOptions ? 'Buy Product' : 'Add to cart'
          )}
        </button>

      </div>

    </div>
  );
}
