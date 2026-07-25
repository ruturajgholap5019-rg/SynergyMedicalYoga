import React from 'react';
import { Target, Award, Heart } from 'lucide-react';

const CEO   = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/MD.jpeg';
const CMO   = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Poonam-Deshmukh-with-apron.jpeg';
const CSCO  = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/WhatsApp-Image-2025-07-21-at-11.36.32-AM.jpeg';
const CTO   = 'https://synergymedicalyoga.com/wp-content/uploads/2026/07/Deepali.jpeg';

const TEAM = [
  { name: 'Manoj Deshmukh',   role: 'Digital Commerce Expert',       title: 'Chief Executive Officer',    img: CEO  },
  { name: 'Poonam Deshmukh',  role: 'B.Th.O. & OTR (US NBCOT)',     title: 'Chief Medical Officer',      img: CMO  },
  { name: 'Shubham Pawar',    role: 'Fitness Coach & Nutritionist',  title: 'Chief Supply Chain Officer', img: CSCO },
  { name: 'Deepali Kulkarni', role: 'Holistic Wellness Coach',      title: 'Chief Technology Officer',   img: CTO  },
];

const PILLARS = [
  { icon: '🦴', heading: 'Bio-mechanical corrections', desc: 'to help slowing down the degeneration' },
  { icon: '💊', heading: 'Physiological support',      desc: 'to enable faster healing for chronic pains' },
  { icon: '🥗', heading: 'Nutrition plan',             desc: 'for ensuring overall recovery and sustained result' },
];

export default function AboutPage() {
  return (
    <div className="bg-white font-inter text-[#555555]">

      {/* Hero Banner Header */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            About Medical Yoga Therapy
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            iMediYog Healthcare LLP is a Pune-based healthcare company with a vision to become a comprehensive Therapy Care Hub.
          </p>
        </div>
      </section>


      {/* Leadership Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f4f9f9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#005550]">OUR LEADERSHIP</p>
            <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Leadership Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-[#005550]/20 shadow-md group-hover:scale-105 transition-transform duration-300 mb-5">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://synergymedicalyoga.com/wp-content/uploads/2025/05/doctor_1.png';
                    }}
                  />
                </div>
                <h3 className="font-poppins font-bold text-[#2C2D33] text-lg mb-1">{member.name}</h3>
                <p className="text-[#005550] text-sm font-semibold mb-1">{member.title}</p>
                <p className="text-gray-500 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose: Mission / Vision / Objective */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-2">
          <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">Our Purpose</h2>
          <div className="w-16 h-0.5 bg-[#005550] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-10 h-10 text-[#005550]" />,
              title: 'Mission',
              desc: 'To establish Medical Yoga Therapy as the preferred first-line treatment for individuals managing knee, back, and neck pain',
            },
            {
              icon: <Award className="w-10 h-10 text-[#005550]" />,
              title: 'Vision',
              desc: 'To minimize the need for surgeries by effectively managing degenerative musculoskeletal diseases and injuries of the knee, back, neck, and shoulder',
            },
            {
              icon: <Heart className="w-10 h-10 text-[#005550]" />,
              title: 'Objective',
              desc: 'To empower every household in India with at least one person trained in Medical Yoga Therapy',
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#f4f7f8] rounded-2xl p-8 text-center space-y-4 border border-teal-50 hover:shadow-md transition-shadow">
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="font-poppins font-bold text-[#2C2D33] text-xl">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrated Approach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-2">
          <h2 className="font-sansita text-3xl sm:text-4xl font-bold text-[#005550]">
            Medical Yoga Therapy Integrated Approach To Joint Care
          </h2>
          <div className="w-16 h-0.5 bg-[#005550] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p, i) => (
            <div key={i} className="bg-[#f4f7f8] rounded-2xl p-8 text-center space-y-4 border border-teal-50">
              <div className="w-16 h-16 bg-[#005550]/10 rounded-full flex items-center justify-center mx-auto text-3xl">
                {p.icon}
              </div>
              <div>
                <h3 className="font-poppins font-bold text-[#2C2D33] text-lg mb-2">
                  {i + 1}) {p.heading}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
