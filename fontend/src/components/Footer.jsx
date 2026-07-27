import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';

const LOGO = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/Synergy-Logo_png-02-scaled.png';

const FbIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const LiIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer({ setActivePage }) {
  const { settings } = useSiteSettings();
  const goTo = (id) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="font-inter bg-[#f4f7f8] text-gray-700 border-t border-gray-200/80">

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-5 space-y-5">
            <img
              src={LOGO}
              alt="Synergy Medical Yoga"
              className="h-12 w-auto object-contain cursor-pointer"
              onClick={() => goTo('home')}
            />
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              {settings.synergyInitText || 'Synergy Medical Yoga is iMediYog Healthcare LLP initiative. It is working with vision democratising rope & belt therapy which is used in conservative management of knee pain, neck pain and back pain. It offers educational courses in Rope & Belt Therapy, products for pain prevention and recovery as well as run a mobile app for people to find the nearest therapist around their locale.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings.socialFacebook || "https://facebook.com/synergymedicalyoga"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#005550] hover:bg-[#003d39] rounded-full flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <FbIcon />
              </a>
              <a
                href={settings.socialLinkedIn || "https://linkedin.com/company/synergy-medical-yoga"}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 bg-[#005550] hover:bg-[#003d39] rounded-full flex items-center justify-center transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <LiIcon />
              </a>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-poppins font-bold text-[#2C2D33] text-base">Company</h5>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About us', id: 'about' },
                { label: 'Shop', id: 'shop' },
                { label: 'Our Team', id: 'about' },
                { label: 'Contact Us', id: 'contact' },
              ].map((link, i) => (
                <li key={i}>
                  <button
                    onClick={() => goTo(link.id)}
                    className="text-gray-600 hover:text-[#005550] transition-colors font-medium text-left cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-poppins font-bold text-[#2C2D33] text-base">Support</h5>
            <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
              {['Privacy Policy', 'FAQ', 'Return & Refund Policy', 'Terms & Conditions', 'Shipping & Delivery Policy'].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-[#005550] transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Get in touch */}
          <div className="lg:col-span-3 space-y-4">
            <h5 className="font-poppins font-bold text-[#2C2D33] text-base">Get in touch</h5>
            <div className="space-y-3 text-sm text-gray-600">
              <a
                href={`mailto:${settings.contactEmail || 'support@synergymedicalyoga.com'}`}
                className="flex items-center gap-3 hover:text-[#005550] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#005550] shrink-0" />
                <span>{settings.contactEmail || 'support@synergymedicalyoga.com'}</span>
              </a>
              <a
                href={`tel:${settings.contactPhone || '+91 97303 21042'}`}
                className="flex items-center gap-3 hover:text-[#005550] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#005550] shrink-0" />
                <span>{settings.contactPhone || '+91 97303 21042'}</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#005550] shrink-0" />
                <span>{settings.contactAddress || 'Pune 411033'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#003D39] text-white/70 text-xs text-center py-4 px-4 font-medium">
        <p>Copyright © 2025 Synergy Medi-Yoga Technologies LLP, All rights reserved.</p>
      </div>

    </footer>
  );
}
