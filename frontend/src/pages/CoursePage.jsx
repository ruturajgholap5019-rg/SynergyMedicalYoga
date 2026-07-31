import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  Sparkles,
  Star,
  Send,
  X,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getImageUrl } from '../lib/api';

const CEO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';

// All 14 testimonials – exact text from PDF
const COURSE_TESTIMONIALS = [
  // ... (keep your existing array, unchanged)
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
      {/* ── HERO ── (unchanged) */}
      {/* ... (keep your existing Hero, Why Learn RBT, Course Highlights, Course Details, etc.) */}

      {/* ── CURRICULUM – collapsible (only one open) ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              45-Hour Structured Syllabus
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Curriculum</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Click on each weekend to expand and see the detailed syllabus.
            </p>
          </div>

          <div className="space-y-6">
            {/* Weekend 1 – unchanged */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 1 ? null : 1)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 1 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
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
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>History of RBT &amp; General RBT Principles</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of knee joint</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of knee pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>OA Knee, Varus Deformity, ACL / PCL Tear, Meniscus Injury</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 2 – unchanged */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 2 ? null : 2)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 2 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
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
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision - Knee joint</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of lumbar spine</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of back pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Slip disc, Sciatica, Lumbar Spondylosis, Listhesis, Back Spasm</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Weekend 3 – unchanged */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 3 ? null : 3)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 3 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
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
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision- Anatomy of cervical spine</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of neck pain conditions</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Cervical spondylosis, Forward head posture, Neck Spasm</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* ── Weekend 4 – FIXED ── */}
            <div className="border border-emerald-500/40 rounded-3xl overflow-hidden shadow-md bg-emerald-50/30 transition-all duration-300">
              <button
                onClick={() => setOpenWeekend(openWeekend === 4 ? null : 4)}
                className={`w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-lg transition-all ${openWeekend === 4 ? 'bg-[#005550] text-white shadow-md' : 'bg-slate-50 text-gray-800 hover:bg-teal-50/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">
                    W4
                  </div>
                  <div>
                    <span>Weekend 4 – Offline (Fri, Sat, Sun)</span>
                    <p className={`text-xs font-normal ${openWeekend === 4 ? 'text-teal-100' : 'text-gray-500'}`}>
                      Fri: Full Day (9 Hours) Sat: Full Day (9 Hours) Sun: Full Day (9 Hours)
                    </p>
                  </div>
                </div>
                {openWeekend === 4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              {openWeekend === 4 && (
                <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Knee tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Lumbar tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Cervical tying protocols of rope &amp; belt therapy</strong></span></li>
                    <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Case history taking and hands- on tying practice</strong></span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── EXAM & CERTIFICATION – (unchanged) ── */}
          {/* ... rest of the component (Faculty, Testimonials, CTA, Modal) */}
        </div>
      </section>

      {/* ── ENROLLMENT MODAL ── (unchanged) */}
      {/* ... */}
    </div>
  );
}