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
  Send,
  X,
  ArrowRight,
  Users,
  Layers,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { getImageUrl } from '../lib/api';

const CEO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';

// All 14 testimonials from pages 6 & 7 of the PDF – exact text
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
      <section className="relative bg-gradient-to-br from-[#003d39] via-[#005550] to-[#002f2c] text-white py-16 sm:py-24 overflow-hidden">
        {/* ... (keep as is) */}
      </section>

      {/* ── WHY LEARN RBT (4 PILLARS) ── (unchanged) */}
      <section className="py-20 bg-gradient-to-b from-[#f4faf9] to-white">
        {/* ... */}
      </section>

      {/* ── COURSE HIGHLIGHTS – 4‑image grid ── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#005550] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Visual Highlights
            </span>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
              Course Highlights
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <img
              src="/images/others/ashwini-image.jpeg"
              alt="Course highlight 1"
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200"
            />
            <img
              src="/images/others/3.jpg"
              alt="Course highlight 2"
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200"
            />
            <img
              src="/images/others/6.jpg"
              alt="Course highlight 3"
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200"
            />
            <img
              src="/images/others/14.jpg"
              alt="Course highlight 4"
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-2xl shadow-md border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* ── COURSE DETAILS ── (unchanged) */}
      <section className="py-16 bg-[#eaf6f6]">
        {/* ... */}
      </section>

      {/* ── CURRICULUM ── (unchanged) */}
      <section className="py-24 bg-white">
        {/* ... */}
      </section>

      {/* ── FACULTY ── (unchanged) */}
      <section className="py-20 bg-[#f4f7f8]">
        {/* ... */}
      </section>

      {/* ── TESTIMONIALS ── (unchanged) */}
      <section className="py-20 bg-[#005550] text-white">
        {/* ... */}
      </section>

      {/* ── BOTTOM CTA ── (unchanged) */}
      <section className="py-16 bg-gradient-to-br from-[#ebf7f7] to-[#d6f0f0]">
        {/* ... */}
      </section>

      {/* ── ENROLLMENT MODAL ── (unchanged) */}
      {isEnrollModalOpen && (
        // ...
      )}
    </div>
  );
}