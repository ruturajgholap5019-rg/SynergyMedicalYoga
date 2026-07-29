import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-[#005550] text-white text-xs py-2.5 px-4 hidden md:block">
      <div className="max-w-7xl mx-auto flex items-center justify-end gap-8 font-medium">
        <a
          href="mailto:support@synergymedicalyoga.com"
          className="flex items-center gap-2 hover:text-teal-200 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>support@synergymedicalyoga.com</span>
        </a>
        <a
          href="tel:+919730321042"
          className="flex items-center gap-2 hover:text-teal-200 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>+91 97303 21042</span>
        </a>
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-3.5 h-3.5" />
          <span>Greens Center, Chinchwad, Pune 411033</span>
        </div>
      </div>
    </div>
  );
}
