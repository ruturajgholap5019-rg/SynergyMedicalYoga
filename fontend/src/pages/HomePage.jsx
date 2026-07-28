import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, QrCode } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { api, getImageUrl } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useSiteSettings } from '../lib/useSiteSettings';

const IMEDIYOG_LOGO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/I-Mediyog-Logo_PNG-06.png';
const PRODUCT_KNEE   = 'https://synergymedicalyoga.com/wp-content/uploads/2026/06/HEaro-Image-300x300.png';
const PRODUCT_NECK   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Neck-Pain-01-300x300.png';
const PRODUCT_CORP   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Product-2-300x300.png';
const APP_MOCKUP     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png';
const PLAYSTORE      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE       = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';
const DOCTOR         = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/doctor_1.png';

const PLAY_QR       = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-03-at-8.34.11-PM.jpeg';
const APPLE_QR      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-1.34.20-PM-1024x1024.jpeg';

const DEFAULT_BLOGS = [
  {
    _id: 'b1',
    category: 'Knee Therapy',
    title: 'Understanding Knee Pain: Causes, Prevention & RBT Therapy',
    date: 'May 15, 2025',
    image: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    excerpt: 'Clinical insights on knee joint alignment, cartilage preservation, and non-surgical RBT protocols.',
  },
  {
    _id: 'b2',
    category: 'Cervical Therapy',
    title: 'Neck Pain Relief Through Rope & Belt Therapy: A Clinical Guide',
    date: 'Jun 2, 2025',
    image: PRODUCT_NECK,
    excerpt: 'Reversing tech-neck and forward head posture through gentle cervical traction and suboccipital release.',
  },
  {
    _id: 'b3',
    category: 'Back Therapy',
    title: 'Back to Wellness: Lumbar Pain Management with Medical Yoga',
    date: 'Jul 10, 2025',
    image: DOCTOR,
    excerpt: 'Targeted pelvic stabilization and decompression techniques for sciatica and slip disc recovery.',
  },
];

const DEFAULT_HERO_SLIDES = [
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    fallback: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    alt: 'Synergy Medical Yoga Banner',
    heading: 'Guided Training Videos\nfor Therapeutic Exercises at Home',
    subtitle: 'Doctor Supervised Non-Surgical Rehabilitation & Rope and Belt Therapy',
    buttonText: 'Explore Shop',
    buttonLink: '/shop',
  },
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
    fallback: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png',
    alt: 'Synergy Medical Yoga Banner',
    heading: 'Professional Rope & Belt\nTherapy for Pain Management',
    subtitle: 'Doctor supervised posture realignment & joint friction elimination.',
    buttonText: 'Book Therapy',
    buttonLink: '/services',
  },
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',
    fallback: 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',
    alt: 'Synergy Medical Yoga Banner',
    heading: 'Evidence-Based\nTherapy Programs for Faster Recovery',
    subtitle: 'Integrated approach to pain relief with certified therapeutic instructors.',
    buttonText: 'Find Centers',
    buttonLink: '/services',
  },
];

