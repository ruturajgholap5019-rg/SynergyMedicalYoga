import React from 'react';
import { Target, Eye, Award } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';
import { getImageUrl } from '../lib/api';

const CEO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';
const CSCO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/WhatsApp-Image-2025-07-21-at-11.36.32-AM.jpeg';
const CTO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Deepali.jpeg';

const IMEDIYOG_LOGO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/I-Mediyog-Logo_PNG-06.png';
const PLAYSTORE     = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';
const PLAY_QR       = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-03-at-8.34.11-PM.jpeg';
const APPLE_QR      = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-1.34.20-PM-1024x1024.jpeg';
const INTEGRATED_BG = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Website-Baners-04-992x1024.png';
const APP_MOCKUP    = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png';

const TEAM = [
  { 
    name: 'Manoj Deshmukh',   
    role: 'Digital Commerce Expert',       
    title: 'Chief Executive Officer',    
    img: CEO,
    linkedin: 'https://www.linkedin.com/in/manoj-deshmukh-7a235b6/'
  },
  { 
    name: 'Poonam Deshmukh',  
    role: 'B.Th.O. & OTR (US NBCOT)',     
    title: 'Chief Medical Officer',      
    img: CMO,
    linkedin: 'https://www.linkedin.com/in/poonam-deshmukh-7a863b3b3/'
  },
  { 
    name: 'Shubham Pawar',    
    role: 'Fitness Coach & Nutritionist',  
    title: 'Chief Supply Chain Officer', 
    img: CSCO,
    linkedin: 'https://www.linkedin.com/in/shubham-pawar-6779431b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
  { 
    name: 'Deepali Kulkarni', 
    role: 'Holistic Wellness Coach',      
    title: 'Chief Technology Officer',   
    img: CTO,
    linkedin: 'https://www.linkedin.com/in/shubham-pawar-6779431b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
  },
];

export default function AboutPage() {
  const { settings } = useSiteSettings();
  return (
    <div className="bg-white font-inter text-[#555555]">

      {/* ──────────────────────────────────────────────
          1. HERO BANNER HEADER
          ────────────────────────────────────────────── */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            About Medical Yoga Therapy
          </h1>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          2. ABOUT IMEDIYOG HEALTHCARE LLP & SYNERGY MEDICAL YOGA
          ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (50%): Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="w-16 h-1 bg-[#005550] rounded" />
              <h2 className="font-sansita text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 leading-tight">
                About iMediYog Healthcare LLP
              </h2>
            </div>

            <div className="space-y-4 text-base leading-relaxed text-gray-700 font-normal">
              <p>{settings.aboutCompanyText || 'iMediYog Healthcare LLP is a Pune-based healthcare company with a vision to become a comprehensive Therapy Care Hub, making quality therapy education and services accessible through an integrated ecosystem of certified professionals, technology, and innovative healthcare solutions across multiple therapy disciplines.'}</p>
              <p>{settings.synergyInitText || 'Synergy Medical Yoga is one of iMediYog Healthcare LLP’s flagship initiatives dedicated to democratizing Rope & Belt Therapy for the prevention and conservative management of knee, back, and neck pain. Through certified education programs, clinically designed therapy products, and a technology platform connecting people with certified Rope & Belt Therapy practitioners, Synergy Medical Yoga is making this specialized therapy more accessible across India.'}</p>
            </div>
          </div>

          {/* Right Column (50%): Brand Logo */}
          <div className="lg:col-span-6 flex items-center justify-center bg-gradient-to-b from-[#f4f7f8] to-[#eaefef] p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xs">
            <div className="w-full max-w-md flex justify-center">
              <img
                src={IMEDIYOG_LOGO}
                alt="iMediYog Healthcare LLP Logo"
                className="w-full h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          3. LEADERSHIP TEAM
          ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#f4f9f9] border-y border-teal-100/60">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-8 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">OUR LEADERSHIP</p>
            <h2 className="font-sansita text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900">
              Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl p-5 sm:p-6 text-center shadow-xs hover:shadow-xl border border-gray-200/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-4 border-[#005550]/15 shadow-md group-hover:scale-105 transition-transform duration-500 mb-4 bg-gray-100">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/doctor_1.png';
                      }}
                    />
                  </div>
                  <h3 className="font-poppins font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                  <p className="text-[#005550] text-sm font-semibold mb-0.5">{member.title}</p>
                  <p className="text-gray-500 text-xs font-medium">{member.role}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xs transform hover:-translate-y-1 cursor-pointer"
                    title={`Connect with ${member.name} on LinkedIn`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          4. MISSION, VISION, OBJECTIVE (Compact Sleek Cards)
          ────────────────────────────────────────────── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Mission */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-[#005550]/10 rounded-2xl flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300 mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-poppins font-extrabold text-xl text-gray-900 mb-2">Mission</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                {settings.missionText || 'To establish Medical Yoga Therapy as the preferred first-line treatment for individuals managing knee, back, and neck pain.'}
              </p>
            </div>
            <div className="w-10 h-1 bg-[#005550] rounded-full pt-0 mt-3" />
          </div>

          {/* Vision */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-[#005550]/10 rounded-2xl flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300 mb-3">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="font-poppins font-extrabold text-xl text-gray-900 mb-2">Vision</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                {settings.visionText || 'To minimize the need for surgeries by effectively managing degenerative musculoskeletal diseases and injuries of the knee, back, neck, and shoulder.'}
              </p>
            </div>
            <div className="w-10 h-1 bg-[#005550] rounded-full pt-0 mt-3" />
          </div>

          {/* Objective */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-[#005550]/10 rounded-2xl flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300 mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-poppins font-extrabold text-xl text-gray-900 mb-2">Objective</h4>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                {settings.objectiveText || 'To empower every household in India with at least one person trained in Medical Yoga Therapy.'}
              </p>
            </div>
            <div className="w-10 h-1 bg-[#005550] rounded-full pt-0 mt-3" />
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          5. MEDICAL YOGA THERAPY INTEGRATED APPROACH TO JOINT CARE
          ────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7f8] border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Title & Anatomical Poster */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#005550] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                  Clinical Synergy
                </span>
                <h2 className="font-sansita text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-gray-900 leading-tight">
                  Medical Yoga Therapy <br />
                  <span className="text-[#005550]">Integrated Approach To Joint Care</span>
                </h2>
                <div className="w-20 h-1 bg-[#005550] rounded" />
              </div>

              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden h-[480px] sm:h-[540px] lg:h-[600px] w-full">
                <img
                  src={INTEGRATED_BG}
                  alt="Integrated Approach To Joint Care"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: 3 Detailed Pillars */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pillar 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#005550] text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                    1
                  </div>
                  <h3 className="font-poppins font-bold text-[#2C2D33] text-lg sm:text-xl">
                    Bio-mechanical corrections to help slowing down the degeneration
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed pl-11">
                  Yoga based rope &amp; belt technique is used for bio-mechanical corrections in joints considering the anatomy of joints as well as pathology of pain condition. It helps in slowing down the degeneration of cartilage in the joint which helps in joint health longevity. This is done by trained and certified medical yoga therapists who work closely with yoga physicians in the background.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#005550] text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                    2
                  </div>
                  <h3 className="font-poppins font-bold text-[#2C2D33] text-lg sm:text-xl">
                    Physiological support to enable faster healing for chronic pains
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed pl-11">
                  Physiological support is essential for bio-mechanical corrections to work effectively. The body adapts to bio-mechanical corrections faster when parameters like inflammation and swelling are addressed by medicines—which can be any pathy that suits the individual case. This is where a yoga physician helps the yoga therapist drive superior results.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#005550] text-white font-extrabold flex items-center justify-center text-sm shrink-0">
                    3
                  </div>
                  <h3 className="font-poppins font-bold text-[#2C2D33] text-lg sm:text-xl">
                    Nutrition plan for ensuring overall recovery and sustained results
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed pl-11">
                  Nutrition plays a vital role in the body regaining its natural ability to heal itself and sustaining the adaptive corrections accomplished by the above two steps. A certified nutritionist is connected with the yoga therapist on each case to ensure medical yoga therapy truly delivers an integrated approach and long-lasting recovery.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          6. FULL-WIDTH PROMOTIONAL APP BANNER (ABOVE FOOTER)
          ────────────────────────────────────────────── */}
      <section className="w-full bg-[#e2e6e6] overflow-hidden py-12 sm:py-16 lg:py-20 border-t border-gray-300/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Title, Store Buttons & QR Codes */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <h2 className="font-sansita font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#005550] leading-tight tracking-tight whitespace-pre-line">
                {settings.appPromoHeading || 'Download Our App\nto Book an Appoiment'}
              </h2>

              <div className="flex flex-wrap items-start gap-8 sm:gap-12 pt-2">
                {/* Google Play Store */}
                <div className="flex flex-col items-center sm:items-start space-y-4">
                  <a
                    href={settings.playStoreUrl || "https://play.google.com/store/search?q=synergy%20medical&c=apps"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 hover:scale-105 transition-all duration-300 inline-block"
                  >
                    <img src={PLAYSTORE} alt="GET IT ON Google Play" className="h-11 sm:h-12 object-contain" />
                  </a>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white p-2.5 rounded-2xl shadow-md border border-gray-200/80">
                    <img src={getImageUrl(settings.playStoreQrImage || PLAY_QR)} alt="Google Play QR Code" className="w-full h-full object-cover rounded-xl" />
                  </div>
                </div>

                {/* Apple App Store */}
                <div className="flex flex-col items-center sm:items-start space-y-4">
                  <a
                    href={settings.appStoreUrl || "https://play.google.com/store/search?q=synergy%20medical&c=apps"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90 hover:scale-105 transition-all duration-300 inline-block"
                  >
                    <img src={APPSTORE} alt="Download on the App Store" className="h-11 sm:h-12 object-contain" />
                  </a>
                  <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white p-2.5 rounded-2xl shadow-md border border-gray-200/80">
                    <img src={getImageUrl(settings.appStoreQrImage || APPLE_QR)} alt="App Store QR Code" className="w-full h-full object-cover rounded-xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Therapist with Synergy MYT App */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end mt-6 lg:mt-0">
              <img
                src={getImageUrl(settings.appMockupImage || APP_MOCKUP)}
                alt="Therapist holding Synergy MYT App"
                className="max-w-sm sm:max-w-md w-full object-contain drop-shadow-2xl transform hover:scale-102 transition-transform duration-500"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
