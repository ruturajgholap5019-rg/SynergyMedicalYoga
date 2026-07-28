import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, QrCode, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { api, getImageUrl } from '../lib/api';
import AppointmentModal from '../components/AppointmentModal';
import { useSiteSettings } from '../lib/useSiteSettings';

const APP_MOCKUP = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png';
const PLAYSTORE  = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';

const KNEE_DIAGRAM   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.29-PM.jpeg';
const LUMBAR_DIAGRAM = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.28-PM.jpeg';
const NECK_DIAGRAM   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.29-PM-1-1.jpeg';

const THERAPY_ACCORDION = [
  {
    id: 'knee',
    title: 'Knee Pain',
    subtitle: 'Bio-mechanical alignment & joint load reduction',
    image: KNEE_DIAGRAM,
    points: [
      '1) Correction of rotational imbalance',
      '2) Correction of weight bearing Axis',
      '3) Restoration of longitudinal arch of the foot',
      '4) Targeted Muscle Strentherning and stretching',
    ],
  },
  {
    id: 'lumbar',
    title: 'Lumbar (Back) Pain',
    subtitle: 'Spine decompression & lordosis correction',
    image: LUMBAR_DIAGRAM,
    points: [
      '1) Restoring lumbar lordosis',
      '2) Reduce pressure on the nerve',
      '3) Strengthening of para-spinal muscles',
      '4) Restoring Pelvic mobility',
    ],
  },
  {
    id: 'cervical',
    title: 'Cervical Spine (Neck) Pain',
    subtitle: 'Posture alignment & shoulder girdle mobility',
    image: NECK_DIAGRAM,
    points: [
      '1) Increase scapular mobility',
      '2) Rib-cage awareness for better breathing',
      '3) Shoulder girdle awareness',
      '4) Strengthening of neck muscles',
    ],
  },
];

const DEFAULT_SERVICE_SLIDES = [
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    fallback: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    alt: 'Cervical & Lumbar Traction Therapy',
  },
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
    fallback: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
    alt: 'Clinical Medical Yoga & Rehabilitation',
  },
];

