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
} from 'lucide-react';
import { getImageUrl } from '../lib/api';

const CEO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';

// All 14 testimonials (same as before)
const COURSE_TESTIMONIALS = [
  // ... (keep your full array, unchanged)
];

export default function CoursePage({ setActivePage }) {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', profession: '', message: '' });
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
      <section className="relative bg-gradient-to-br from-[#003d39] via-[#005550] to-[#002f2c] text-white py-16 sm:py-24 overflow-hidden">
        {/* ... keep the same as before */}
      </section>

      {/* ── WHY LEARN RBT (4 PILLARS) – REDUCED HEIGHT ── */}
      <section className="py-12 bg-gradient-to-b from-[#f4faf9] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Transformative Healthcare Skills
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Why Learn Rope &amp; Belt Therapy?
            </h2>
            <p className="text-sm text-gray-600">
              Equip yourself with clinically proven non-invasive techniques designed by doctors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 4 pillars – same content, just reduced padding/margin */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-base">Help Yourself, Family &amp; Society</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Learn RBT to help society reduce their dependence on surgery for treating knee pain, back pain, neck pain and shoulder pain. This therapy is designed by doctors. It is a unique blend of modern anatomy concepts and yogic wisdom. Easy to learn, easy to set up even at home.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-base">Applied Yoga</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Learn application of yoga to treat musculoskeletal diseases (Knee Pain, Back Pain, Neck Pain, Shoulder Pain). There are 5 Lakh surgeries happening in India every year for knee and back. Help people avoid surgeries using rope &amp; belt therapy adoption.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-base">Special Skill</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Rope &amp; Belt therapy gets into details of anatomy of joints as well as pathology of pain condition so that you understand why a particular pain starts. This also helps you in your regular fitness yoga batches to handle patients with special conditions.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-lg transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#005550] group-hover:bg-[#005550] group-hover:text-white transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-poppins font-bold text-[#005550] text-base">Earn More</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Earning potential of medical yoga techniques like Rope &amp; Belt therapy is very high compared to regular yoga classes. It helps you build a sustainable career in the field of yoga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSE HIGHLIGHTS – 4 images + banner ── */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Visual Highlights
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Course Highlights
            </h2>
          </div>
          {/* 4‑image grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <img src="/images/others/ashwini-image.jpeg" alt="Highlight 1" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/3.jpg" alt="Highlight 2" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/6.jpg" alt="Highlight 3" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
            <img src="/images/others/14.jpg" alt="Highlight 4" className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200" />
          </div>
          {/* Banner image – larger height */}
          <div className="flex justify-center">
            <img
              src="/images/others/Why-Lear-RBT-with-Synergy-Banner-4-items-1-1-scaled.webp"
              alt="Why Learn RBT with Synergy"
              className="w-full max-w-6xl h-auto max-h-96 object-contain rounded-3xl shadow-md border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* ── COURSE DETAILS – unchanged ── */}
      <section className="py-16 bg-[#eaf6f6]">
        {/* ... keep as before */}
      </section>

      {/* ── CURRICULUM – always expanded ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              45-Hour Structured Syllabus
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Course Curriculum</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Progressive 4-weekend module – all weekends are always open for your reference.
            </p>
          </div>

          <div className="space-y-6">
            {/* Weekend 1 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W1</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 1 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>History of RBT &amp; General RBT Principles</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of knee joint</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of knee pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>OA Knee, Varus Deformity, ACL / PCL Tear, Meniscus Injury</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 2 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W2</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 2 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision - Knee joint</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Anatomy of lumbar spine</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of back pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Slip disc, Sciatica, Lumbar Spondylosis, Listhesis, Back Spasm</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 3 */}
            <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="bg-[#005550] text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W3</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 3 – Online (Sat &amp; Sun)</span>
                  <p className="text-xs text-teal-100">Sat: 3 Hours | Sun: 3 Hours</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Revision- Anatomy of cervical spine</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Understanding of neck pain conditions</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Cervical spondylosis, Forward head posture, Neck Spasm</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#005550] shrink-0 mt-0.5" /><span><strong>Theory behind tying protocols</strong></span></li>
                </ul>
              </div>
            </div>
            {/* Weekend 4 – Offline */}
            <div className="border border-emerald-500/40 rounded-3xl overflow-hidden shadow-md bg-emerald-50/30">
              <div className="bg-emerald-800 text-white p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-900 flex items-center justify-center text-xs font-extrabold">W4</div>
                <div>
                  <span className="font-poppins font-bold text-lg">Weekend 4 – Offline (Fri, Sat, Sun)</span>
                  <p className="text-xs text-amber-200">Fri: Full Day (9 Hours) Sat: Full Day (9 Hours) Sun: Full Day (9 Hours)</p>
                </div>
              </div>
              <div className="p-6 bg-white space-y-3 border-t border-gray-100 text-sm text-gray-700">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Knee tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Lumbar tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Cervical tying protocols of rope &amp; belt therapy</strong></span></li>
                  <li className="flex items-start gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span><strong>Case history taking and hands- on tying practice</strong></span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── EXAM & CERTIFICATION – larger certificate image ── */}
          <div className="bg-[#f0f9f8] rounded-3xl p-8 border border-teal-100 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-[#005550] uppercase tracking-wider">ASSESSMENT &amp; CERTIFICATION</span>
              <h3 className="font-sansita text-2xl font-bold text-[#005550]">Exam &amp; Certification Protocol</h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                <strong>Theory Exam :</strong> Online during the course<br />
                <strong>Practical :</strong> After 1 month from completion<br />
                <em>Certificate will be issued only after qualifying in the practical exam. Being certified is a pre-requisite for registration on the Synergy app.</em>
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="bg-white p-4 rounded-2xl border border-teal-100 text-center shadow-sm w-full">
                <Award className="w-12 h-12 text-[#005550] mx-auto mb-2" />
                <span className="text-xs font-bold text-gray-800 block">Official RBT Certificate</span>
                <span className="text-[10px] text-gray-500 block">Synergy Medical Yoga</span>
              </div>
              {/* Larger certificate image */}
              <img
                src="/images/others/synergy-certificate-image.jpeg"
                alt="Synergy Certificate Sample"
                className="w-64 h-auto rounded-xl border border-teal-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FACULTY – unchanged ── */}
      <section className="py-16 bg-[#f4f7f8]">
        {/* ... keep as before */}
      </section>

      {/* ── TESTIMONIALS – reduced height, horizontally scrollable ── */}
      <section className="py-12 bg-[#005550] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">STUDENT FEEDBACK &amp; REVIEWS</span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-white">What Our RBT Alumni Say</h2>
          </div>
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-teal-200 scrollbar-track-transparent">
            <div className="flex gap-4 w-max">
              {COURSE_TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-white text-gray-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between min-w-[240px] max-w-[280px] space-y-3">
                  <div className="space-y-2">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed italic">"{t.comment}"</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-poppins font-bold text-sm text-[#005550]">{t.name}</h4>
                    {t.role && <p className="text-[10px] text-gray-500 mt-0.5">{t.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA – unchanged ── */}
      <section className="py-12 bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0]">
        {/* ... keep as before */}
      </section>

      {/* ── ENROLLMENT MODAL – unchanged ── */}
      {isEnrollModalOpen  (
        // ... keep as before
      )}
    </div>
  );
}