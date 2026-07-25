import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, QrCode } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';

/* ── Exact Image URLs from Original Site ── */
const HERO_SLIDES = [
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg',
    alt: 'Synergy Medical Yoga Banner',
    heading: 'Guided Training Videos\nfor Therapeutic Exercises\nat Home',
  },
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner-2.jpg',
    alt: 'Synergy Medical Yoga Banner 2',
    heading: 'Professional Rope & Belt\nTherapy for Pain Management',
  },
  {
    src: 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner-3.jpg',
    alt: 'Synergy Medical Yoga Banner 3',
    heading: 'Evidence-Based\nTherapy Programs\nfor Faster Recovery',
  },
];

const IMEDIYOG_LOGO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/I-Mediyog-Logo_PNG-06.png';
const PRODUCT_KNEE   = 'https://synergymedicalyoga.com/wp-content/uploads/2026/06/HEaro-Image-300x300.png';
const PRODUCT_NECK   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Neck-Pain-01-300x300.png';
const PRODUCT_CORP   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Product-2-300x300.png';
const APP_MOCKUP     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png';
const PLAYSTORE      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE       = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';
const DOCTOR         = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/doctor_1.png';

const RBT_LEARN      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Learn-from-Experts.png';
const RBT_CURRIC     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Curriculum.png';
const RBT_MONETIZE   = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Monetize.png';
const RBT_CAREER     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Build-Career.png';

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

