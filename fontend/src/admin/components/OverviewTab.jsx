import React from 'react';
import { DollarSign, Package, Users, ShoppingBag, TrendingUp, ChevronRight, Activity, Calendar, Sparkles, FileText, Globe } from 'lucide-react';

export default function OverviewTab({ stats, setActiveTab }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-[#005550] to-[#006660] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Operational Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Enterprise Command Center</h2>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Real-time database analytics and centralized content governance for Synergy Medical Yoga therapy care initiatives and shop fulfillment.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('cms')}
          className="px-5 py-3 bg-white text-[#005550] font-extrabold rounded-2xl hover:bg-teal-50 hover:shadow-lg transition-all flex items-center gap-2 text-sm shrink-0 cursor-pointer shadow-sm"
        >
          <Globe className="w-4 h-4" />
          <span>Launch Website Live Editor</span>
        </button>
      </div>

      {/* Real Statistics Grid (Pure DB metrics - Zero Fake Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Realized Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">
            ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified paid order totals</span>
          </p>
        </div>

        {/* Card 2: Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Products</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#005550] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalProducts || 0}</h3>
          <p className="text-xs text-teal-700 font-medium mt-2">Orthopaedic &amp; rope therapy catalog</p>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Accounts</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalUsers || 0}</h3>
          <p className="text-xs text-blue-600 font-medium mt-2">Patients, doctors &amp; admin staff</p>
        </div>

        {/* Card 4: Orders */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Placed Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalOrders || 0}</h3>
          <p className="text-xs text-amber-600 font-medium mt-2">Total customer checkout records</p>
        </div>

        {/* Card 5: Services */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Therapy Services</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalServices || 0}</h3>
          <p className="text-xs text-purple-600 font-medium mt-2">Active clinical consultation offerings</p>
        </div>

        {/* Card 6: Appointments */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appt. Bookings</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalAppointments || 0}</h3>
          <p className="text-xs text-indigo-600 font-medium mt-2">Patient consultation schedules</p>
        </div>
      </div>

      {/* Enterprise Modular Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-white to-teal-50/40 p-6 rounded-3xl border border-teal-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-teal-100/60 text-[#005550] flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">Website CMS Editor</h4>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">Directly modify public stats counters, about us narratives, and promotional app download links.</p>
          </div>
          <button
            onClick={() => setActiveTab('cms')}
            className="mt-6 text-xs font-bold text-[#005550] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>Customize Website</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/40 p-6 rounded-3xl border border-blue-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100/60 text-blue-600 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">Product Catalog</h4>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">Add, edit, or discontinue orthopedic equipment and therapeutic yoga products.</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="mt-6 text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>Manage Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50/40 p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100/60 text-purple-600 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">Clinical &amp; Services</h4>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">Oversee clinical consultation services, practitioner schedules, and booked patient appointments.</p>
          </div>
          <button
            onClick={() => setActiveTab('appointments')}
            className="mt-6 text-xs font-bold text-purple-600 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>View Appointments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50/40 p-6 rounded-3xl border border-amber-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100/60 text-amber-600 flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">Order Fulfillment</h4>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">Track customer orders, process shipping statuses, and audit incoming transaction payments.</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="mt-6 text-xs font-bold text-amber-700 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>Manage Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
