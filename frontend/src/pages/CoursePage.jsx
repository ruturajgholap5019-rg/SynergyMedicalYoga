import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  PhoneCall,
  Mail,
  UserCheck,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Download,
  Send,
  HelpCircle,
  Video,
  MapPin,
  X,
  ArrowRight,
} from 'lucide-react';
import { getImageUrl } from '../lib/api';

const CEO = 'https://synergymedicalyoga.com/wp-content/uploads/2025/07/MD.jpeg';
const CMO = 'https://synergymedicalyoga.com/wp-content/uploads/2025/07/Poonam-Deshmukh-with-apron.jpeg';
const PLAYSTORE = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/PLaystore-Icon-e1747384325874.webp';
const APPSTORE = 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Apple-store-e1747384344465.png';
const APP_MOCKUP = 'https://synergymedicalyoga.com/wp-content/uploads/2025/10/Download-the-app-Synergy-MYT-२-1-scaled.png';

const COURSE_TESTIMONIALS = [
  {
    name: 'Dr. Ashwini Tapshalkar',
    role: 'Homeopath & General Physician, Iyengar Yoga Professional',
    comment:
      'Rope & Belt Therapy is an amazing technique to add to my Iyengar yoga skills. It has helped me better understand various medical conditions and apply my knowledge holistically to those who come to me with pain-related conditions. The course at Synergy is well-structured, comprehensive, and conducted in a very friendly atmosphere.',
    stars: 5,
  },
  {
    name: 'Madhuri Patil',
    role: 'Yoga Professional with 23 years of experience',
    comment:
      'Rope & Belt Therapy has been a valuable addition to my yoga practice. It has given me a deeper understanding of various health conditions and enabled me to approach pain management in a more holistic and effective way. Highly recommended!',
    stars: 5,
  },
  {
    name: 'Shital Koshti',
    role: 'Yoga Teacher & Therapy Professional',
    comment:
      'Rope & Belt Therapy helped me understand the anatomy and physiology of joints in detail. It also gave me better opportunities to get employment and help people get rid of neck and back pain in a scientific manner.',
    stars: 5,
  },
  {
    name: 'Sameedha Kokate',
    role: 'Certified Iyengar Yoga Teacher & Instructor',
    comment:
      'Rope & Belt techniques are wonderful and help you know the reason behind why we do a particular asana and why we recommend not to do. A must-add skill for each yoga professional in today’s world!',
    stars: 5,
  },
  {
    name: 'Rupali Shevkari',
    role: 'Certified RBT Practitioner',
    comment:
      'I recently completed the Rope & Belt training from Synergy Medical Yoga, and it was one of the best decisions I’ve made. The expert teaching team provided clear instructions, a well-structured curriculum, and hands-on practice.',
    stars: 5,
  },
  {
    name: 'Richa',
    role: 'Certified Yoga & Wellness Trainer',
    comment:
      'A heartfelt thanks to Manoj Sir, Sheetal Ma’am, Ashwini Ma’am, and the entire Synergy team for such an impactful RBT course. The perfect blend of science and practical healing has boosted my clinical confidence.',
    stars: 5,
  },
  {
    name: 'Shivam Gautam',
    role: 'YCB Certified Yoga & Wellness Trainer',
    comment:
      'The Rope and Belt Therapy course was transformative, offering comprehensive, well-structured content that built logically from foundational principles to advanced techniques.',
    stars: 5,
  },
  {
    name: 'Devdarj Shettigar',
    role: 'Participant, Shirwal Residential Batch',
    comment:
      'I attended the synergy medical yoga class at Green Hill Naturopathy center in Shirwal. Manoj Sir explained Anatomy subjects in an easy & simple method. Shital Ma’am was very supportive during practical sessions!',
    stars: 5,
  },
];