/* Animated counter */
function Counter({ end, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1500;
        const step = end / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, end);
          setVal(Math.floor(current));
          if (current >= end) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function HomePage({ setActivePage, onAddToCart, onQuickView, onViewDetails, onBuyNow }) {
  const { settings } = useSiteSettings();
  const [slide, setSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(() => {
    try {
      const cached = localStorage.getItem('synergy_cached_home_carousels');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s, idx) => {
            const rawSrc = s.imageUrl || s.src || s.url || s.image;
            const fallback = s.fallback || DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length].src;
            return {
              ...s,
              src: getImageUrl(rawSrc) || fallback,
              fallback,
            };
          });
        }
      }
    } catch (e) {}
    return DEFAULT_HERO_SLIDES;
  });
  const [featuredProducts, setFeaturedProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('synergy_cached_home_products');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [aboutVisible] = useState(true);
  const [orthVisible] = useState(true);
  const aboutRef = useRef(null);
  const orthRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getPublicCarousels();
        if (res.data && res.data.length > 0) {
          const homeSlides = res.data.filter((c) => !c.page || c.page === 'home');
          if (homeSlides.length > 0) {
            const mapped = homeSlides.map((c, idx) => {
              const fallback = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length].src;
              const rawSrc = c.imageUrl || c.src || c.url || c.image;
              return {
                src: getImageUrl(rawSrc) || fallback,
                fallback,
                alt: c.title || 'Synergy Medical Yoga Banner',
                heading: c.title,
                subtitle: c.subtitle,
                buttonText: c.buttonText || 'Explore Shop',
                buttonLink: c.buttonLink || '/shop',
              };
            });
            setHeroSlides(mapped);
            try { localStorage.setItem('synergy_cached_home_carousels', JSON.stringify(mapped)); } catch (e) {}
          }
        }
      } catch (err) {
        // Fallback silently
      }
      try {
        const pRes = await api.getProducts();
        if (pRes.data && pRes.data.length > 0) {
          setFeaturedProducts(pRes.data.slice(0, 4));
          try { localStorage.setItem('synergy_cached_home_products', JSON.stringify(pRes.data.slice(0, 4))); } catch (e) {}
        }
      } catch (err) {
        // Fallback silently
      }
      try {
        if (api.getBlogs) {
          const bRes = await api.getBlogs();
          if (bRes && bRes.data && bRes.data.length > 0) {
            setBlogs(bRes.data);
          }
        }
      } catch (err) {}
    };
    fetchData();
  }, []);

  // Auto advance slides every 5000ms (5s) with pause on hover/interaction
  useEffect(() => {
    if (isCarouselPaused || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides, isCarouselPaused]);

  return (
    <div className="bg-white font-inter text-[#555555]">

      {/* ──────────────────────────────────────────────
          1. HERO CAROUSEL SLIDER (Strictly Database Driven from MongoDB Atlas with Shimmer Loading)
          ────────────────────────────────────────────── */}
      {heroSlides.length === 0 ? (
        <section className="relative w-full bg-slate-900 h-screen min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#003D39]/40 via-[#007A73]/20 to-[#003D39]/40 animate-shimmer" />
          <div className="z-10 text-center px-6 space-y-5 animate-pulse-soft">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mx-auto flex items-center justify-center border border-white/20 shadow-2xl animate-float">
              <span className="text-3xl">🌿</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-sansita font-bold text-white tracking-wide drop-shadow-md">
              Synergy Medical Yoga Therapy
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm text-teal-200/90 border border-teal-500/30">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Connecting to cloud therapy server &amp; loading live banners...</span>
            </div>
          </div>
        </section>
      ) : (
        <section
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          className="relative w-full overflow-hidden bg-gray-900 h-screen min-h-[500px] flex items-center group shadow-2xl"
        >
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img
                src={getImageUrl(s.src)}
                alt={s.alt}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = s.fallback || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80';
                }}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${i === slide ? 'scale-105' : 'scale-100'}`}
              />
              {/* Optional Slide Heading Overlay (only shown if title/subtitle exists) */}
              {(s.heading || s.subtitle) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent pointer-events-none" />
                  <div className="absolute left-4 sm:left-10 md:left-16 right-4 top-1/2 -translate-y-1/2 max-w-xl text-white z-20 space-y-3 sm:space-y-4 pointer-events-none">
                    {s.heading && (
                      <h1 className="font-sansita text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md whitespace-pre-line">
                        {s.heading}
                      </h1>
                    )}
                    {s.subtitle && (
                      <p className="text-xs sm:text-base text-gray-200 font-medium max-w-md drop-shadow line-clamp-3">
                        {s.subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Carousel Arrow Controls */}
          <button
            onClick={() => setSlide((slide - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setSlide((slide + 1) % heroSlides.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${i === slide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* ──────────────────────────────────────────────
          2. ABOUT iMediYog Healthcare LLP
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text column - Immediately visible to eliminate hidden text bug with gentle hover elevation */}
            <div ref={aboutRef} className="lg:col-span-7 space-y-6 opacity-100 transition-all duration-300 hover:translate-x-1">
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                About iMediYog Healthcare LLP
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                <strong className="text-[#005550]">iMediYog Healthcare LLP</strong> is a Pune-based healthcare company with a vision to become a comprehensive <strong className="text-gray-900">Therapy Care Hub</strong>, making quality therapy education and services accessible through an integrated ecosystem of certified professionals, technology, and innovative healthcare solutions across multiple therapy disciplines.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                <strong className="text-[#005550]">Synergy Medical Yoga</strong> is one of iMediYog Healthcare LLP's flagship initiatives dedicated to democratizing <strong className="text-gray-900">Rope &amp; Belt Therapy</strong> for the prevention and conservative management of <strong className="text-gray-900">knee, back, and neck pain</strong>. Through certified education programs, clinically designed therapy products, and a technology platform connecting people with certified Rope &amp; Belt Therapy practitioners, Synergy Medical Yoga is making this specialized therapy more accessible across India.
              </p>

              <div>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-[#005550] hover:bg-[#003d39] text-white font-bold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 animate-float"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Logo column */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={IMEDIYOG_LOGO}
                alt="iMediYog Healthcare LLP"
                className="max-w-xs sm:max-w-md w-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          3. WHY LEARN RBT WITH SYNERGY MEDICAL YOGA (Live WordPress Alternating Timeline Design)
          ────────────────────────────────────────────── */}
      <section className="py-10 bg-gradient-to-b from-[#f8fdfe] to-[#f1fafe] relative overflow-hidden">
        {/* Decorative Botanical Timeline Wave connecting illustrations across columns */}
        <div className="absolute top-[52%] left-0 w-full -translate-y-1/2 pointer-events-none hidden lg:block overflow-hidden opacity-70 z-0">
          <svg viewBox="0 0 1400 200" className="w-full h-44 stroke-emerald-600/40 fill-none" strokeWidth="1.5">
            <path d="M -100,100 C 200,10 400,190 700,100 C 1000,10 1200,180 1500,100" strokeDasharray="6 6" />
            <path d="M 280,60 Q 295,45 305,60 Q 295,75 280,60 Z" className="fill-emerald-100 stroke-emerald-700/60" strokeDasharray="none" />
            <path d="M 660,135 Q 675,120 685,135 Q 675,150 660,135 Z" className="fill-emerald-100 stroke-emerald-700/60" strokeDasharray="none" />
            <path d="M 1040,75 Q 1055,60 1065,75 Q 1055,90 1040,75 Z" className="fill-emerald-100 stroke-emerald-700/60" strokeDasharray="none" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 items-stretch">
            
            {/* Column 1: Title ABOVE, Image CENTER, Text BELOW */}
            <div className="flex flex-col justify-between text-left">
              <div>
                <h2 className="font-sansita italic text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#005550] leading-tight mb-4">
                  Why Learn RBT with<br />Synergy Medical Yoga
                </h2>
              </div>
              <div className="my-6 h-52 sm:h-60 flex items-center justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={RBT_LEARN}
                  alt="Learn it from Experts"
                  className="max-h-full object-contain filter drop-shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Education_Titl_Img.webp'; }}
                />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg mb-1.5">
                  Learn it from Experts
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  of 45 Hours of Intensive Training in hybrid online and offline mode offering flexibility.
                </p>
              </div>
            </div>

            {/* Column 2: Text ABOVE, Image CENTER/BELOW */}
            <div className="flex flex-col justify-between text-left lg:pt-2">
              <div className="mb-6">
                <h3 className="font-poppins font-bold text-[#005550] text-lg mb-1.5">
                  Structured &amp; Focused Curriculum
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Comprehensive Theory &amp; Practical Curriculum, Course Books &amp; Personalized Tying Protocol Video Access
                </p>
              </div>
              <div className="my-6 h-56 sm:h-64 flex items-center justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={RBT_CURRIC}
                  alt="Structured & Focused Curriculum"
                  className="max-h-full object-contain filter drop-shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png'; }}
                />
              </div>
              <div className="hidden lg:block h-12"></div>
            </div>

            {/* Column 3: Image ABOVE/CENTER, Text BELOW */}
            <div className="flex flex-col justify-between text-left">
              <div className="hidden lg:block h-6"></div>
              <div className="my-6 h-60 sm:h-68 flex items-center justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={RBT_MONETIZE}
                  alt="Monetize Your Skil"
                  className="max-h-full object-contain filter drop-shadow-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = PRODUCT_KNEE; }}
                />
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg mb-1.5">
                  Monetize Your Skil
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Opportunity to become Synergy Medical Yoga Products Reseller
                </p>
              </div>
            </div>

            {/* Column 4: Text ABOVE, Image BELOW */}
            <div className="flex flex-col justify-between text-left lg:pt-4">
              <div className="mb-6">
                <h3 className="font-poppins font-bold text-[#005550] text-lg mb-1.5">
                  Build Your Career
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Become the part of Synergy App to get enquires from patients directly in your inbox
                </p>
              </div>
              <div className="my-6 h-56 sm:h-64 flex items-center justify-center relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={RBT_CAREER}
                  alt="Build Your Career"
                  className="max-h-full object-contain filter drop-shadow-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = APP_MOCKUP; }}
                />
              </div>
              <div className="hidden lg:block h-8"></div>
            </div>

          </div>

          {/* CTA to Full Course Page */}
          <div className="mt-12 text-center">
            <button
              onClick={() => { setActivePage('rbt-course'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore RBT Course Syllabus &amp; Register for 5th Sept Batch (₹19,999/-)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          4. ORTHOPAEDIC PAIN RELIEF BANNER SECTION
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text - Immediately visible to eliminate hidden text bug */}
            <div ref={orthRef} className="lg:col-span-6 space-y-6 animate-fade-in-left-lg opacity-100 translate-x-0">
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                Explore Our Orthopaedic Pain Relief &amp; Posture Correction Belts
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Experience the power of Yoga &amp; modern medicin principles of anatomy into our knee stabilizers or the neck pain releif kit for corporates. These kits are designed for specific conditions keeping in mind the overuse of certain joints during certain sports activities like running , cycling , trekking or even for that matter gym activities. It has been proven grealy useful for those who are in sedentary jobs in corporates. Trusted by hundreds of sports enthusiats and corporate employees , synergy has become partner in their journey of better joint health , be it knees , neck or back.
              </p>
            </div>

            {/* Right image - Enlarged width & height */}
            <div className="lg:col-span-6 flex justify-center">
              <img
                src={PRODUCT_KNEE}
                alt="Knee Stabilizer Belts"
                className="w-full max-w-lg sm:max-w-xl max-h-[520px] object-cover sm:object-contain rounded-3xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          5. FEATURED PRODUCTS SHOWCASE
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8] border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex justify-between items-center">
            <p className="text-[#005550] font-semibold text-sm">Showing top featured therapeutic kits (4 in a row)</p>
            <button
              onClick={() => setActivePage('shop')}
              className="text-xs font-extrabold text-[#005550] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {(featuredProducts.length > 0 ? featuredProducts : PRODUCTS.slice(0, 4)).map((p) => (
              <ProductCard
                key={p._id || p.id}
                product={p}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                onViewDetails={onViewDetails}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          5.5 BECAUSE SHE DESERVES TO WALK FREE FROM PAIN
          ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#e0f5f3] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold text-[#005550] leading-tight">
                Because She<br />Deserves<br />to Walk Free<br />from Pain.
              </h2>
            </div>
            <div className="lg:col-span-6 flex justify-center">
              <img
                src="https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png"
                alt="Because She Deserves to Walk Free from Pain"
                className="w-full max-w-lg object-contain rounded-3xl drop-shadow-xl hover:scale-102 transition-transform duration-500"
                onError={(e) => { e.target.onerror = null; e.target.src = APP_MOCKUP; }}
              />
            </div>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          6. DOWNLOAD OUR APP
          ────────────────────────────────────────────── */}
      <section className="py-10 bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Phone mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={APP_MOCKUP}
                alt="Download Synergy MYT App"
                className="max-w-sm sm:max-w-md w-full object-contain drop-shadow-2xl animate-float-slow"
              />
            </div>

            {/* Text & Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#005550]">
                  FIND THE NEAREST THERAPIST / CENTER
                </p>
                <div className="w-16 h-0.5 bg-[#005550]" />
              </div>

              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                Download Our App
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Discover the transformative power of Medical Yoga Therapy with our all-in-one app! Whether you're seeking a qualified therapist nearby, who can come to your place for therapy service or a medical yoga therapy centre nearby who can take care of your pain management end to end, our app has you covered.
              </p>

              {/* App badges & Actual QR code scanners */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl border border-gray-200 shrink-0">
                    <img src={getImageUrl(settings.playStoreQrImage || PLAY_QR)} alt="Google Play QR Code" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <img src={PLAYSTORE} alt="Google Play" className="h-7 object-contain mb-1" />
                    <p className="text-[10px] text-gray-500 font-bold">Scan QR code to install</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100">
                  <div className="w-16 h-16 bg-white p-1 rounded-xl border border-gray-200 shrink-0">
                    <img src={getImageUrl(settings.appStoreQrImage || APPLE_QR)} alt="App Store QR Code" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <img src={APPSTORE} alt="App Store" className="h-7 object-contain mb-1" />
                    <p className="text-[10px] text-gray-500 font-bold">Scan QR code to install</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-teal-100/60 max-w-4xl mx-auto mt-16 grid grid-cols-3 divide-x divide-gray-200 text-center">
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={settings.statsCities ?? 15} />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">CITIES</p>
            </div>
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={settings.statsCenters ?? 200} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">CENTERS</p>
            </div>
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={settings.statsTherapists ?? 400} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">THERAPISTS</p>
            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          6.5 DOWNLOAD OUR APP TO BOOK AN APPOINTMENT
          ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#eaf6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight whitespace-pre-line">
                {settings.appPromoHeading || 'Download Our App\nto Book an Appoiment'}
              </h2>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={settings.playStoreUrl || "https://play.google.com/store/apps"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl hover:bg-black transition-all shadow-md"
                >
                  <QrCode className="w-8 h-8 text-teal-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400">GET IT ON</p>
                    <p className="text-sm font-bold text-white leading-none">Google Play</p>
                  </div>
                </a>

                <a
                  href={settings.appStoreUrl || "https://apps.apple.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl hover:bg-black transition-all shadow-md"
                >
                  <QrCode className="w-8 h-8 text-teal-400" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400">DOWNLOAD ON THE</p>
                    <p className="text-sm font-bold text-white leading-none">App Store</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <img
                src={getImageUrl(settings.appMockupImage || "https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png")}
                alt="Therapist with Synergy MYT App"
                className="max-w-md w-full object-contain drop-shadow-2xl animate-float-slow"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          7. TESTIMONIALS
          ────────────────────────────────────────────── */}
      <section className="py-12 bg-[#005550] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center space-y-2 mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-200">TESTIMONIALS</p>
            <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              What they say about us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-center">
              <p className="italic text-base leading-relaxed text-gray-700 mb-6">
                "Used synergy medical yoga therapy products and services to treat my lower back spasm. It works like amazing.. more &amp; more people shoud know about it"
              </p>
              <div>
                <h4 className="font-poppins font-bold text-[#005550] text-base">Shirish Atkari</h4>
                <p className="text-xs text-gray-500 mt-1">(42 , IT Professional)</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-center">
              <p className="italic text-base leading-relaxed text-gray-700 mb-6">
                "Belt rope technique effectively helped with my neck pain in couple of weeks. I highly reccomend it to those suffering from neck pain , back pain due to working in sedantary jobs and have long hours sitting in front of computer"
              </p>
              <div>
                <h4 className="font-poppins font-bold text-[#005550] text-base">Yashashree Bhattad</h4>
                <p className="text-xs text-gray-500 mt-1">(25 , Fitness Professional)</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white text-gray-800 rounded-2xl p-8 shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-center">
              <p className="italic text-base leading-relaxed text-gray-700 mb-6">
                "Very good results, my lower back pain feels relaxed and strong. Highly recommend to consider this therapy for joint pain management."
              </p>
              <div>
                <h4 className="font-poppins font-bold text-[#005550] text-base">Kranti Nalgirkar</h4>
                <p className="text-xs text-gray-500 mt-1">(30 , Home Maker)</p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          8. EXPERT BLOGS
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">READ OUR EXPERT TERAPISTS</p>
            <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550]">
              Expert Blogs
            </h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b, i) => (
              <div key={b._id || i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col justify-between">
                <div>
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getImageUrl(b.image || b.imageUrl)}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">{b.category || 'Therapy Guide'}</span>
                    <h3 className="font-poppins font-bold text-[#2C2D33] text-lg leading-snug group-hover:text-[#005550] transition-colors">
                      {b.title}
                    </h3>
                    {b.excerpt && <p className="text-xs text-gray-600 line-clamp-2">{b.excerpt}</p>}
                    <p className="text-xs text-gray-400">{b.date || 'Clinical Publication'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