export default function ServicesPage({ setActivePage, currentUser }) {
  const { settings } = useSiteSettings();
  const [openTab, setOpenTab] = useState('knee');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Carousel State
  const [serviceSlides, setServiceSlides] = useState(() => {
    try {
      const cached = localStorage.getItem('synergy_cached_services_carousels');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => {
            const rawSrc = s.imageUrl || s.src || s.url || s.image;
            const fallback = s.fallback || DEFAULT_SERVICE_SLIDES[idx % DEFAULT_SERVICE_SLIDES.length].src;
            return {
              ...s,
              src: getImageUrl(rawSrc) || fallback,
              fallback,
            };
          });
        }
      }
    } catch (e) {}
    return DEFAULT_SERVICE_SLIDES;
  });
  const [serviceSlide, setServiceSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  useEffect(() => {
    if (isSlidePaused || serviceSlides.length === 0) return;
    const timer = setInterval(() => {
      setServiceSlide((prev) => (prev + 1) % serviceSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [serviceSlides, isSlidePaused]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await api.getPublicServices();
        if (res.data) {
          setServices(res.data);
          try { localStorage.setItem('synergy_cached_public_services', JSON.stringify(res.data)); } catch (e) {}
        }
      } catch (err) {
        // Fallback silently if offline
      } finally {
        setLoadingServices(false);
      }
    };

    const fetchCarousels = async () => {
      try {
        const res = await api.getPublicCarousels();
        if (res.data && res.data.length > 0) {
          const srvSlides = res.data.filter((c) => c.page === 'services');
          if (srvSlides.length > 0) {
            const mapped = srvSlides.map((c, idx) => {
              const fallback = DEFAULT_SERVICE_SLIDES[idx % DEFAULT_SERVICE_SLIDES.length].src;
              const rawSrc = c.imageUrl || c.src || c.url || c.image;
              return {
                src: getImageUrl(rawSrc) || fallback,
                fallback,
                alt: c.title || 'Synergy Medical Yoga Therapy Service',
              };
            });
            setServiceSlides(mapped);
            try { localStorage.setItem('synergy_cached_services_carousels', JSON.stringify(mapped)); } catch (e) {}
          }
        }
      } catch (err) {
        // Fallback silently if offline
      }
    };

    fetchServices();
    fetchCarousels();
  }, []);

  // Carousel Autoplay Timer (5000ms) with Pause on Hover
  useEffect(() => {
    if (isSlidePaused || serviceSlides.length === 0) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % serviceSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isSlidePaused, serviceSlides]);

  const currentTherapy = THERAPY_ACCORDION.find((t) => t.id === openTab) || THERAPY_ACCORDION[0];

  return (
    <div className="font-inter text-[#555555]">

      {/* ──────────────────────────────────────────────
          1. HERO SUB-BANNER HEADER
          ────────────────────────────────────────────── */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Our Services
          </h1>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          2. DYNAMIC CLINICAL SERVICES GRID FROM DATABASE (SERVICES CART)
          ────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-16 bg-slate-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Medical Yoga Programs
              </span>
              <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-gray-900">
                Clinical Therapy Sessions &amp; Packages
              </h2>
              <p className="text-sm text-gray-600">
                Doctor-supervised non-surgical postural realignment and rope-assisted joint recovery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((srv) => (
                <div key={srv._id} className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={getImageUrl(srv.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b')}
                        alt={srv.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 right-4 bg-[#005550] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {srv.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">{srv.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{srv.description}</p>
                      
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 pt-2 border-t border-gray-100">
                        <Clock className="w-4 h-4 text-[#005550]" />
                        <span>Session Duration: {srv.duration || '60 mins'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block">Fee per session</span>
                      <span className="font-extrabold text-xl text-[#005550]">₹{srv.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(srv);
                        setIsAppointmentModalOpen(true);
                      }}
                      className="bg-[#005550] hover:bg-[#003d39] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ──────────────────────────────────────────────
          3. DOWNLOAD OUR APP SECTION (Moved above Carousel)
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#eaf6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* App Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={getImageUrl(settings.appMockupImage || APP_MOCKUP)}
                alt="Synergy MYT App"
                className="max-w-sm sm:max-w-md w-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Text & Download Options */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">
                  FIND THE NEAREST THERAPIST / CENTER
                </p>
                <div className="w-16 h-0.5 bg-[#005550]" />
              </div>

              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                Download Our App
              </h2>

              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
                <p>
                  Discover the transformative power of Medical Yoga Therapy with our all-in-one app! Whether you're seeking a qualified therapist nearby, who can come to your place or you want to find a nearest medical yoga center which is on synergy platform of integrated approach nearby who can take care of your pain management end to end, our app has you covered.
                </p>
                <p>
                  Our app has certified medical yoga therapists from various institutes and who work closely with yoga physicians and nuitritionists to provide a holistic regimen for recovery from pain.
                </p>
              </div>

              {/* QR Code & Store Badges */}
              <div className="flex flex-wrap gap-6 pt-4 items-center">
                <a href={settings.playStoreUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-all cursor-pointer">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={PLAYSTORE} alt="Google Play" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                  </div>
                </a>

                <a href={settings.appStoreUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-all cursor-pointer">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={APPSTORE} alt="App Store" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                  </div>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          4. FULL-WIDTH SERVICE PROMOTIONAL SLIDER (Strictly Database Driven from MongoDB Atlas)
          ────────────────────────────────────────────── */}
      {serviceSlides.length === 0 ? (
        <section className="relative w-full bg-slate-900 h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-gradient-to-r from-[#003D39]/30 via-[#007A73]/20 to-[#003D39]/30 animate-shimmer" />
          <div className="z-10 text-center px-6 space-y-4 animate-pulse-soft">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full mx-auto flex items-center justify-center border border-white/20 shadow-xl animate-float">
              <span className="text-2xl">🧘‍♀️</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-sansita font-bold text-white tracking-wide drop-shadow">
              Synergy Clinical Therapy Programs
            </h3>
            <p className="text-xs sm:text-sm text-teal-200/80">
              Loading service banners from live database...
            </p>
          </div>
        </section>
      ) : (
        <section
          onMouseEnter={() => setIsSlidePaused(true)}
          onMouseLeave={() => setIsSlidePaused(false)}
          className="relative w-full overflow-hidden bg-slate-900 h-[450px] sm:h-[550px] lg:h-[600px] flex items-center group shadow-xl"
        >
          {serviceSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === serviceSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                src={getImageUrl(s.src)}
                alt={s.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = s.fallback || 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg';
                }}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${i === serviceSlide ? 'scale-105' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}

          {/* Carousel Arrow Controls */}
          <button
            onClick={() => setServiceSlide((serviceSlide - 1 + serviceSlides.length) % serviceSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setServiceSlide((serviceSlide + 1) % serviceSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {serviceSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setServiceSlide(i)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${i === serviceSlide ? 'bg-white scale-125 shadow-sm' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to service slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}


      {/* ──────────────────────────────────────────────
          4. HOW DOES MEDICAL YOGA WORK (2-Column Accordion & Dynamic Toggle Image)
          ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (50%): Heading, Divider & Interactive Accordion */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550] leading-tight">
                  How does medical yoga work on pain knee / back / neck pain relief
                </h2>
                <div className="w-20 h-1 bg-[#005550] rounded" />
              </div>

              <div className="space-y-4">
                {THERAPY_ACCORDION.map((tab) => {
                  const isOpen = openTab === tab.id;
                  return (
                    <div
                      key={tab.id}
                      className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300"
                    >
                      {/* Accordion Tab Header */}
                      <button
                        onClick={() => setOpenTab(isOpen ? null : tab.id)}
                        className={`w-full flex items-center justify-between px-6 py-5 text-left font-poppins font-bold text-lg transition-all ${
                          isOpen
                            ? 'bg-[#005550] text-white shadow-sm'
                            : 'bg-[#f4f7f8] text-[#2C2D33] hover:bg-teal-50/50'
                        }`}
                      >
                        <span>{tab.title}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-white shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                      </button>

                      {/* Accordion Content Body */}
                      {isOpen && (
                        <div className="p-6 bg-slate-50/70 space-y-4 border-t border-gray-100 animate-in slide-in-from-top duration-300">
                          <ul className="space-y-3">
                            {tab.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#005550] shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-gray-700 leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column (50%): Dynamic Toggle Image Display */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 bg-white rounded-3xl border border-teal-100/80 shadow-md overflow-hidden flex flex-col justify-between">
              <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden">
                <img
                  key={currentTherapy.id}
                  src={currentTherapy.image}
                  alt={currentTherapy.title}
                  className="w-full h-full object-cover animate-in fade-in duration-500 transform hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-4 bg-[#f4fbfb] border-t border-teal-100/60 text-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#005550]">
                  Anatomical Diagram: {currentTherapy.title}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          5. STATISTICS COUNTER BANNER SECTION
          ────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-[#005550] via-[#004743] to-[#005550] text-white relative overflow-hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-teal-700/80">
            
            <div className="py-4 sm:py-0">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-white tracking-tight mb-2">
                {settings.statsCities ?? 15}
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-teal-200">
                CITIES
              </div>
            </div>

            <div className="py-4 sm:py-0">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-white tracking-tight mb-2">
                {settings.statsCenters ?? 200}<span className="text-teal-300">+</span>
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-teal-200">
                CENTERS
              </div>
            </div>

            <div className="py-4 sm:py-0">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-white tracking-tight mb-2">
                {settings.statsTherapists ?? 400}<span className="text-teal-300">+</span>
              </div>
              <div className="text-xs sm:text-sm font-bold tracking-widest uppercase text-teal-200">
                THERAPISTS
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          6. MEDICAL YOGA CENTRES ACROSS INDIA SECTION (Exact Match to synergymedicalyoga.com)
          ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* Left Column (50%): Vector India Map with Glowing Teal Pins */}
            <div className="w-full lg:w-1/2 flex justify-center items-center relative py-2">
              <div className="w-full max-w-xl relative drop-shadow-sm">
                <svg
                  viewBox="0 0 545 425"
                  className="w-full h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Map Background Base */}
                  <g className="transition-all">
                    {/* Non-Live States / Kashmir & Far North */}
                    <path d="M 200,60 L 225,20 L 255,10 L 285,25 L 295,50 L 275,80 L 250,105 L 225,110 Z" fill="#e0e0e0" stroke="#ffffff" strokeWidth="1.5" />
                    <path d="M 225,110 L 250,105 L 275,120 L 260,145 L 225,140 L 205,120 Z" fill="#e0e0e0" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Punjab & Haryana & Delhi */}
                    <path d="M 210,120 L 250,115 L 245,160 L 210,165 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Rajasthan */}
                    <path d="M 160,155 L 225,140 L 220,195 L 175,215 L 145,190 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Gujarat */}
                    <path d="M 145,190 L 175,215 L 195,250 L 155,265 L 145,235 L 165,225 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Maharashtra (Pune Flagship Hub) */}
                    <path d="M 175,255 L 240,245 L 275,275 L 235,325 L 190,305 L 185,270 Z" fill="#66c2a4" stroke="#ffffff" strokeWidth="2" />

                    {/* Non-Live State: Madhya Pradesh */}
                    <path d="M 220,195 L 295,205 L 305,255 L 240,245 L 205,215 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Non-Live State: Uttar Pradesh & Bihar */}
                    <path d="M 250,105 L 325,140 L 355,180 L 295,205 L 250,145 Z" fill="#e0e0e0" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Odisha */}
                    <path d="M 305,255 L 360,250 L 375,300 L 325,315 L 275,275 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Karnataka & Telangana & Andhra */}
                    <path d="M 190,305 L 235,325 L 275,275 L 295,335 L 265,395 L 225,385 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Live State: Tamil Nadu & Kerala */}
                    <path d="M 225,385 L 265,395 L 270,420 L 240,425 Z" fill="#99d8c9" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Northeast */}
                    <path d="M 355,180 L 415,165 L 455,185 L 425,225 L 365,210 Z" fill="#e0e0e0" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* Location Pins (Matching Teal Pins from Screenshot) */}
                  {/* 1. Pune Flagship Live Center */}
                  <g className="cursor-pointer group">
                    <circle cx="218" cy="302" r="14" fill="#007A73" fillOpacity="0.35" className="animate-ping" />
                    <circle cx="218" cy="302" r="9" fill="#005550" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="218" cy="302" r="3.5" fill="#50E3C2" />
                  </g>

                  {/* 2. Mumbai */}
                  <circle cx="192" cy="288" r="7.5" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 3. Delhi / NCR */}
                  <circle cx="230" cy="155" r="7.5" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 4. Ahmedabad / Gujarat */}
                  <circle cx="172" cy="225" r="7.5" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 5. Surat */}
                  <circle cx="182" cy="258" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 6. Bangalore */}
                  <circle cx="230" cy="378" r="7.5" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 7. Hyderabad */}
                  <circle cx="260" cy="320" r="7.5" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 8. Chennai */}
                  <circle cx="268" cy="392" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 9. Odisha / Bhubaneswar */}
                  <circle cx="360" cy="292" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 10. Kolkata */}
                  <circle cx="370" cy="252" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 11. Jaipur */}
                  <circle cx="198" cy="180" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* 12. Chandigarh */}
                  <circle cx="228" cy="122" r="7" fill="#00A896" stroke="#FFFFFF" strokeWidth="1.5" />
                </svg>

                {/* Floating Pune Badge */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-teal-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005550] animate-pulse" />
                  <span className="text-xs font-extrabold text-[#005550]">Pune Flagship Center (Live)</span>
                </div>
              </div>
            </div>

            {/* Right Column (50%): Exact Typography Matching synergymedicalyoga.com */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#005550] leading-[1.15] tracking-tight">
                Medical yoga centres <br />
                across India <br />
                <span className="font-bold text-[#005550]">(currently live in Pune )</span>
              </h2>

              <div className="w-16 h-0.5 bg-[#005550]/40" />

              <p className="text-base sm:text-lg leading-relaxed text-[#005550]/80 font-medium max-w-xl">
                Synergy Medical Yoga is expanding across India with trusted centers in major cities. From Pune to Mumbai, Bangalore, Delhi, and more, our Rope &amp; Belt Therapy is reaching people wherever they are. Each location is guided by certified therapists to ensure you receive expert care close to home
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => { setActivePage && setActivePage('find-centres'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Pune Centers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="border-2 border-[#005550] text-[#005550] hover:bg-[#005550] hover:text-white font-bold text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          7. FULL-WIDTH SERVICE SLIDES CAROUSEL (Elementor Swiper Banner Slide Match)
          ────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-gray-900 h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[420px] flex items-center group shadow-2xl border-t border-teal-900/40">
        {serviceSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === serviceSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={getImageUrl(s.src)}
              alt={s.alt || 'Synergy Medical Yoga Service'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = s.fallback || 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg';
              }}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${i === serviceSlide ? 'scale-105' : 'scale-100'}`}
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute left-6 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 max-w-xl text-white z-20 space-y-4 pointer-events-none">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#005550]/80 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-teal-200 border border-teal-400/30">
                🌿 Synergy Clinical Services
              </span>
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-md whitespace-pre-line">
                {s.heading || s.alt || 'Clinical Rope & Belt Therapy Programs'}
              </h2>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed drop-shadow-sm font-medium">
                {s.subtitle || 'Doctor supervised posture realignment, spinal decompression & friction-free joint recovery.'}
              </p>
              <div className="pt-2 pointer-events-auto">
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Therapy Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        {serviceSlides.length > 1 && (
          <>
            <button
              onClick={() => setServiceSlide((prev) => (prev - 1 + serviceSlides.length) % serviceSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#005550] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setServiceSlide((prev) => (prev + 1) % serviceSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#005550] text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
              {serviceSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setServiceSlide(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === serviceSlide ? 'w-8 bg-emerald-400 shadow-md' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>


      {/* APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        selectedService={selectedService}
        currentUser={currentUser}
      />
    </div>
  );
}
