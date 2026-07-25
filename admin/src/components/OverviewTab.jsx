import React from 'react';
import { DollarSign, Package, Users, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';

export default function OverviewTab({ stats, setActiveTab }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">
            ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Paid orders total</span>
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
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalProducts}</h3>
          <p className="text-xs text-teal-700 font-medium mt-2">Belts &amp; Yoga equipment catalog</p>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalUsers}</h3>
          <p className="text-xs text-blue-600 font-medium mt-2">Registered patients &amp; admins</p>
        </div>

        {/* Card 4: Orders */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 mt-4">{stats.totalOrders}</h3>
          <p className="text-xs text-amber-600 font-medium mt-2">Placed customer orders</p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-teal-50/30 p-6 rounded-3xl border border-teal-100 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Product Catalog Management</h4>
            <p className="text-xs text-gray-600 mt-1">Add, update, or remove orthopaedic equipment listings.</p>
          </div>
          <button
            onClick={() => setActiveTab('products')}
            className="mt-6 text-xs font-bold text-[#005550] flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>Manage Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-3xl border border-blue-100 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">User &amp; Therapist Accounts</h4>
            <p className="text-xs text-gray-600 mt-1">Manage user roles, patient accounts, and therapist permissions.</p>
          </div>
          <button
            onClick={() => setActiveTab('users')}
            className="mt-6 text-xs font-bold text-blue-700 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
          >
            <span>Manage Users</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-white to-amber-50/30 p-6 rounded-3xl border border-amber-100 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Fulfillment &amp; Order Status</h4>
            <p className="text-xs text-gray-600 mt-1">Track order status, process shipments, and manage payments.</p>
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
