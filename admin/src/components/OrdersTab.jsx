import React, { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';

export default function OrdersTab({
  orders,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  setDeleteConfirmModal
}) {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  const filteredOrders = orders.filter((o) => {
    const userName = o.user?.name || 'Customer';
    const matchesSearch = o._id.includes(orderSearch) || userName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter;
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
              placeholder="Search by Order ID or User name..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          >
            <option value="All">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Order ID &amp; Customer</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment Status</th>
                <th className="py-4 px-6">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No orders found in database.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 font-mono text-[11px]">{order._id}</p>
                      <p className="text-gray-600 font-medium">{order.user?.name || 'Customer'}</p>
                      <p className="text-gray-400 text-[10px]">{order.user?.email}</p>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 text-sm">
                      ₹{order.totalAmount}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.paymentStatus || 'pending'}
                        onChange={(e) => handleUpdatePaymentStatus(order._id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-gray-200 cursor-pointer focus:outline-none ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="text-[11px] font-bold bg-slate-100 text-gray-800 border border-gray-300 rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#005550]"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          setDeleteConfirmModal({
                            isOpen: true,
                            type: 'order',
                            id: order._id,
                            title: `Order #${order._id.substring(0, 8)}`,
                          })
                        }
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete order"
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
