import React, { useState } from 'react';
import { Search, Plus, CheckCircle, X, Edit2, Trash2, Activity } from 'lucide-react';
import { getImageUrl } from '../../lib/api';

export default function ServicesTab({
  services,
  openAddServiceModal,
  openEditServiceModal,
  setDeleteConfirmModal
}) {
  const [serviceSearch, setServiceSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search therapy services..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          >
            <option value="All">All Categories</option>
            <option value="Spine Therapy">Spine Therapy</option>
            <option value="Joint Care">Joint Care</option>
            <option value="Medical Yoga">Medical Yoga</option>
            <option value="Postpartum Care">Postpartum Care</option>
            <option value="General Wellness">General Wellness</option>
          </select>
        </div>

        <button
          onClick={openAddServiceModal}
          className="bg-[#005550] hover:bg-[#003d39] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#005550]/20 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Therapy Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Service Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No services found in database.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(service.imageUrl) || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'}
                          alt={service.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{service.title}</p>
                          <p className="text-[11px] text-gray-500 truncate max-w-xs">{service.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-700">{service.category}</td>
                    <td className="py-4 px-6 font-semibold text-gray-600">{service.duration}</td>
                    <td className="py-4 px-6 font-extrabold text-gray-900">₹{service.price}</td>
                    <td className="py-4 px-6">
                      {service.isActive ? (
                        <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-full text-[10px] inline-flex items-center gap-1">
                          <X className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditServiceModal(service)}
                        className="p-2 bg-slate-100 hover:bg-teal-50 text-gray-700 hover:text-[#005550] rounded-xl transition-colors cursor-pointer"
                        title="Edit service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmModal({
                            isOpen: true,
                            type: 'service',
                            id: service._id,
                            title: service.title,
                          })
                        }
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
