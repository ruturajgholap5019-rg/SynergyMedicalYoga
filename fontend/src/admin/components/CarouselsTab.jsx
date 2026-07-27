import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image, CheckCircle, X } from 'lucide-react';

export default function CarouselsTab({
  carousels,
  openAddCarouselModal,
  openEditCarouselModal,
  setDeleteConfirmModal
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Hero Carousel Banners</h3>
          <p className="text-xs text-gray-500">Manage sliding banners displayed on the homepage</p>
        </div>

        <button
          onClick={openAddCarouselModal}
          className="bg-[#005550] hover:bg-[#003d39] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#005550]/20 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Carousel Slide</span>
        </button>
      </div>

      {/* Carousels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {carousels.length === 0 ? (
          <div className="col-span-2 bg-white p-12 text-center text-gray-400 font-medium rounded-3xl border border-gray-200">
            No carousel slides found. Click "Add Carousel Slide" to create your first banner.
          </div>
        ) : (
          carousels.map((slide) => (
            <div key={slide._id} className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between">
              <div className="relative h-48 bg-slate-900">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#005550] px-2.5 py-1 rounded-full w-fit">
                    Slide #{slide.order || 1}
                  </span>
                  {slide.title && <h4 className="font-bold text-base leading-tight mt-2">{slide.title}</h4>}
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
                  <span className="text-xs text-gray-500 font-medium">Button: "{slide.buttonText}"</span>
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
                        title: slide.title,
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
