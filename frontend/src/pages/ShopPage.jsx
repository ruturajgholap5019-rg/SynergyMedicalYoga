import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Truck, RotateCcw, Award, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';

export default function ShopPage({ onAddToCart, onQuickView, onViewDetails, onBuyNow }) {
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('synergy_cached_products_shop');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(() => {
    try { return !localStorage.getItem('synergy_cached_products_shop'); } catch(e) { return true; }
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.getProducts();
        if (response.data) {
          setProducts(response.data || []);
          try { localStorage.setItem('synergy_cached_products_shop', JSON.stringify(response.data || [])); } catch (e) {}
        }
      } catch (error) {
        // Fallback silently if API unreachable
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
    <div className="font-inter text-[#555555]">
      
      {/* Header Banner */}
      <section className="bg-[#005550] py-16 px-4 text-center text-white animate-fade-in-up">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="font-poppins text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Shop 
          </h1>
        </div>
      </section>

      {/* Filter & Sorting Header Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#f4f7f8] p-4 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#005550] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#005550]" />
              <span className="text-xs font-bold text-gray-700">Sort By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:border-[#005550] cursor-pointer"
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
      <section id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-sm text-teal-800 font-bold animate-pulse-soft">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
              <span>Fetching latest orthopaedic products &amp; stock...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex flex-col space-y-4 animate-pulse-soft">
                  <div className="w-full h-56 bg-slate-200/80 rounded-2xl animate-shimmer" />
                  <div className="h-4 bg-slate-200/80 rounded-lg w-3/4 animate-shimmer" />
                  <div className="h-3 bg-slate-200/80 rounded-lg w-1/2 animate-shimmer" />
                  <div className="flex justify-between pt-2 border-t border-slate-100">
                    <div className="h-9 bg-teal-50 rounded-xl w-24 animate-shimmer" />
                    <div className="h-9 bg-teal-800/20 rounded-xl w-24 animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#eaf6f6] rounded-3xl p-6 sm:p-8 border border-teal-100/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1.5">
            <ShieldCheck className="w-7 h-7 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">100% Authentic Products</h4>
            <p className="text-xs text-gray-600">Directly manufactured &amp; certified by iMediYog Healthcare LLP.</p>
          </div>
          <div className="space-y-1.5">
            <Truck className="w-7 h-7 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">Express All-India Delivery</h4>
            <p className="text-xs text-gray-600">Dispatched within 24 hours from Greens Center Pune HQ.</p>
          </div>
          <div className="space-y-1.5">
            <RotateCcw className="w-7 h-7 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">7-Day Replacement</h4>
            <p className="text-xs text-gray-600">Easy size exchange or product replacement guarantee.</p>
          </div>
          <div className="space-y-1.5">
            <Award className="w-7 h-7 text-[#005550] mx-auto" />
            <h4 className="font-poppins font-bold text-sm text-[#2C2D33]">Doctor &amp; App Guidance</h4>
            <p className="text-xs text-gray-600">Includes free video modules on the Synergy Mobile App.</p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          "HOW DOES IT WORK" 4-STEP WORKFLOW (COMPACT HEIGHT ABOVE FOOTER)
          ────────────────────────────────────────────── */}
      <section className="bg-[#e2e6e7] py-12 sm:py-14 relative overflow-hidden border-t border-gray-300/60">
        
        {/* Decorative Connecting Botanical Vine Line across all 4 steps */}
        <div className="absolute top-[62%] left-0 w-full -translate-y-1/2 pointer-events-none hidden lg:block overflow-hidden opacity-50 z-0">
          <svg viewBox="0 0 1400 200" className="w-full h-36 stroke-emerald-800/40 fill-none" strokeWidth="1.5">
            <path d="M -100,120 C 250,-10 450,210 750,90 C 1050,-20 1200,190 1500,100" strokeDasharray="6 6" />
            <path d="M 270,45 Q 285,30 295,45 Q 285,60 270,45 Z" className="fill-emerald-200 stroke-emerald-800/60" strokeDasharray="none" />
            <path d="M 690,140 Q 705,125 715,140 Q 705,155 690,140 Z" className="fill-emerald-200 stroke-emerald-800/60" strokeDasharray="none" />
            <path d="M 1060,55 Q 1075,40 1085,55 Q 1075,70 1060,55 Z" className="fill-emerald-200 stroke-emerald-800/60" strokeDasharray="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Compact Section Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-sansita italic text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight">
              How Does It Work
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-end">
            
            {/* Step 1 */}
            <div className="flex flex-col justify-between h-full text-left">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#005550]">Step 1</h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1 leading-relaxed">
                  Purchase a at home MYT Kit from Synergy
                </p>
              </div>
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-1 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://synergymedicalyoga.com/wp-content/uploads/2025/06/HEaro-Image-300x300.png"
                  alt="At Home MYT Kit"
                  className="max-h-full object-contain filter drop-shadow-md"
                />
              </div>
              <div className="mt-3 text-left">
                <button
                  onClick={() => {
                    const grid = document.getElementById('products-grid');
                    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold text-xs px-5 py-2 rounded-lg shadow-md transition-all cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col justify-between h-full text-left">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#005550]">Step 2</h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1 leading-relaxed">
                  Immediately get access to high quality tying protocol videos
                </p>
              </div>
              <div className="h-44 sm:h-48 flex items-end justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png"
                  alt="Tying Protocol Videos App"
                  className="max-h-full object-contain filter drop-shadow-xl"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col justify-between h-full text-left">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#005550]">Step 3</h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1 leading-relaxed">
                  Start using the videos and use the kit to start your joureny towards pain free life
                </p>
              </div>
              <div className="h-38 sm:h-44 flex items-end justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.28-PM.jpeg"
                  alt="Pain Free Life Journey"
                  className="max-h-full object-contain rounded-xl filter drop-shadow-lg"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col justify-between h-full text-left">
              <div className="mb-4">
                <h3 className="font-poppins font-bold text-xl sm:text-2xl text-[#005550]">Step 4</h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1 leading-relaxed">
                  If you need additional in-person help, download the app for finding nearest therapist
                </p>
              </div>
              <div className="h-64 sm:h-80 flex items-end justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png"
                  alt="Find Nearest Therapist App"
                  className="max-h-full h-60 sm:h-72 object-contain filter drop-shadow-xl"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
