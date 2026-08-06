import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';
import { api } from '../lib/api';
import ScrollReveal from '../components/ScrollReveal';

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry / Consultation',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    let cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(2);
    }
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      setIsSubmitting(false);
      return;
    }

    try {
      await api.submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry / Consultation', message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit your enquiry right now. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-inter text-[#555555] space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-[#005550] py-20 px-4 text-center text-white animate-fade-in-up">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Contact Synergy Medical Yoga
          </h1>
          <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions about Rope &amp; Belt Therapy, product orders, or reseller partnerships? Reach out to our Pune team.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in-left">
            <div className="bg-[#005550] text-white p-8 rounded-3xl shadow-xl space-y-6 hover-lift">
              <div>
                <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">
                  HEADQUARTERS &amp; MAIN CLINIC
                </span>
                <h3 className="font-poppins text-2xl font-bold mt-1 text-white">iMediYog Healthcare LLP</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-teal-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Main Office Address</h5>
                    <p className="text-teal-100 leading-relaxed">
                      {settings.contactAddress || 'Greens Center, Old Mumbai-Pune Hwy, Chinchwad, Pune, Maharashtra 411033'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-teal-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Helpline Phone</h5>
                    <a href={`tel:${settings.contactPhone || '+919730321042'}`} className="text-teal-200 hover:text-white font-bold text-sm block">
                      {settings.contactPhone || '+91 97303 21042'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-teal-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Email Support</h5>
                    <a href={`mailto:${settings.contactEmail || 'support@synergymedicalyoga.com'}`} className="text-teal-200 hover:text-white font-bold">
                      {settings.contactEmail || 'support@synergymedicalyoga.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-teal-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">Clinic Operating Hours</h5>
                    <p className="text-teal-100">Monday - Saturday: 8:00 AM - 7:30 PM</p>
                    <p className="text-teal-200 font-semibold">Sunday: Closed for maintenance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-md">
            <ScrollReveal animation="slide-right">
              <h3 className="font-poppins text-2xl font-bold text-gray-900 mb-2">Send Us a Direct Enquiry</h3>
              <p className="text-xs text-gray-500 mb-6">
                Fill in your contact details below and our team will get back to you within 24 hours.
              </p> {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-gray-900 text-lg">Thank You for Reaching Out!</h4>
                <p className="text-xs text-gray-600">Your message has been received. Our team at Synergy Medical Yoga will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyesh Deshmukh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      maxLength={15}
                      placeholder="97303 21042 (10 digits)"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15) })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Inquiry Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#005550]"
                    >
                      <option>General Inquiry / Consultation</option>
                      <option>Product Order &amp; Size Query</option>
                      <option>RBT Therapist Education Course</option>
                      <option>Reseller &amp; Center Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Message or Symptoms *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your joint discomfort (knee, back, neck) or your inquiry details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#005550]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#005550] hover:bg-[#003d39] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f4f7f8] p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005550] bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                Synergy HQ Clinic Location
              </span>
              <h4 className="font-sansita font-bold text-gray-900 text-lg sm:text-xl flex items-center gap-2 mt-1">
                <MapPin className="w-5 h-5 text-[#005550]" /> Greens Centre, Chinchwad, Pune
              </h4>
            </div>
            <a
              href="https://maps.app.goo.gl/wY28V5b61a3K9rNFA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#005550] hover:bg-[#003d39] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
            >
              <Navigation className="w-4 h-4 text-teal-200" />
              <span>Get Directions</span>
            </a>
          </div>

          <div className="w-full h-[400px] sm:h-[450px] bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner border border-gray-200">
            <iframe
              title="Synergy Medical Yoga Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.892699042978!2d73.7692424!3d18.6196134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b94af6338889%3A0xf98907edfb0d2a26!2sSynergy%20Medical%20Yoga!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

    </div>
  );
}