export default function CoursePage({ setActivePage }) {
  const [openWeekend, setOpenWeekend] = useState(1);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    profession: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsEnrollModalOpen(false);
      setFormData({ name: '', phone: '', email: '', city: '', profession: '', message: '' });
    }, 2500);
  };

  return (
    <div className="bg-white font-inter text-[#444444]">
      {/* ──────────────────────────────────────────────
          1. HERO HEADER BANNER
          ────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#003d39] via-[#005550] to-[#002f2c] text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-teal-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-teal-800/60 border border-teal-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-200 tracking-wide uppercase backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>Hybrid (Online + Offline) Certification</span>
              </div>

              <h1 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
                Education<br />
                <span className="text-teal-200 italic font-normal">Rope &amp; Belt Therapy Training</span>
              </h1>

              <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
                Modern Therapy with Ancient Wisdom. Master doctor-supervised non-surgical postural realignment, joint friction elimination, and specialized musculoskeletal pain recovery techniques.
              </p>

              {/* Badges / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-teal-200">DURATION</p>
                  <p className="text-sm font-bold text-white">45 Hours (1 Month)</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-teal-200">NEXT BATCH</p>
                  <p className="text-sm font-bold text-amber-300">5th Sept 2026</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-teal-200">COURSE FEE</p>
                  <p className="text-sm font-bold text-white">₹19,999/-</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsEnrollModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>Enroll for Sep Batch (₹19,999)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="https://wa.me/919730321042?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Rope%20%26%20Belt%20Therapy%20Course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Right Illustration Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100 max-w-md w-full space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#005550]">OFFICIAL SYNERGY BROCHURE</span>
                  <h3 className="font-sansita text-2xl font-bold text-[#005550]">Medical Yoga Therapy</h3>
                  <div className="w-12 h-0.5 bg-[#005550] mx-auto mt-2" />
                </div>

                <div className="bg-[#f0f9f8] p-4 rounded-2xl border border-teal-100 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Batch Schedule</span>
                    <span className="font-bold text-[#005550]">Weekend Batch</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Instructional Mode</span>
                    <span className="font-bold text-[#005550]">Online + Offline Practical</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-teal-100/80 pb-2">
                    <span className="text-gray-500 font-medium">Language</span>
                    <span className="font-bold text-[#005550]">English + Hindi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Certification</span>
                    <span className="font-bold text-emerald-700">Official RBT Certificate</span>
                  </div>
                </div>

                <div className="text-center space-y-3 pt-2">
                  <p className="text-xs text-gray-500 font-medium">Have questions before joining?</p>
                  <button
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Request Callback / Download Syllabus
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          2. WHY LEARN ROPE & BELT THERAPY (4 PILLARS)
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-[#f4faf9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Transformative Healthcare Skills
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Why Learn Rope &amp; Belt Therapy?
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Equip yourself with clinically proven non-invasive techniques designed by doctors to treat knee, back, neck, and shoulder pain effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg">Help Yourself, Family &amp; Society</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Learn RBT to help society reduce dependence on surgery for treating knee, back, neck, and shoulder pain. Designed by doctors, easy to learn, and easy to set up even at home.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg">Applied Medical Yoga</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Learn application of yoga to treat musculoskeletal diseases. Over 5 Lakh surgeries happen in India every year for knee &amp; back. Help people avoid surgeries through RBT.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg">Specialized Clinical Skill</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Deep-dive into details of joint anatomy and pathology of pain conditions so you understand why a particular pain starts and how to handle patients with special conditions.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-lg">Higher Earning &amp; Career</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Earning potential of RBT techniques is very high compared to regular yoga classes. Become a certified practitioner on the Synergy App to receive direct patient enquiries!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          3. COURSE DETAILS & QUICK INFO BAR
          ────────────────────────────────────────────── */}
      <section className="py-16 bg-[#eaf6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-teal-100 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">BATCH &amp; ENROLLMENT SPECIFICATIONS</span>
              <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Details at a Glance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Sep Batch Start Date</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">5th Sept 2026</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Course Duration</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">1 Month (45 Hours Weekend Batch)</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Conducted By</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">Synergy Medical Yoga</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Instructional Mode</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">Online Theory + Offline Practical</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Medium of Instruction</p>
                <p className="font-poppins font-bold text-lg text-[#005550]">English + Hindi as needed</p>
              </div>
              <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-1">
                <p className="text-xs font-bold uppercase text-gray-500">Pre-qualification</p>
                <p className="font-poppins font-bold text-sm text-[#005550]">Graduate in any stream preferred. Basic Yoga knowledge is an advantage.</p>
              </div>
            </div>

            {/* Fee banner */}
            <div className="bg-gradient-to-r from-[#005550] to-[#003d39] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-200">TOTAL COURSE INVESTEMENT</p>
                <h3 className="font-sansita text-3xl sm:text-4xl font-bold text-amber-300 mt-1">Course Fee ₹19,999/-</h3>
                <p className="text-xs text-teal-100/90 mt-1">Includes Theory &amp; Practical Training, Course Manuals, and Video Access</p>
              </div>
              <button
                onClick={() => setIsEnrollModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap text-sm"
              >
                Register Now for ₹19,999
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          4. 4-WEEKEND CURRICULUM TIMELINE
          ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              45-Hour Structured Syllabus
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Curriculum</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Progressive 4-weekend module transitioning from fundamental joint biomechanics to advanced hands-on clinical rope &amp; belt tying protocols.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Weekend 1 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-xs transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 1 ? null : 1)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${
                  openWeekend === 1 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 1 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W1
                  </div>
                  <div>
                    <span>Weekend 1 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 1 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openWeekend === 1 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>History of RBT &amp; General RBT Principles:</strong> Foundations of Medical Yoga Therapy.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Anatomy of Knee Joint:</strong> Biomechanics, cartilage strain, and joint space assessment.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Knee Pain Conditions:</strong> Osteoarthritis (OA Knee), Varus Deformity, ACL/PCL Tear &amp; Meniscus Injury.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Theory Behind Tying Protocols:</strong> Principles of traction, counter-traction &amp; alignment.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 2 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-xs transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 2 ? null : 2)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${
                  openWeekend === 2 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 2 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W2
                  </div>
                  <div>
                    <span>Weekend 2 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 2 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openWeekend === 2 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Revision:</strong> Knee joint tying protocols &amp; case discussion.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Anatomy of Lumbar Spine:</strong> Vertebral alignment, intervertebral discs, and sciatic nerve pathways.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Back Pain Conditions:</strong> Slip Disc, Sciatica, Lumbar Spondylosis, Listhesis &amp; Back Spasm.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Theory Behind Lumbar Tying:</strong> Decompression techniques and pelvic stabilization.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 3 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-xs transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 3 ? null : 3)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${
                  openWeekend === 3 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${openWeekend === 3 ? 'bg-amber-400 text-gray-900' : 'bg-[#005550] text-white'}`}>
                    W3
                  </div>
                  <div>
                    <span>Weekend 3 – Online (Sat &amp; Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 3 ? 'text-teal-100' : 'text-gray-500'}`}>Sat: 3 Hours | Sun: 3 Hours</p>
                  </div>
                </div>
                {openWeekend === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {openWeekend === 3 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Revision:</strong> Lumbar spine protocol feedback.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Anatomy of Cervical Spine:</strong> Neck vertebrae, suboccipital release &amp; shoulder girdle anatomy.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Neck Pain Conditions:</strong> Cervical Spondylosis, Forward Head Posture ("Tech-Neck") &amp; Neck Spasm.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" />
                      <span><strong>Theory Behind Cervical Tying:</strong> Safe cervical traction and posture realignment.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 4 */}
            <div className="border border-emerald-500/40 rounded-3xl overflow-hidden shadow-md bg-emerald-50/30 transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 4 ? null : 4)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${
                  openWeekend === 4 ? 'bg-[#005550] text-white shadow-md' : 'bg-emerald-900 text-white hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">
                    W4
                  </div>
                  <div>
                    <span>Weekend 4 – Offline Practical (Fri, Sat, Sun)</span>
                    <p className="text-xs font-normal text-amber-200">Fri: 9 Hours | Sat: 9 Hours | Sun: 9 Hours (Full Clinical Days)</p>
                  </div>
                </div>
                {openWeekend === 4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-white/80" />}
              </button>

              {openWeekend === 4 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Knee Tying Protocols:</strong> Hands-on rope &amp; belt wrapping for knee joint decompression.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Lumbar Tying Protocols:</strong> Live practical demonstration &amp; student peer tying exercises.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Cervical Tying Protocols:</strong> Hands-on neck prop application under faculty supervision.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Case History Taking &amp; Patient Evaluation:</strong> Real-life clinical assessment practice.</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Exam & Certificate Card */}
          <div className="bg-[#f0f9f8] rounded-3xl p-8 border border-teal-100 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">ASSESSMENT &amp; CERTIFICATION</span>
              <h3 className="font-sansita text-2xl font-bold text-[#005550]">Exam &amp; Certification Protocol</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                <strong>Theory Exam:</strong> Conducted Online during the course.<br />
                <strong>Practical Exam:</strong> Scheduled 1 month after course completion.<br />
                <em>*Official Certificate will be issued only after qualifying in the practical exam. Certification is a pre-requisite for registration on the Synergy App therapist network.</em>
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-teal-100 text-center shadow-sm shrink-0">
              <Award className="w-12 h-12 text-[#005550] mx-auto mb-2" />
              <span className="text-xs font-bold text-gray-800 block">Official RBT Certificate</span>
              <span className="text-[10px] text-gray-500 block">Synergy Medical Yoga</span>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          5. COURSE FACULTY PROFILES
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f4f7f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">LEARN FROM CLINICAL EXPERTS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Faculty</h2>
            <div className="w-16 h-0.5 bg-[#005550] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Faculty 1: Dr. Poonam Deshmukh */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(CMO)}
                    alt="Dr. Poonam Deshmukh"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md"
                  />
                  <div>
                    <h3 className="font-poppins font-bold text-xl text-[#005550]">Dr. Poonam Deshmukh</h3>
                    <p className="text-xs font-bold text-gray-600">Partner – Synergy Medical Yoga</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">B.Th.O &amp; OTR (USA NBCOT)</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Dr. Poonam Deshmukh is an Occupational Therapist with over 20 years of clinical experience and is a USA-certified Occupational Therapist (OTR), having practiced in the United States for more than five years. She specializes in integrating ancient principles of Medical Yoga with modern musculoskeletal anatomy to develop effective therapeutic approaches. Known for her engaging teaching style, Dr. Poonam simplifies complex clinical concepts through practical demonstrations and real-life case studies.
                </p>
              </div>
            </div>

            {/* Faculty 2: Manoj Deshmukh */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(CEO)}
                    alt="Manoj Deshmukh"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#005550] shadow-md"
                  />
                  <div>
                    <h3 className="font-poppins font-bold text-xl text-[#005550]">Manoj Deshmukh</h3>
                    <p className="text-xs font-bold text-gray-600">Founder &amp; Partner – Synergy Medical Yoga</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">B.E. (BITS Pilani) + EPMBD (IIM Calcutta)</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Manoj Deshmukh brings over 22 years of corporate leadership experience combined with a deep understanding of joint biomechanics and therapeutic application of Rope &amp; Belt Therapy. Driven by the vision of making evidence-based Medical Yoga accessible to everyone, he leads Synergy’s mission to democratize RBT across India through technology-enabled healthcare, structured education, and innovative therapeutic products.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          6. TESTIMONIALS FROM PAST BATCH STUDENTS
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#005550] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">STUDENT FEEDBACK &amp; REVIEWS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-white">What Our RBT Alumni Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSE_TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-white text-gray-800 rounded-3xl p-6 shadow-lg flex flex-col justify-between text-left space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">"{t.comment}"</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="font-poppins font-bold text-sm text-[#005550]">{t.name}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────
          7. BOTTOM ENROLLMENT CTA BAR
          ────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
            Ready to Become a Certified Rope &amp; Belt Therapist?
          </h2>
          <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
            Reserve your seat for the upcoming <strong>5th Sept 2026 Batch</strong>. Limited seats available per cohort to maintain individual practical hands-on attention.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="bg-[#005550] hover:bg-[#003d39] text-white font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Enroll Online Now (₹19,999/-)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+919730321042"
              className="bg-white hover:bg-slate-50 text-[#005550] font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md border border-teal-200 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#005550]" />
              <span>Call +91 97303 21042</span>
            </a>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          8. ENROLLMENT MODAL
          ────────────────────────────────────────────── */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">OFFICIAL REGISTRATION FORM</span>
              <h3 className="font-sansita text-2xl font-bold text-gray-900">Education Enrollment</h3>
              <p className="text-xs text-gray-500">Batch Starting: <strong>5th Sept 2026</strong> | Fee: <strong>₹19,999/-</strong></p>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-[#005550] text-lg">Registration Details Received!</h4>
                <p className="text-xs text-gray-600">
                  Thank you! Our Synergy Course Coordinator will contact you via WhatsApp / Call at <strong>+91 97303 21042</strong> with payment details and course handbook.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98230 45678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune / Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Background</label>
                  <input
                    type="text"
                    placeholder="e.g. Yoga Teacher / Physiotherapist / Doctor"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#005550] hover:bg-[#003d39] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Enrollment Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
