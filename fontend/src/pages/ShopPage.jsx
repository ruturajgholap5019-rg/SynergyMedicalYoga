import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, RotateCcw, Award, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';

export default function ShopPage({ onAddToCart, onQuickView, onViewDetails, onBuyNow }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.getProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = ['All', 'Orthopaedic Belts', 'Relief Kits', 'Wellness Kits'];

  let filtered = products.filter((p) => selectedCategory === 'All' || p.category === selectedCategory);

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => a.rating - b.rating);
  }

  return (
    <div className="font-inter text-[#555555] space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Shop Orthopaedic Pain Relief &amp; Posture Belts
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Clinically designed products combining medical yoga alignment with ergonomic joint stabilization.
          </p>
        </div>
      </section>

      {/* Filter & Sorting Header Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f4f7f8] p-5 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#005550] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-[#005550]" />
            <span className="text-xs font-bold text-gray-700">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#005550]"
            >
              <option value="default">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onViewDetails={onViewDetails}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#eaf6f6] rounded-3xl p-8 border border-teal-100/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">100% Authentic Products</h4>
            <p className="text-xs text-gray-600">Directly manufactured &amp; certified by iMediYog Healthcare LLP.</p>
          </div>
          <div className="space-y-2">
            <Truck className="w-8 h-8 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">Express All-India Delivery</h4>
            <p className="text-xs text-gray-600">Dispatched within 24 hours from Greens Center Pune HQ.</p>
          </div>
          <div className="space-y-2">
            <RotateCcw className="w-8 h-8 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">7-Day Replacement</h4>
            <p className="text-xs text-gray-600">Easy size exchange or product replacement guarantee.</p>
          </div>
          <div className="space-y-2">
            <Award className="w-8 h-8 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">Doctor &amp; App Guidance</h4>
            <p className="text-xs text-gray-600">Includes free video modules on the Synergy Mobile App.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
