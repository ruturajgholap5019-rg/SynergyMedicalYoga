import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';
import { api } from '../lib/api';

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
      <section className="bg-[#005550] py-16 px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-sansita text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main Grid: Form + Contact Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#005550] text-white p-8 rounded-3xl shadow-xl space-y-6">
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

          {/* Right Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#f4f7f8] p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-sm">
            <h3 className="font-poppins text-2xl font-bold text-[#2C2D33] mb-2">Send Us a Message</h3>
            <p className="text-xs text-gray-500 mb-6">Fill out the form below and our medical team will respond within 24 hours.</p>

            {submitted ? (
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
                      placeholder="+91 97303 21042"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          </div>

        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f4f7f8] p-4 rounded-3xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between p-3 mb-2">
            <h4 className="font-poppins font-bold text-gray-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#005550]" /> Visit Greens Center, Chinchwad, Pune
            </h4>
            <span className="text-xs text-[#005550] font-bold">Synergy HQ Clinic</span>
          </div>

          <div className="aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden relative">
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
