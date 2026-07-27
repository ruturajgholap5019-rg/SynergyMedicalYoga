import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, QrCode, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import AppointmentModal from '../components/AppointmentModal';
import { useSiteSettings } from '../lib/useSiteSettings';

const APP_MOCKUP = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png';
const PLAYSTORE  = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';

const KNEE_DIAGRAM   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.29-PM.jpeg';
const LUMBAR_DIAGRAM = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.28-PM.jpeg';
const NECK_DIAGRAM   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-04-at-1.44.29-PM-1-1.jpeg';

const SERVICE_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Clinical Medical Yoga Therapy & Pain Relief',
  },
  {
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    alt: 'Doctor Supervised Non-Surgical Rehabilitation',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
    alt: 'Advanced Rope & Belt Postural Realignment',
  }
];

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

export default function ServicesPage({ setActivePage, currentUser }) {
  const { settings } = useSiteSettings();
  const [openTab, setOpenTab] = useState('knee');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Carousel State
  const [slide, setSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await api.getPublicServices();
        if (res.data) setServices(res.data);
      } catch (err) {
        console.error('Failed to load public services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // Carousel Autoplay Timer (5000ms) with Pause on Hover
  useEffect(() => {
    if (isSlidePaused) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % SERVICE_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isSlidePaused]);

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
                        src={srv.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'}
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
                src={settings.appMockupImage || APP_MOCKUP}
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
          4. FULL-WIDTH SERVICE PROMOTIONAL SLIDER (Elementor Widget Slides)
          ────────────────────────────────────────────── */}
      <section
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        className="relative w-full overflow-hidden bg-slate-900 h-[450px] sm:h-[550px] lg:h-[600px] flex items-center group shadow-md"
      >
        {SERVICE_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={s.src}
              alt={s.alt}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${i === slide ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        ))}

        {/* Carousel Arrow Controls */}
        <button
          onClick={() => setSlide((slide - 1 + SERVICE_SLIDES.length) % SERVICE_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSlide((slide + 1) % SERVICE_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {SERVICE_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${i === slide ? 'bg-white scale-125 shadow-sm' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to service slide ${i + 1}`}
            />
          ))}
        </div>
      </section>


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
          6. STORE LOCATOR & CENTERS MAP SECTION
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Medical yoga centres across India (currently live in Pune )
            </h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto" />
          </div>

          <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200/80">
            <div className="aspect-video w-full relative bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8839395259!2d73.80168!3d18.6279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b985e95a6e9d%3A0xd66ee99eca65ac47!2sChinchwad%2C%20Pimpri-Chinchwad%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Synergy Medical Yoga Centers Map"
              />
            </div>
            
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-t border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#005550]/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#005550]" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-[#2C2D33] text-lg">Greens Center, Chinchwad</h4>
                  <p className="text-gray-500 text-sm mt-0.5">Pune 411033, Maharashtra, India</p>
                </div>
              </div>

              <button
                onClick={() => { setActivePage && setActivePage('find-centres'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                Find All Centers
              </button>
            </div>
          </div>

        </div>
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
