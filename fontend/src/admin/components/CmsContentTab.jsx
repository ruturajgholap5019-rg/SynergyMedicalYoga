import React, { useState, useEffect } from 'react';
import { Save, BarChart2, FileText, Smartphone, PhoneCall, Globe, Check, Loader2, Sparkles, RefreshCw } from 'lucide-react';

export default function CmsContentTab({ settings, onSaveSettings, saving }) {
  const [activeSection, setActiveSection] = useState('stats');
  const [formData, setFormData] = useState({
    // Statistical Counters
    statsCities: 15,
    statsCenters: 200,
    statsTherapists: 400,
    statsClinics: 35,

    // Hero & Taglines
    heroHeading: 'Guided Training Videos for Therapeutic Exercises at Home',
    heroSubheading: 'Doctor Supervised Non-Surgical Rehabilitation & Rope and Belt Therapy',

    // About Us Content
    aboutCompanyText: '',
    synergyInitText: '',
    missionText: '',
    visionText: '',
    objectiveText: '',

    // App Promo Content
    appPromoHeading: 'Download Our App\nto Book an Appoiment',
    playStoreUrl: '',
    appStoreUrl: '',
    playStoreQrImage: '',
    appStoreQrImage: '',
    appMockupImage: '',

    // Contact & Socials
    contactPhone: '+91 98230 45678',
    contactEmail: 'contact@synergymedicalyoga.com',
    contactAddress: 'Pune, Maharashtra, India',
    socialLinkedIn: '',
    socialInstagram: '',
    socialFacebook: '',
    socialYouTube: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        statsCities: settings.statsCities ?? 15,
        statsCenters: settings.statsCenters ?? 200,
        statsTherapists: settings.statsTherapists ?? 400,
        statsClinics: settings.statsClinics ?? 35,

        heroHeading: settings.heroHeading || 'Guided Training Videos for Therapeutic Exercises at Home',
        heroSubheading: settings.heroSubheading || 'Doctor Supervised Non-Surgical Rehabilitation & Rope and Belt Therapy',

        aboutCompanyText: settings.aboutCompanyText || 'iMediYog Healthcare LLP is a Pune-based healthcare company with a vision to become a comprehensive Therapy Care Hub, making quality therapy education and services accessible through an integrated ecosystem of certified professionals, technology, and innovative healthcare solutions across multiple therapy disciplines.',
        synergyInitText: settings.synergyInitText || 'Synergy Medical Yoga is one of iMediYog Healthcare LLP’s flagship initiatives dedicated to democratizing Rope & Belt Therapy for the prevention and conservative management of knee, back, and neck pain. Through certified education programs, clinically designed therapy products, and a technology platform connecting people with certified Rope & Belt Therapy practitioners, Synergy Medical Yoga is making this specialized therapy more accessible across India.',
        missionText: settings.missionText || 'To establish Medical Yoga Therapy as the preferred first-line treatment for individuals managing knee, back, and neck pain.',
        visionText: settings.visionText || 'To minimize the need for surgeries by effectively managing degenerative musculoskeletal diseases and injuries of the knee, back, neck, and shoulder.',
        objectiveText: settings.objectiveText || 'To empower every household in India with at least one person trained in Medical Yoga Therapy.',

        appPromoHeading: settings.appPromoHeading || 'Download Our App\nto Book an Appoiment',
        playStoreUrl: settings.playStoreUrl || 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
        appStoreUrl: settings.appStoreUrl || 'https://play.google.com/store/search?q=synergy%20medical&c=apps',
        playStoreQrImage: settings.playStoreQrImage || 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-06-03-at-8.34.11-PM.jpeg',
        appStoreQrImage: settings.appStoreQrImage || 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-07-07-at-1.34.20-PM-1024x1024.jpeg',
        appMockupImage: settings.appMockupImage || 'https://synergymedicalyoga.com/wp-content/uploads/2025/09/Download-Our-App-1-scaled-1.png',

        contactPhone: settings.contactPhone || '+91 98230 45678',
        contactEmail: settings.contactEmail || 'contact@synergymedicalyoga.com',
        contactAddress: settings.contactAddress || 'Pune, Maharashtra, India',
        socialLinkedIn: settings.socialLinkedIn || 'https://www.linkedin.com/company/synergy-medical-yoga',
        socialInstagram: settings.socialInstagram || 'https://www.instagram.com',
        socialFacebook: settings.socialFacebook || 'https://www.facebook.com',
        socialYouTube: settings.socialYouTube || 'https://www.youtube.com',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  const navItems = [
    { id: 'stats', label: 'Live Stats Counters', icon: BarChart2, desc: 'Manage displayed numbers for Cities, Centers, and Therapists' },
    { id: 'about', label: 'About Us & Values', icon: FileText, desc: 'Edit Company bio, Mission, Vision, and Objective text' },
    { id: 'promo', label: 'App Promotion Banner', icon: Smartphone, desc: 'Update mobile app links, QR codes, and promotional titles' },
    { id: 'contact', label: 'Contact & Socials', icon: PhoneCall, desc: 'Configure phone, email, office address, and social profiles' },
    { id: 'hero', label: 'Hero Section Titles', icon: Globe, desc: 'Customize main homepage headings and subtitle text' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#005550] to-[#007770] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Enterprise Content Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Website CMS &amp; Live Editor</h2>
          <p className="text-teal-100 text-sm sm:text-base mt-1 max-w-2xl">
            Directly update statistics, brand narratives, promotional links, and contact information across the live Synergy platform in real-time.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3.5 bg-white text-[#005550] font-extrabold rounded-2xl hover:bg-teal-50 hover:shadow-lg transition-all flex items-center gap-2.5 shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#005550]" />}
          <span>{saving ? 'Saving Changes...' : 'Publish Live Updates'}</span>
        </button>
      </div>

      {/* Main CMS Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Mini Nav */}
        <div className="lg:col-span-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-4 border cursor-pointer ${
                  isActive
                    ? 'bg-white border-[#005550] shadow-md ring-2 ring-[#005550]/15'
                    : 'bg-white/70 hover:bg-white border-gray-200 shadow-xs hover:border-gray-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-[#005550] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm sm:text-base font-extrabold ${isActive ? 'text-[#005550]' : 'text-gray-900'}`}>
                    {item.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. DYNAMIC STATISTICS & COUNTERS */}
            {activeSection === 'stats' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-[#005550]" />
                    <span>Live Statistics Counters</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    These numbers appear dynamically on the HomePage, About Page, and promotional counters. Keep them aligned with current operational milestones.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Cities Presence</label>
                    <input
                      type="number"
                      name="statsCities"
                      value={formData.statsCities}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none font-extrabold text-lg text-[#005550]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Displayed as: "{formData.statsCities} CITIES"</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Therapy Centers</label>
                    <input
                      type="number"
                      name="statsCenters"
                      value={formData.statsCenters}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none font-extrabold text-lg text-[#005550]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Displayed as: "{formData.statsCenters}+ CENTERS"</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Certified Therapists</label>
                    <input
                      type="number"
                      name="statsTherapists"
                      value={formData.statsTherapists}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none font-extrabold text-lg text-[#005550]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Displayed as: "{formData.statsTherapists}+ THERAPISTS"</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Partner Clinics &amp; Hubs</label>
                    <input
                      type="number"
                      name="statsClinics"
                      value={formData.statsClinics}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none font-extrabold text-lg text-[#005550]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Displayed as: "{formData.statsClinics}+ CLINICS"</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ABOUT US CONTENT */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#005550]" />
                    <span>About Us &amp; Core Philosophy</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure the primary narrative descriptions and core strategic principles shown on the About Us page.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">About iMediYog Healthcare LLP (Paragraph 1)</label>
                  <textarea
                    name="aboutCompanyText"
                    rows={4}
                    value={formData.aboutCompanyText}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Synergy Medical Yoga Flagship Initiative (Paragraph 2)</label>
                  <textarea
                    name="synergyInitText"
                    rows={4}
                    value={formData.synergyInitText}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 pt-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mission Statement</label>
                    <textarea
                      name="missionText"
                      rows={2}
                      value={formData.missionText}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Vision Statement</label>
                    <textarea
                      name="visionText"
                      rows={2}
                      value={formData.visionText}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Objective</label>
                    <textarea
                      name="objectiveText"
                      rows={2}
                      value={formData.objectiveText}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. APP PROMOTION BANNER */}
            {activeSection === 'promo' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-[#005550]" />
                    <span>App Promotion Banner &amp; QR Settings</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage the download titles, app store links, and QR code graphics shown across the HomePage, About, and Services banners.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Promotion Banner Heading</label>
                  <textarea
                    name="appPromoHeading"
                    rows={2}
                    value={formData.appPromoHeading}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-base font-extrabold text-[#005550]"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Tip: Use Enter to add linebreaks for cleaner display.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Google Play Store URL</label>
                    <input
                      type="url"
                      name="playStoreUrl"
                      value={formData.playStoreUrl}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Apple App Store URL</label>
                    <input
                      type="url"
                      name="appStoreUrl"
                      value={formData.appStoreUrl}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Play Store QR Image URL</label>
                    <input
                      type="text"
                      name="playStoreQrImage"
                      value={formData.playStoreQrImage}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">App Store QR Image URL</label>
                    <input
                      type="text"
                      name="appStoreQrImage"
                      value={formData.appStoreQrImage}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Presentation Mockup Image URL</label>
                  <input
                    type="text"
                    name="appMockupImage"
                    value={formData.appMockupImage}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {/* 4. CONTACT INFORMATION & SOCIALS */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <PhoneCall className="w-6 h-6 text-[#005550]" />
                    <span>Contact Details &amp; Social Profiles</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage support phone numbers, contact emails, physical clinic addresses, and public social networks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact Support Phone</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Official Email Address</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Headquarter / Hub Physical Address</label>
                  <input
                    type="text"
                    name="contactAddress"
                    value={formData.contactAddress}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Social Media Profile Links</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">LinkedIn Profile</label>
                      <input
                        type="url"
                        name="socialLinkedIn"
                        value={formData.socialLinkedIn}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Instagram Profile</label>
                      <input
                        type="url"
                        name="socialInstagram"
                        value={formData.socialInstagram}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">Facebook Profile</label>
                      <input
                        type="url"
                        name="socialFacebook"
                        value={formData.socialFacebook}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">YouTube Channel</label>
                      <input
                        type="url"
                        name="socialYouTube"
                        value={formData.socialYouTube}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. HERO SECTION TITLES */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-[#005550]" />
                    <span>Hero Section &amp; Main Taglines</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Adjust main header slogans and greeting titles displayed on the landing experience.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Primary Hero Heading</label>
                  <textarea
                    name="heroHeading"
                    rows={2}
                    value={formData.heroHeading}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-base font-extrabold text-[#005550]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Primary Hero Subtitle</label>
                  <textarea
                    name="heroSubheading"
                    rows={2}
                    value={formData.heroSubheading}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#005550] focus:border-[#005550] outline-none text-sm font-normal text-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Save Button Bar */}
            <div className="pt-6 border-t border-gray-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-[#005550] hover:bg-[#00403c] text-white font-extrabold rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{saving ? 'Publishing Updates...' : 'Save Live Changes'}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
