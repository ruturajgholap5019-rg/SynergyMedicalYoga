import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image, CheckCircle, X, Layers, Home, Sparkles } from 'lucide-react';
import { getImageUrl } from '../../lib/api';

export default function CarouselsTab({
  carousels,
  openAddCarouselModal,
  openEditCarouselModal,
  setDeleteConfirmModal
}) {
  const [filterPage, setFilterPage] = useState('all');

  const filteredCarousels = carousels.filter((c) => {
    if (filterPage === 'all') return true;
    if (filterPage === 'home') return !c.page || c.page === 'home';
    return c.page === filterPage;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Website Carousel Banners</h3>
          <p className="text-xs text-gray-500">Manage promotional hero banners across both Home Page and Services Page</p>
        </div>

        <button
          onClick={openAddCarouselModal}
          className="bg-[#005550] hover:bg-[#003d39] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#005550]/20 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Carousel Slide</span>
        </button>
      </div>

      {/* Page Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200/60">
        <button
          onClick={() => setFilterPage('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterPage === 'all' ? 'bg-white text-[#005550] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Banners ({carousels.length})</span>
        </button>
        <button
          onClick={() => setFilterPage('home')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterPage === 'home' ? 'bg-white text-[#005550] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home Page ({carousels.filter((c) => !c.page || c.page === 'home').length})</span>
        </button>
        <button
          onClick={() => setFilterPage('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            filterPage === 'services' ? 'bg-white text-[#005550] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Services Page ({carousels.filter((c) => c.page === 'services').length})</span>
        </button>
      </div>

      {/* Carousels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCarousels.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center text-gray-400 font-medium rounded-3xl border border-gray-200">
            No carousel slides found for this page section. Click "Add Carousel Slide" to create your banner.
          </div>
        ) : (
          filteredCarousels.map((slide) => (
            <div key={slide._id} className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="relative h-48 bg-slate-900">
                <img
                  src={getImageUrl(slide.imageUrl)}
                  alt={slide.title || 'Promotional Slide'}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                    slide.page === 'services'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#005550] text-white'
                  }`}>
                    {slide.page === 'services' ? 'Services Page Slider' : 'Home Page Banner'}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit">
                      Slide #{slide.order || 1}
                    </span>
                  </div>
                  {slide.title && <h4 className="font-bold text-base leading-tight mt-1.5">{slide.title}</h4>}
                  {slide.subtitle && <p className="text-xs text-gray-200 line-clamp-2 mt-0.5">{slide.subtitle}</p>}
                </div>
              </div>

              <div className="p-5 flex items-center justify-between border-t border-gray-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  {slide.isActive ? (
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                      <X className="w-3 h-3" /> Hidden
                    </span>
                  )}
                  {slide.buttonText && <span className="text-xs text-gray-500 font-medium">Button: "{slide.buttonText}"</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditCarouselModal(slide)}
                    className="p-2 bg-slate-100 hover:bg-teal-50 text-gray-700 hover:text-[#005550] rounded-xl transition-colors cursor-pointer"
                    title="Edit slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirmModal({
                        isOpen: true,
                        type: 'carousel',
                        id: slide._id,
                        title: slide.title || `Slide #${slide.order || 1}`,
                      })
                    }
                    className="p-2 bg-slate-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
