import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, QrCode, Clock, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { api, getImageUrl } from '../lib/api';
import AppointmentModal from '../components/AppointmentModal';
import { useSiteSettings } from '../lib/useSiteSettings';
import ScrollReveal from '../components/ScrollReveal';

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
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Education_Titl_Img.webp',
    fallback: '/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp',
    alt: 'Synergy Rope & Belt Therapy Training & Healthcare Hub',
  },
];

const SYNERGY_LOCATIONS = [
  {
    id: 'pune',
    city: 'Pune',
    isFlagship: true,
    cx: 245,
    cy: 435,
    name: 'Synergy Medical Yoga Flagship Hub',
    address: '1st Floor, Greens Centre, Above Reliance Fresh, Opposite Cosmos Bank, Near Shreedhar Nagar, Chinchwad, Pune, Maharashtra 411033',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 8:00 AM - 7:30 PM',
    status: 'Live Flagship Center',
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    cx: 200,
    cy: 420,
    name: 'Synergy Medical Yoga Center - Mumbai',
    address: 'Dadar West & Borivali Medical Yoga Care Hubs, Mumbai, Maharashtra 400028',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'delhi',
    city: 'Delhi NCR',
    cx: 275,
    cy: 195,
    name: 'Synergy Medical Yoga Center - Delhi NCR',
    address: 'South Extension & Gurgaon Wellness Center, Delhi NCR 110049',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    cx: 270,
    cy: 540,
    name: 'Synergy Medical Yoga Center - Bengaluru',
    address: 'Indiranagar & HSR Layout Therapy Hub, Bengaluru, Karnataka 560038',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    cx: 335,
    cy: 470,
    name: 'Synergy Medical Yoga Center - Hyderabad',
    address: 'Banjara Hills Medical Yoga Care Hub, Hyderabad, Telangana 500034',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'ahmedabad',
    city: 'Ahmedabad',
    cx: 175,
    cy: 295,
    name: 'Synergy Medical Yoga Center - Ahmedabad',
    address: 'Navrangpura Wellness & RBT Center, Ahmedabad, Gujarat 380009',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'surat',
    city: 'Surat',
    cx: 185,
    cy: 350,
    name: 'Synergy Medical Yoga Center - Surat',
    address: 'Ring Road & Adajan Therapy Hub, Surat, Gujarat 395009',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'chennai',
    city: 'Chennai',
    cx: 345,
    cy: 585,
    name: 'Synergy Medical Yoga Center - Chennai',
    address: 'Anna Nagar & Mylapore Therapy Center, Chennai, Tamil Nadu 600040',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    cx: 495,
    cy: 355,
    name: 'Synergy Medical Yoga Center - Kolkata',
    address: 'Salt Lake & Park Street Center, Kolkata, West Bengal 700064',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    cx: 230,
    cy: 235,
    name: 'Synergy Medical Yoga Center - Jaipur',
    address: 'Malviya Nagar & C-Scheme Therapy Hub, Jaipur, Rajasthan 302017',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
  {
    id: 'chandigarh',
    city: 'Chandigarh',
    cx: 260,
    cy: 160,
    name: 'Synergy Medical Yoga Center - Chandigarh',
    address: 'Sector 17 & Mohali Care Center, Chandigarh 160017',
    phone: '+91 97303 21042',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    status: 'Certified Partner Center',
  },
];

export default function ServicesPage({ setActivePage, currentUser }) {
  const { settings } = useSiteSettings();
  const [openTab, setOpenTab] = useState('knee');
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredLoc, setHoveredLoc] = useState(SYNERGY_LOCATIONS[0]); // Default Pune

  // Carousel State - Default to 3 slides
  const [serviceSlides, setServiceSlides] = useState(DEFAULT_SERVICE_SLIDES);
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
                        src={getImageUrl(srv.imageUrl || '/favicon.svg')}
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
          <ScrollReveal animation="fade-up">
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
                  <a href={settings.playStoreUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-all cursor-pointer btn-glow-primary">
                    <QrCode className="w-10 h-10 text-[#005550]" />
                    <div>
                      <img src={PLAYSTORE} alt="Google Play" className="h-8 object-contain" />
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                    </div>
                  </a>

                  <a href={settings.appStoreUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover:shadow-md transition-all cursor-pointer btn-glow-primary">
                    <QrCode className="w-10 h-10 text-[#005550]" />
                    <div>
                      <img src={APPSTORE} alt="App Store" className="h-8 object-contain" />
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </ScrollReveal>
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
          6. MEDICAL YOGA CENTRES ACROSS INDIA SECTION (With Outer & Inner Layout India Map & Hover Address Cards)
          ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-white via-teal-50/20 to-white border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left Column (50%): Authentic Geographic Vector SVG India Map & Location Markers */}
            <div className="w-full lg:w-1/2 flex flex-col items-center relative py-2">
              <div className="w-full max-w-xl relative bg-white p-2 sm:p-4 rounded-3xl">
                
                {/* SVG India Map Container */}
                <svg
                  viewBox="0 0 600 700"
                  className="w-full h-auto drop-shadow-sm select-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <defs>
                    <filter id="india-soft-shadow" x="-5%" y="-5%" width="110%" height="110%">
                      <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#003d39" floodOpacity="0.1" />
                    </filter>
                  </defs>

                  <g filter="url(#india-soft-shadow)">
                    {/* 1. JAMMU & KASHMIR & LADAKH */}
                    <path
                      d="M 230,120 C 235,95 242,65 258,40 C 275,20 300,10 320,20 C 335,30 350,45 355,70 C 360,90 350,110 340,125 C 318,140 292,150 270,145 C 250,140 235,130 230,120 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 2. HIMACHAL PRADESH & UTTARAKHAND */}
                    <path
                      d="M 270,145 C 292,150 318,140 340,125 C 360,145 375,165 365,190 C 342,200 318,195 292,190 C 275,180 270,160 270,145 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 3. PUNJAB, HARYANA & DELHI */}
                    <path
                      d="M 230,120 C 235,130 250,140 270,145 C 270,160 275,180 292,190 C 270,205 250,210 235,190 C 225,170 220,140 230,120 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 4. RAJASTHAN */}
                    <path
                      d="M 160,190 C 185,175 208,175 235,190 C 250,210 270,205 280,225 C 270,280 248,305 212,320 C 180,305 155,265 140,235 C 145,210 150,195 160,190 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 5. GUJARAT (WITH KUTCH & KATHIAWAR PENINSULA) */}
                    <path
                      d="M 140,235 C 155,265 180,305 212,320 C 218,340 222,365 200,380 C 180,390 160,385 150,360 C 135,360 120,345 135,335 C 145,330 115,315 95,300 C 100,280 120,270 135,275 C 115,260 125,245 140,235 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 6. UTTAR PRADESH */}
                    <path
                      d="M 292,190 C 318,195 342,200 365,190 C 395,215 430,235 440,270 C 395,295 345,300 302,280 C 280,225 270,205 292,190 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 7. MADHYA PRADESH */}
                    <path
                      d="M 280,225 C 302,280 345,300 395,295 C 405,325 400,360 370,385 C 312,390 262,370 225,365 C 212,320 248,305 280,225 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 8. MAHARASHTRA (PUNE FLAGSHIP HUB) */}
                    <path
                      d="M 200,380 C 225,365 262,370 312,390 C 370,385 385,415 365,460 C 302,495 242,485 205,450 C 182,415 192,395 200,380 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* 9. BIHAR & JHARKHAND */}
                    <path
                      d="M 440,270 C 480,280 505,295 515,340 C 475,360 445,355 405,325 C 395,295 430,235 440,270 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 10. WEST BENGAL & SIKKIM */}
                    <path
                      d="M 505,295 C 515,265 520,245 515,235 C 530,250 535,275 525,305 C 535,335 550,375 505,415 C 485,385 475,360 515,340 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 11. ODISHA & CHHATTISGARH */}
                    <path
                      d="M 370,385 C 400,360 445,355 475,360 C 495,395 505,435 450,470 C 395,465 380,435 370,385 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 12. TELANGANA & ANDHRA PRADESH */}
                    <path
                      d="M 312,390 C 365,460 395,465 450,470 C 420,535 385,585 340,570 C 318,525 308,455 312,390 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 13. KARNATAKA & GOA */}
                    <path
                      d="M 205,450 C 242,485 302,495 312,390 C 308,455 318,525 340,570 C 300,600 262,585 238,525 C 218,485 202,465 205,450 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 14. TAMIL NADU & KERALA (SOUTHERN TIP KANYAKUMARI) */}
                    <path
                      d="M 238,525 C 262,585 300,600 340,570 C 385,585 395,615 350,685 C 315,700 290,665 265,605 C 248,565 238,545 238,525 Z"
                      fill="#7CCBB5"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* 15. NORTHEAST STATES */}
                    <path
                      d="M 525,305 C 555,285 595,260 625,285 C 640,315 615,355 565,345 C 545,335 535,320 525,305 Z"
                      fill="#DDE4E4"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* INTERACTIVE LOCATION DOTS */}
                    {SYNERGY_LOCATIONS.map((loc) => {
                      const active = hoveredLoc?.id === loc.id;
                      return (
                        <g
                          key={loc.id}
                          onMouseEnter={() => setHoveredLoc(loc)}
                          onClick={() => setHoveredLoc(loc)}
                          className="cursor-pointer"
                        >
                          {/* Flagship Pulse Glow */}
                          {loc.isFlagship && (
                            <>
                              <circle
                                cx={loc.cx}
                                cy={loc.cy}
                                r="18"
                                fill="#00A896"
                                opacity="0.2"
                                className="animate-ping"
                              />
                              <circle
                                cx={loc.cx}
                                cy={loc.cy}
                                r="12"
                                fill="#00A896"
                                opacity="0.3"
                              />
                            </>
                          )}

                          {/* Selected Ring */}
                          {active && (
                            <circle
                              cx={loc.cx}
                              cy={loc.cy}
                              r="14"
                              fill="none"
                              stroke="#005550"
                              strokeWidth="2.5"
                            />
                          )}

                          {/* Main Marker Circle */}
                          <circle
                            cx={loc.cx}
                            cy={loc.cy}
                            r={loc.isFlagship ? 8.5 : 7}
                            fill={active ? "#003D39" : "#009688"}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            className="transition-all duration-300 hover:scale-125"
                          />

                          {/* Inner Highlight Dot */}
                          <circle
                            cx={loc.cx}
                            cy={loc.cy}
                            r="2.5"
                            fill="#FFFFFF"
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {/* Floating Pune Flagship Badge */}
                <div className="mt-2 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-md border border-gray-100 text-xs font-bold text-[#005550]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A896] animate-pulse" />
                    <span>Pune Flagship Center (Live)</span>
                  </div>
                </div>

                {/* Interactive Tooltip Card on Hover */}
                {hoveredLoc && (
                  <div className="mt-4 rounded-2xl overflow-hidden shadow-xl border border-teal-100 animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#005550] text-white px-5 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-teal-300" />
                          <h3 className="font-bold text-sm">
                            {hoveredLoc.name}
                          </h3>
                        </div>

                        <span className="bg-teal-300 text-[#003D39] px-3 py-1 rounded-full text-[10px] font-bold">
                          {hoveredLoc.city}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-teal-100 leading-6">
                        {hoveredLoc.address}
                      </p>

                      <div className="mt-4 pt-3 border-t border-teal-700 flex justify-between text-xs">
                        <span>📞 {hoveredLoc.phone}</span>

                        <span className="font-semibold text-teal-300">
                          {hoveredLoc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Column (50%): Exact Typography & Actions */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#005550] leading-[1.15] tracking-tight">
                Medical yoga centres <br />
                across India <br />
                <span className="font-bold text-[#005550]">(currently live in Pune )</span>
              </h2>

              <div className="w-16 h-1 bg-[#005550] rounded-full" />

              <p className="text-base sm:text-lg leading-relaxed text-[#005550]/80 font-medium max-w-xl">
                Synergy Medical Yoga is expanding across India with trusted centers in major cities. From Pune to Mumbai, Bangalore, Delhi, and more, our Rope &amp; Belt Therapy is reaching people wherever they are. Each location is guided by certified therapists to ensure you receive expert care close to home
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => { setActivePage && setActivePage('find-centres'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Pune Centers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAppointmentModalOpen(true)}
                  className="border-2 border-[#005550] text-[#005550] hover:bg-[#005550] hover:text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all duration-300 cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          6.5 WHY LEARN RBT WITH SYNERGY BANNER SECTION
          ────────────────────────────────────────────── */}
      <section className="w-full bg-[#EAEBEB] border-t border-b border-gray-200/80">
        <img
          src={getImageUrl('/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp')}
          alt="Why Learn RBT with Synergy Banner"
          className="w-full h-auto block"
        />
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
