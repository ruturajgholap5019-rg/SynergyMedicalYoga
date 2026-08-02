import React, { useState } from 'react';
import { RESELLERS_AND_CENTRES } from '../data/mockData';
import { MapPin, Phone, Clock, Search, Navigation, UserCheck, Building2 } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function FindCentresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCenter, setSelectedCenter] = useState(RESELLERS_AND_CENTRES[0]);

  const cities = ['All', 'Pune', 'Mumbai'];

  const filteredCenters = RESELLERS_AND_CENTRES.filter((c) => {
    const matchesCity = selectedCity === 'All' || c.city === selectedCity;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.pincode.includes(searchTerm);
    return matchesCity && matchesSearch;
  });

  return (
    <div className="font-inter text-[#555555] space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0] py-20 px-4 text-center animate-fade-in-up">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">
            NATIONWIDE THERAPY NETWORK
          </p>
          <h1 className="font-sansita text-4xl sm:text-5xl font-bold text-[#005550]">
            Find Our Nearest Reseller &amp; Therapy Center
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Locate accredited Synergy Medical Yoga centers, authorized product resellers, and certified Rope &amp; Belt practitioners near your area.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="bg-[#f4f7f8] p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between hover-lift">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by center name, address, or pincode (e.g. 411033, Chinchwad)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#005550]"
            />
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Filter City:</span>
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCity === city
                    ? 'bg-[#005550] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Directory & Interactive Map Preview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Directory List (7 cols) */}
          <div className="lg:col-span-7 space-y-4 max-h-[700px] overflow-y-auto pr-2">
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 px-1">
              <span>Showing {filteredCenters.length} verified centers &amp; resellers</span>
              <span className="text-[#005550]">Click center to preview map</span>
            </div>

            {filteredCenters.map((center) => {
              const isSelected = selectedCenter?.id === center.id;
              return (
                <div
                  key={center.id}
                  onClick={() => setSelectedCenter(center)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer hover-lift ${
                    isSelected
                      ? 'bg-teal-50/70 border-[#005550] shadow-md ring-2 ring-[#005550]/20'
                      : 'bg-white border-gray-200 shadow-sm hover:border-[#005550]/50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <span className="inline-block text-[10px] font-extrabold uppercase bg-[#005550] text-white px-2.5 py-0.5 rounded-full mb-1">
                        {center.type}
                      </span>
                      <h3 className="font-poppins font-bold text-base text-[#2C2D33] leading-snug">
                        {center.name}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#005550] bg-white px-2.5 py-1 rounded-lg border border-teal-100 shrink-0">
                      {center.city} - {center.pincode}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span>{center.address}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#005550]" />
                        <span className="font-semibold text-gray-800">{center.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#005550]" />
                        <span>{center.hours}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Practitioners: <strong className="text-gray-900">{center.therapists.join(', ')}</strong></span>
                    </div>

                    <a
                      href={center.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 bg-[#005550] hover:bg-[#003d39] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Navigation className="w-3 h-3 text-teal-200" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Map Preview (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#005550] rounded-3xl p-6 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Selected Location Preview
                </span>
                <span className="text-xs bg-white/10 text-white font-bold px-2.5 py-0.5 rounded-full">
                  Verified Center
                </span>
              </div>

              {selectedCenter && (
                <div className="space-y-4">
                  <h4 className="font-poppins text-lg font-bold text-white leading-snug">
                    {selectedCenter.name}
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {selectedCenter.address}
                  </p>

                  <div className="relative aspect-[4/3] bg-[#003D39] rounded-2xl overflow-hidden p-4 flex flex-col justify-between border border-white/10">
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs p-2.5 rounded-xl">
                      <Building2 className="w-4 h-4 text-teal-300" />
                      <span className="text-xs font-bold text-white">{selectedCenter.city} Hub ({selectedCenter.pincode})</span>
                    </div>

                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-white text-[#005550] rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-white mt-2">{selectedCenter.name}</p>
                      <p className="text-[10px] text-teal-200">Open Today • {selectedCenter.hours}</p>
                    </div>

                    <a
                      href={selectedCenter.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white hover:bg-gray-100 text-[#005550] text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps Navigation</span>
                    </a>
                  </div>

                  <div className="bg-white/10 p-3 rounded-xl text-xs space-y-1">
                    <p className="text-white/80">Need immediate booking at this center?</p>
                    <p className="font-bold text-white">{selectedCenter.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
