import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, QrCode, BookOpen, Package, Smartphone } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import { api, getImageUrl } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useSiteSettings } from '../lib/useSiteSettings';
import ScrollReveal from '../components/ScrollReveal';

const IMEDIYOG_LOGO  = '/images/others/I-Mediyog-Logo_PNG-06.webp';
const PRODUCT_KNEE   = '/images/others/HEaro-Image.png';
const PRODUCT_NECK   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Neck-Pain-01-300x300.png';
const PRODUCT_CORP   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Product-2-300x300.png';
const APP_MOCKUP     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-%E0%A5%A8-1-scaled.png';
const PLAYSTORE      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE       = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';
const DOCTOR         = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/doctor_1.png';

const RBT_LEARN      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Learn-from-Experts.png';
const RBT_CURRIC     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Curriculum.png';
const RBT_MONETIZE   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Monetize.png';
const RBT_CAREER     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Build-Career.png';

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
    src: '/images/carousel/home/Website-Banner-4.webp',
    fallback: '/images/carousel/home/Website-Banner-4.webp',
    alt: 'Synergy Medical Yoga knee pain prevention kit banner',
    heading: '',
    subtitle: '',
    buttonText: 'Explore Shop',
    buttonLink: '/shop',
  },
  {
    src: '/images/carousel/home/Products-Banner-scaled.webp',
    fallback: '/images/carousel/home/Products-Banner-scaled.webp',
    alt: 'Synergy Medical Yoga therapy products banner',
    heading: '',
    subtitle: '',
    buttonText: 'Explore Products',
    buttonLink: '/shop',
  },
  {
    src: '/images/carousel/home/Synergy-website-2.0-05-scaled.webp',
    fallback: '/images/carousel/home/Synergy-website-2.0-05-scaled.webp',
    alt: 'Synergy Medical Yoga therapy education banner',
    heading: '',
    subtitle: '',
    buttonText: 'View Services',
    buttonLink: '/services',
  },
  {
    src: '/images/carousel/home/Synergy-website-2.0-09-scaled.webp',
    fallback: '/images/carousel/home/Synergy-website-2.0-09-scaled.webp',
    alt: 'Synergy Medical Yoga rope and belt therapy banner',
    heading: '',
    subtitle: '',
    buttonText: 'Book Appointment',
    buttonLink: '/services',
  },
  {
    src: '/images/carousel/home/Practicals-Teaching-Image.webp',
    fallback: '/images/carousel/home/Practicals-Teaching-Image.webp',
    alt: 'Synergy Medical Yoga practical teaching banner',
    heading: '',
    subtitle: '',
    buttonText: 'View Course',
    buttonLink: '/education',
  },
  {
    src: '/images/carousel/home/Theory-Teaching-Image.webp',
    fallback: '/images/carousel/home/Theory-Teaching-Image.webp',
    alt: 'Synergy Medical Yoga theory teaching banner',
    heading: '',
    subtitle: '',
    buttonText: 'View Course',
    buttonLink: '/education',
  },
  {
    src: '/images/carousel/home/WhatsApp-Image-2025-08-29-at-3.31.12-PM-1.webp',
    fallback: '/images/carousel/home/WhatsApp-Image-2025-08-29-at-3.31.12-PM-1.webp',
    alt: 'Synergy Medical Yoga therapy care banner',
    heading: '',
    subtitle: '',
    buttonText: 'Contact Us',
    buttonLink: '/contact',
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
      if (cached) return JSON.parse(cached);
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
  const [blogs, setBlogs] = useState([]);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !e.changedTouches || !e.changedTouches[0]) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      setSlide((prev) => (prev + 1) % (heroSlides.length || 1));
    } else if (diff < -40) {
      setSlide((prev) => (prev - 1 + (heroSlides.length || 1)) % (heroSlides.length || 1));
    }
    setTouchStartX(null);
  };
  const [aboutVisible] = useState(true);
  const [orthVisible] = useState(true);
  const aboutRef = useRef(null);
  const orthRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (api.getPublicCarousels) {
          const cRes = await api.getPublicCarousels();
          if (cRes?.data && Array.isArray(cRes.data) && cRes.data.length > 0) {
            const homeSlides = cRes.data.filter((c) => {
              const raw = c.imageUrl || c.src || c.url || c.image;
              return raw && typeof raw === 'string' && raw.trim().length > 0 && (!c.page || c.page === 'home' || c.page === 'all');
            });
            if (homeSlides.length > 0) {
              const mapped = homeSlides.map((c, idx) => {
                const fallback = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length].src;
                const rawSrc = c.imageUrl || c.src || c.url || c.image;
                return {
                  src: rawSrc ? getImageUrl(rawSrc) : fallback,
                  fallback,
                  alt: c.title || c.alt || 'Synergy Medical Yoga Banner',
                  heading: c.heading || c.title || '',
                  subtitle: c.subtitle || c.description || '',
                  buttonText: c.buttonText || 'Explore Shop',
                  buttonLink: c.buttonLink || '/shop',
                };
              });
              setHeroSlides(mapped);
              try { localStorage.setItem('synergy_cached_home_carousels', JSON.stringify(mapped)); } catch (e) {}
            }
          }
        }
      } catch (err) {}
      try {
        const pRes = await api.getProducts();
        if (pRes.data && pRes.data.length > 0) {
          setFeaturedProducts(pRes.data.slice(0, 4));
          try { localStorage.setItem('synergy_cached_home_products', JSON.stringify(pRes.data.slice(0, 4))); } catch (e) {}
        }
      } catch (err) {}
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
    <div className="bg-white font-inter text-sm sm:text-[15px] text-[#555555]">

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
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden bg-[#f8fbfb] h-[50vh] sm:h-[70vh] lg:h-screen min-h-[320px] sm:min-h-[480px] max-h-[800px] flex items-center group shadow-xl touch-pan-y"
        >
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <img
                src={getImageUrl(s.src)}
                alt={s.alt || 'Synergy Medical Yoga Banner'}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                onError={(e) => {
                  const localFallback = DEFAULT_HERO_SLIDES[i % DEFAULT_HERO_SLIDES.length]?.src || '/images/carousel/home/Website-Banner-4.webp';
                  if (e.target.src !== localFallback && !e.target.src.endsWith(localFallback)) {
                    e.target.src = localFallback;
                  } else {
                    e.target.onerror = null;
                    e.target.src = '/images/carousel/home/Website-Banner-4.webp';
                  }
                }}
                onClick={() => {
                  if (s.buttonLink) {
                    const target = s.buttonLink.replace(/^\//, '') || 'home';
                    setActivePage(target);
                  }
                }}
                className="w-full h-full object-cover bg-[#f8fbfb] cursor-pointer"
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
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#005550] text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer shadow-lg active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setSlide((slide + 1) % heroSlides.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 bg-black/40 hover:bg-[#005550] text-white rounded-full flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer shadow-lg active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer ${i === slide ? 'bg-gray-800 scale-125 shadow-sm' : 'bg-gray-400/70 hover:bg-gray-600'}`}
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
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text column */}
              <div ref={aboutRef} className="lg:col-span-7 space-y-6">
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
                    className="bg-[#005550] hover:bg-[#003d39] text-white font-bold px-8 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2 btn-glow-primary"
                  >
                    <span>Know More</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Logo column */}
              <div className="lg:col-span-5 flex justify-center img-zoom-hover">
                <img
                  src={getImageUrl(IMEDIYOG_LOGO)}
                  alt="iMediYog Healthcare LLP"
                  className="max-w-xs sm:max-w-md w-full object-contain drop-shadow-md transition-transform duration-500"
                />
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          2B. SYNERGY EDUCATION - LEARN RBT
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Left Image Column */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-teal-100/80 group max-w-lg w-full">
                  <img
                    src="https://synergymedicalyoga.com/wp-content/uploads/2026/08/WhatsApp-Image-2026-07-31-at-7.30.41-AM-1-e1785843613878.jpeg"
                    alt="Learn Rope & Belt Therapy with Synergy Medical Yoga"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003834]/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>
              </div>

              {/* Right Content Column */}
              <div className="lg:col-span-6 space-y-7">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#005550] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80">
                      Synergy education
                    </span>
                    <div className="h-0.5 w-12 bg-[#005550]/40 rounded-full" />
                  </div>
                  
                  <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Learn Rope &amp; Belt Therapy with Synergy Medical Yoga
                  </h2>
                </div>

                <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                  Build practical skills through Synergy’s structured Rope &amp; Belt Therapy education programme, designed for yoga teachers, therapists and wellness professionals.
                </p>

                {/* 3 Feature Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Box 1 */}
                  <div className="bg-[#f4fbfb] p-5 rounded-2xl border border-teal-100/80 text-center hover:bg-teal-50/70 transition-all duration-300 shadow-xs flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#005550] text-white flex items-center justify-center shadow-md">
                      <BookOpen className="w-6 h-6 text-teal-200" />
                    </div>
                    <h3 className="font-poppins font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                      Structured curriculum
                    </h3>
                  </div>

                  {/* Box 2 */}
                  <div className="bg-[#f4fbfb] p-5 rounded-2xl border border-teal-100/80 text-center hover:bg-teal-50/70 transition-all duration-300 shadow-xs flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#005550] text-white flex items-center justify-center shadow-md">
                      <Package className="w-6 h-6 text-teal-200" />
                    </div>
                    <h3 className="font-poppins font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                      Individual RBT kit for practice
                    </h3>
                  </div>

                  {/* Box 3 */}
                  <div className="bg-[#f4fbfb] p-5 rounded-2xl border border-teal-100/80 text-center hover:bg-teal-50/70 transition-all duration-300 shadow-xs flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#005550] text-white flex items-center justify-center shadow-md">
                      <Smartphone className="w-6 h-6 text-teal-200" />
                    </div>
                    <h3 className="font-poppins font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                      Continued learning and app support
                    </h3>
                  </div>
                </div>

                {/* Explore Education Button */}
                <div className="pt-2">
                  <a
                    href="https://synergymedicalyoga.com/education/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (setActivePage) {
                        e.preventDefault();
                        setActivePage('course');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="bg-[#005550] hover:bg-[#003d39] text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2.5 btn-glow-primary group cursor-pointer"
                  >
                    <span>Explore Education</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          3. WHY LEARN RBT WITH SYNERGY MEDICAL YOGA
          ────────────────────────────────────────────── */}
      <section className="w-full bg-[#f8fdfe] py-0 px-0 overflow-hidden">
        <img
          src="/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp"
          alt="Why learn RBT with Synergy Medical Yoga"
          className="w-full h-full object-cover block"
        />
      </section>
      <section className="hidden">
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
              onClick={() => { setActivePage('education'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Education Syllabus &amp; Register for 5th Sept Batch (₹19,999/-)</span>
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
            
            {/* Left text */}
            <div ref={orthRef} className="lg:col-span-6 space-y-6">
              <ScrollReveal animation="slide-left">
                <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                  Explore Our Orthopaedic Pain Relief &amp; Posture Correction Belts
                </h2>
                <p className="text-base sm:text-lg leading-relaxed text-gray-700 mt-4">
                  Experience the power of Yoga &amp; modern medicin principles of anatomy into our knee stabilizers or the neck pain releif kit for corporates. These kits are designed for specific conditions keeping in mind the overuse of certain joints during certain sports activities like running , cycling , trekking or even for that matter gym activities. It has been proven grealy useful for those who are in sedentary jobs in corporates. Trusted by hundreds of sports enthusiats and corporate employees , synergy has become partner in their journey of better joint health , be it knees , neck or back.
                </p>
              </ScrollReveal>
            </div>

            {/* Right image */}
            <div className="lg:col-span-6 flex justify-center">
              <ScrollReveal animation="zoom-in">
                <img
                  src={PRODUCT_KNEE}
                  alt="Knee Stabilizer Belts"
                  className="w-full sm:h-[480px] object-contain rounded-3xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          5. FEATURED PRODUCTS SHOWCASE
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8] border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <ScrollReveal animation="fade-up">
            <div className="flex justify-between items-center">
              <p className="text-[#005550] font-semibold text-sm">Showing top featured therapeutic kits (4 in a row)</p>
              <button
                onClick={() => setActivePage('shop')}
                className="text-xs font-extrabold text-[#005550] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Products <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={150}>
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
          </ScrollReveal>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          5.5 BECAUSE SHE DESERVES TO WALK FREE FROM PAIN
          ────────────────────────────────────────────── */}
      <section className="w-full bg-[#e0f5f3] py-0 px-0 overflow-hidden h-[200px] xs:h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] flex items-center">
        <img
          src="/images/others/Website-Banner-5.webp"
          alt="Because she deserves to walk free from pain"
          className="w-full h-full object-cover object-center block"
        />
      </section>


      {/* ──────────────────────────────────────────────
          6. DOWNLOAD OUR APP
          ────────────────────────────────────────────── */}
      <section className="py-10 bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Phone mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal animation="slide-left">
                <img
                  src={APP_MOCKUP}
                  alt="Download Synergy MYT App"
                  className="max-w-sm sm:max-w-md w-full object-contain drop-shadow-2xl animate-float-slow"
                />
              </ScrollReveal>
            </div>

            {/* Text & Badges */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal animation="slide-right">
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
                  <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover-lift">
                    <div className="w-16 h-16 bg-white p-1 rounded-xl border border-gray-200 shrink-0">
                      <img src={getImageUrl(settings.playStoreQrImage || PLAY_QR)} alt="Google Play QR Code" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div>
                      <img src={PLAYSTORE} alt="Google Play" className="h-7 object-contain mb-1" />
                      <p className="text-[10px] text-gray-500 font-bold">Scan QR code to install</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100 hover-lift">
                    <div className="w-16 h-16 bg-white p-1 rounded-xl border border-gray-200 shrink-0">
                      <img src={getImageUrl(settings.appStoreQrImage || APPLE_QR)} alt="App Store QR Code" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div>
                      <img src={APPSTORE} alt="App Store" className="h-7 object-contain mb-1" />
                      <p className="text-[10px] text-gray-500 font-bold">Scan QR code to install</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-teal-100/60 max-w-2xl mx-auto mt-10 grid grid-cols-3 divide-x divide-gray-200 text-center">
            <div className="px-2 sm:px-4">
              <div className="font-poppins font-extrabold text-xl sm:text-2xl md:text-3xl text-[#005550]">
                <Counter end={settings.statsCities ?? 15} />
              </div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-600 uppercase mt-1">CITIES</p>
            </div>
            <div className="px-2 sm:px-4">
              <div className="font-poppins font-extrabold text-xl sm:text-2xl md:text-3xl text-[#005550]">
                <Counter end={settings.statsCenters ?? 200} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-600 uppercase mt-1">CENTERS</p>
            </div>
            <div className="px-2 sm:px-4">
              <div className="font-poppins font-extrabold text-xl sm:text-2xl md:text-3xl text-[#005550]">
                <Counter end={settings.statsTherapists ?? 400} suffix="+" />
              </div>
              <p className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-600 uppercase mt-1">THERAPISTS</p>
            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          6.5 DOWNLOAD OUR APP TO BOOK AN APPOINTMENT
          ────────────────────────────────────────────── */}
      <section className="w-full bg-[#eaf6f6] py-0 px-0 overflow-hidden">
        <img
          src="/images/others/Download-the-app-Synergy-MYT-3-scaled.webp"
          alt="Download the Synergy MYT app"
          className="w-full h-full object-cover block"
        />
      </section>
      <section className="hidden">
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
                src={getImageUrl(settings.appMockupImage || "https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png")}
                alt="Therapist with Synergy MYT App"
                className="max-w-lg lg:max-w-xl w-full h-auto max-h-[580px] sm:max-h-[680px] lg:max-h-[750px] object-contain drop-shadow-2xl animate-float-slow transform hover:scale-105 transition-transform duration-500"
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
          8. EXPERT BLOGS (Dynamic from Backend API / Admin Panel)
          ────────────────────────────────────────────── */}
      <section className="hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">READ OUR EXPERT THERAPISTS</p>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Expert Blogs
            </h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto mt-2" />
          </div>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center max-w-xl mx-auto border border-gray-200/60 shadow-xs space-y-3">
              <p className="text-gray-600 font-medium text-sm">
                No blog posts published yet. Stay tuned for expert medical yoga therapy insights!
              </p>
              <p className="text-xs text-gray-400">
                Admin can publish and manage blogs from the Admin Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <div key={b._id || i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col justify-between">
                  <div>
                    <div className="h-44 overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(b.image || b.imageUrl)}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-2.5">
                      <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">{b.category || 'Therapy Guide'}</span>
                      <h3 className="font-poppins font-bold text-[#2C2D33] text-base leading-snug group-hover:text-[#005550] transition-colors">
                        {b.title}
                      </h3>
                      {b.excerpt && <p className="text-xs text-gray-600 line-clamp-2">{b.excerpt}</p>}
                      <p className="text-xs text-gray-400">{b.date || 'Clinical Publication'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
