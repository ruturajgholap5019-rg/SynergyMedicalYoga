import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, CheckCircle2, Trash2, Phone, Mail, User } from 'lucide-react';

export default function AppointmentsTab({
  appointments,
  handleUpdateStatus,
  setDeleteConfirmModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = appointments.filter((app) => {
    const matchesSearch = app.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patientPhone?.includes(searchQuery) ||
      app.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending Confirmation</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Patient Info</th>
                <th className="py-4 px-6">Service &amp; Fee</th>
                <th className="py-4 px-6">Date &amp; Time Slot</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No appointments found in database.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#005550] text-white flex items-center justify-center font-bold text-sm">
                          {app.patientName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{app.patientName}</p>
                          <p className="text-gray-600 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#005550]" /> {app.patientPhone}
                          </p>
                          <p className="text-gray-400 text-[10px]">{app.patientEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900">{app.serviceTitle}</p>
                      <p className="text-[#005550] font-extrabold text-xs">₹{app.fee}</p>
                      {app.notes && (
                        <p className="text-gray-500 text-[10px] italic mt-0.5 truncate max-w-xs" title={app.notes}>
                          Note: "{app.notes}"
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-xs">
                        <p className="font-bold text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#005550]" />
                          {new Date(app.appointmentDate).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 font-medium text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {app.timeSlot}
                        </p>
                        <p className="text-gray-400 text-[10px] truncate max-w-xs">{app.center}</p>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={app.status || 'pending'}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                        className={`text-[11px] font-bold rounded-xl px-3 py-1.5 border border-gray-300 cursor-pointer focus:outline-none ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          setDeleteConfirmModal({
                            isOpen: true,
                            type: 'appointment',
                            id: app._id,
                            title: `Appointment for ${app.patientName}`,
                          })
                        }
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