export default function HomePage({ setActivePage, onAddToCart }) {
  const [slide, setSlide] = useState(0);
  const aboutRef = useRef(null);
  const [aboutVisible, setAboutVisible] = useState(false);

  const orthRef = useRef(null);
  const [orthVisible, setOrthVisible] = useState(false);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % total), 5500);
    return () => clearInterval(timer);
  }, [total]);

  // Track scroll direction reliably
  const prevScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollDir = useRef(false); // true = down, false = up

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      scrollDir.current = y > prevScrollY.current;
      prevScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const scrolledDown = scrollDir.current;
            if (e.isIntersecting && scrolledDown) {
              if (e.target === aboutRef.current) {
                setAboutVisible(true);
              }
              if (e.target === orthRef.current) {
                setOrthVisible(true);
              }
            }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    if (aboutRef.current) obs.observe(aboutRef.current);
    if (orthRef.current) obs.observe(orthRef.current);

    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-white font-inter text-[#555555]">

      {/* ──────────────────────────────────────────────
          1. HERO CAROUSEL SLIDER
          ────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-gray-900 h-screen flex items-center">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={s.src}
              alt={s.alt}
              className="w-full h-screen object-cover"
            />
            {/* Subtle left vignette gradient so white text pops cleanly */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
            
            {/* Slide Heading Overlay */}
            <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 max-w-xl text-white z-20 space-y-4">
              <h1 className="font-sansita text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md whitespace-pre-line">
                {s.heading}
              </h1>
            </div>
          </div>
        ))}

        {/* Carousel Arrow Controls */}
        <button
          onClick={() => setSlide((slide - 1 + total) % total)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSlide((slide + 1) % total)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${i === slide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          2. ABOUT iMediYog Healthcare LLP
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text column */}
            <div ref={aboutRef} className={`lg:col-span-7 space-y-6 transition-all duration-700 ${aboutVisible ? 'animate-fade-in-left-lg opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
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
          3. WHY LEARN RBT WITH SYNERGY MEDICAL YOGA
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f9f9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-14">
            <h2 className="font-sansita italic text-3xl sm:text-4xl font-bold text-[#005550] leading-tight">
              Why Learn RBT with<br />Synergy Medical Yoga
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            <div className="text-center space-y-4 px-6">
              <div className="mx-auto w-44 h-44 flex items-center justify-center">
                <img
                  src={RBT_LEARN}
                  alt="Learn it from Experts"
                  className="max-h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Education_Titl_Img.webp'; }}
                />
              </div>
              <h3 className="font-poppins font-bold text-[#005550] text-lg">
                Learn it from Experts
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                of 45 Hours of Intensive Training in hybrid online and offline mode offering flexibility.
              </p>
            </div>

            <div className="text-center space-y-4 px-6">
              <div className="mx-auto w-44 h-44 flex items-center justify-center">
                <img
                  src={RBT_CURRIC}
                  alt="Structured & Focused Curriculum"
                  className="max-h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png'; }}
                />
              </div>
              <h3 className="font-poppins font-bold text-[#005550] text-lg">
                Structured &amp; Focused Curriculum
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Comprehensive Theory &amp; Practical Curriculum, Course Books &amp; Personalized Tying Protocol Video Access
              </p>
            </div>

            <div className="text-center space-y-4 px-6">
              <div className="mx-auto w-44 h-44 flex items-center justify-center">
                <img
                  src={RBT_MONETIZE}
                  alt="Monetize Your Skil"
                  className="max-h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = PRODUCT_KNEE; }}
                />
              </div>
              <h3 className="font-poppins font-bold text-[#005550] text-lg">
                Monetize Your Skil
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Opportunity to become Synergy Medical Yoga Products Reseller
              </p>
            </div>

            <div className="text-center space-y-4 px-6">
              <div className="mx-auto w-44 h-44 flex items-center justify-center">
                <img
                  src={RBT_CAREER}
                  alt="Build Your Career"
                  className="max-h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = APP_MOCKUP; }}
                />
              </div>
              <h3 className="font-poppins font-bold text-[#005550] text-lg">
                Build Your Career
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                Become the part of Synergy App to get enquires from patients directly in your inbox
              </p>
            </div>

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
            <div ref={orthRef} className={`lg:col-span-6 space-y-6 transition-all duration-700 ${orthVisible ? 'animate-fade-in-left-lg opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
                Explore Our Orthopaedic Pain Relief &amp; Posture Correction Belts
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700">
                Experience the power of Yoga &amp; modern medicin principles of anatomy into our knee stabilizers or the neck pain releif kit for corporates. These kits are designed for specific conditions keeping in mind the overuse of certain joints during certain sports activities like running , cycling , trekking or even for that matter gym activities. It has been proven grealy useful for those who are in sedentary jobs in corporates. Trusted by hundreds of sports enthusiats and corporate employees , synergy has become partner in their journey of better joint health , be it knees , neck or back.
              </p>
            </div>

            {/* Right image */}
            <div className="lg:col-span-6 flex justify-center">
              <img
                src={PRODUCT_KNEE}
                alt="Knee Stabilizer Belts"
                className="max-w-md w-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
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
          
          <div>
            <p className="text-[#005550] font-semibold text-sm">Showing all 3 results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCTS.slice(0,3).map((p, idx) => (
              <div key={p.id} className="bg-white rounded-4xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="bg-[#f5f7f8] rounded-3xl p-6 flex justify-center items-center h-64 mb-6">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-poppins font-bold text-[#2C2D33] text-lg text-center leading-snug mb-3">
                    {p.name}
                  </h3>
                </div>
                <div className="text-center space-y-4 pt-4">
                  <p className="font-bold text-[#2C2D33] text-xl">₹{p.price.toFixed(2)}</p>
                  {idx === 0 ? (
                    <button
                      onClick={() => onQuickView(p)}
                      className="bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 px-6 rounded-lg w-full transition-colors shadow-sm"
                    >
                      Select options
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddToCart(p, p.sizes?.[0])}
                      className="bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3.5 px-6 rounded-lg w-full transition-colors shadow-sm"
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          6. DOWNLOAD OUR APP
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-linear-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Phone mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={APP_MOCKUP}
                alt="Download Synergy MYT App"
                className="max-w-sm sm:max-w-md w-full object-contain drop-shadow-2xl"
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
                Discover the transformative power of Medical Yoga Therapy with our all-in-one app! Whether you're seeking a qualified therapist nearby, who can come to your place for therapy service or a medical yoga therapy centre nearby who can take care of your pain management end to end, our app has you covered. Every therapist on the app is connected to a synergy doctor and hence is enabled to provide the comprehensive care. We believe in power of integraed approach of having a yoga therapist and doctor working together for better results.
              </p>

              {/* App badges & QR codes */}
              <div className="flex flex-wrap gap-6 pt-4 items-center">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-teal-100">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={PLAYSTORE} alt="Google Play" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium">Scan or tap to get app</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-teal-100">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={APPSTORE} alt="App Store" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium">Scan or tap to get app</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-teal-100/60 max-w-4xl mx-auto mt-16 grid grid-cols-3 divide-x divide-gray-200 text-center">
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={15} />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">CITIES</p>
            </div>
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={200} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">CENTERS</p>
            </div>
            <div className="px-4">
              <div className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#005550]">
                <Counter end={400} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold tracking-widest text-gray-600 uppercase mt-2">THERAPISTS</p>
            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          7. TESTIMONIALS
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#005550] text-white relative overflow-hidden">
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
            
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img
                  src="https://synergymedicalyoga.com/wp-content/uploads/2025/05/Banner.jpg"
                  alt="Knee Therapy Blog"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">Knee Therapy</span>
                <h3 className="font-poppins font-bold text-[#2C2D33] text-lg leading-snug group-hover:text-[#005550] transition-colors">
                  Understanding Knee Pain: Causes, Prevention &amp; RBT Therapy
                </h3>
                <p className="text-xs text-gray-400">May 15, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img
                  src={PRODUCT_NECK}
                  alt="Cervical Therapy Blog"
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">Cervical Therapy</span>
                <h3 className="font-poppins font-bold text-[#2C2D33] text-lg leading-snug group-hover:text-[#005550] transition-colors">
                  Neck Pain Relief Through Rope &amp; Belt Therapy: A Clinical Guide
                </h3>
                <p className="text-xs text-gray-400">Jun 2, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img
                  src={DOCTOR}
                  alt="Back Therapy Blog"
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">Back Therapy</span>
                <h3 className="font-poppins font-bold text-[#2C2D33] text-lg leading-snug group-hover:text-[#005550] transition-colors">
                  Back to Wellness: Lumbar Pain Management with Medical Yoga
                </h3>
                <p className="text-xs text-gray-400">Jul 10, 2025</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
