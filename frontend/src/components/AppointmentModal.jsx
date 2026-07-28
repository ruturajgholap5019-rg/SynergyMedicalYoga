import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '04:30 PM - 05:30 PM',
  '06:00 PM - 07:00 PM',
];

export default function AppointmentModal({ isOpen, onClose, selectedService, currentUser, onAppointmentBooked }) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    serviceTitle: 'Cervical & Lumbar Traction Therapy',
    serviceId: '',
    fee: 1499,
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeSlot: '10:00 AM - 11:00 AM',
    center: 'Greens Center, Chinchwad, Pune',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({
        patientName: currentUser?.name || '',
        patientPhone: currentUser?.phone || '',
        patientEmail: currentUser?.email || '',
        serviceTitle: selectedService?.title || 'Cervical & Lumbar Traction Therapy',
        serviceId: selectedService?._id || '',
        fee: selectedService?.price || 1499,
        appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '10:00 AM - 11:00 AM',
        center: 'Greens Center, Chinchwad, Pune',
        notes: '',
      });
    }
  }, [isOpen, selectedService, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.createAppointment(formData);
      if (res.data) {
        setBookedAppointment(res.data);
        setStep('success');
        onAppointmentBooked?.(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to book appointment. Please check your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[96vh] sm:max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header (Sticky top) */}
        <div className="bg-gradient-to-r from-[#005550] via-[#006660] to-[#007068] px-6 py-4 sm:py-5 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-teal-200 shrink-0" />
            <div>
              <h2 className="font-sansita font-bold text-xl sm:text-2xl leading-tight">Book Therapy Appointment</h2>
              <p className="text-[11px] text-teal-100">Doctor-supervised medical yoga clinical session</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-teal-100 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            
            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-[#444444]">
              
              {/* Selected Service Card */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#005550] bg-white px-2.5 py-0.5 rounded-full border border-teal-100">
                    Selected Session
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{formData.serviceTitle}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Session Fee: ₹{formData.fee} ({selectedService?.duration || '60 mins'})</p>
                </div>
                <span className="font-extrabold text-xl text-[#005550]">₹{formData.fee}</span>
              </div>

              {/* Date & Time Slot Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#005550]" /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#005550]" /> Clinic Location *
                  </label>
                  <select
                    value={formData.center}
                    onChange={(e) => setFormData({ ...formData, center: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  >
                    <option value="Greens Center, Chinchwad, Pune">Greens Center, Chinchwad, Pune</option>
                    <option value="Online Video Consultation">Online Video Consultation</option>
                  </select>
                </div>
              </div>

              {/* Time Slot Chips */}
              <div>
                <label className="block font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#005550]" /> Select Available Time Slot *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`py-2 px-3 rounded-xl border font-bold text-[11px] transition-all cursor-pointer ${
                        formData.timeSlot === slot
                          ? 'bg-[#005550] text-white border-[#005550] shadow-sm'
                          : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Info Fields */}
              <div className="space-y-4 pt-2 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Patient Contact Details</h4>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Phone Number (For Confirmation SMS) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="patient@example.com"
                      value={formData.patientEmail}
                      onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Health Complaints &amp; Symptoms (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Lumbar back pain for 2 months, stiffness in morning..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Sticky Action Footer */}
            <div className="p-4 sm:px-8 sm:py-4 bg-slate-50 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-bold bg-white border border-gray-200 hover:bg-slate-100 text-gray-700 transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-bold bg-[#005550] hover:bg-[#003d39] text-white shadow-md shadow-[#005550]/20 transition-all cursor-pointer text-xs"
              >
                {isSubmitting ? 'Booking Appointment...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-sansita font-bold text-2xl text-gray-900">Appointment Scheduled!</h3>
            <p className="text-gray-600 text-xs max-w-md mx-auto">
              Your appointment for <span className="font-bold text-gray-900">{bookedAppointment?.serviceTitle}</span> on{' '}
              <span className="font-bold text-[#005550]">
                {new Date(bookedAppointment?.appointmentDate).toLocaleDateString()} ({bookedAppointment?.timeSlot})
              </span>{' '}
              has been successfully booked. Our team will contact you at <span className="font-bold text-gray-900">{bookedAppointment?.patientPhone}</span>.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="bg-[#005550] hover:bg-[#003d39] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
