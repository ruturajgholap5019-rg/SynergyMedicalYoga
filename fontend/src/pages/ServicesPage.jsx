import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2, QrCode } from 'lucide-react';

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
      'Correction of rotational imbalance in knee joint',
      'Correction of weight bearing axis for smooth locomotion',
      'Restoration of longitudinal arch of the foot',
      'Targeted muscle strengthening and stretching protocols',
    ],
  },
  {
    id: 'lumbar',
    title: 'Lumbar (Back) Pain',
    subtitle: 'Spine decompression & lordosis correction',
    image: LUMBAR_DIAGRAM,
    points: [
      'Restoring natural lumbar lordosis curve',
      'Reduce pressure on spinal nerve roots',
      'Strengthening of deep para-spinal core muscles',
      'Restoring full pelvic mobility and range of motion',
    ],
  },
  {
    id: 'cervical',
    title: 'Cervical Spine (Neck) Pain',
    subtitle: 'Posture alignment & shoulder girdle mobility',
    image: NECK_DIAGRAM,
    points: [
      'Increase scapular mobility and alignment',
      'Rib-cage awareness for better diaphragmatic breathing',
      'Shoulder girdle awareness and strain relief',
      'Strengthening of cervical neck stabilizing muscles',
    ],
  },
];

export default function ServicesPage({ setActivePage }) {
  const [openTab, setOpenTab] = useState('knee');

  return (
    <div className="font-inter text-[#555555]">

      {/* ──────────────────────────────────────────────
          1. HERO SUB-BANNER HEADER (1:1 with Original)
          ────────────────────────────────────────────── */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Our Services
          </h1>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          2. DOWNLOAD OUR APP SECTION (1:1 with Original)
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#eaf6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* App Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <img
                src={APP_MOCKUP}
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
                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={PLAYSTORE} alt="Google Play" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl shadow-sm border border-teal-100">
                  <QrCode className="w-10 h-10 text-[#005550]" />
                  <div>
                    <img src={APPSTORE} alt="App Store" className="h-8 object-contain" />
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">Scan or tap to download</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────
          3. HOW DOES MEDICAL YOGA WORK (ACCORDION)
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="font-sansita text-3xl sm:text-4xl lg:text-5xl font-bold text-[#005550] leading-tight">
              How does medical yoga work on pain knee / back / neck pain relief
            </h2>
            <div className="w-20 h-1 bg-[#005550] mx-auto rounded" />
          </div>

          <div className="max-w-4xl mx-auto space-y-5">
            {THERAPY_ACCORDION.map((tab) => {
              const isOpen = openTab === tab.id;
              return (
                <div
                  key={tab.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Header Button */}
                  <button
                    onClick={() => setOpenTab(isOpen ? null : tab.id)}
                    className={`w-full flex items-center justify-between px-8 py-6 text-left font-poppins font-bold text-lg sm:text-xl transition-colors ${
                      isOpen
                        ? 'bg-[#005550] text-white'
                        : 'bg-[#f4f7f8] text-[#2C2D33] hover:bg-teal-50/50'
                    }`}
                  >
                    <div>
                      <span>{tab.title}</span>
                      <p className={`text-xs font-normal mt-0.5 ${isOpen ? 'text-teal-100' : 'text-gray-500'}`}>
                        {tab.subtitle}
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="w-6 h-6 text-white shrink-0" /> : <ChevronDown className="w-6 h-6 text-gray-500 shrink-0" />}
                  </button>

                  {/* Body Content */}
                  {isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
                      <div className="p-8 space-y-5 flex flex-col justify-center">
                        <h4 className="font-poppins font-bold text-[#005550] text-base border-b border-gray-100 pb-2">
                          Therapeutic Correction Focus:
                        </h4>
                        <ul className="space-y-3.5">
                          {tab.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#005550] shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700 leading-relaxed font-medium">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#f4f7f8] h-72 md:h-full p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100">
                        <img
                          src={tab.image}
                          alt={tab.title}
                          className="max-h-full max-w-full object-contain rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────
          4. STORE LOCATOR & CENTERS MAP SECTION
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
                className="bg-[#005550] hover:bg-[#003d39] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm shrink-0"
              >
                Find All Centers
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
