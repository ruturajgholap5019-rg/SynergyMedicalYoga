import React, { useState } from 'react';
import { Search, Trash2, Eye, X, Package, MapPin, CreditCard, User, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersTab({
  orders,
  handleUpdateOrderStatus,
  handleUpdatePaymentStatus,
  setDeleteConfirmModal
}) {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
                      <p className="font-bold text-gray-900 font-mono text-[11px]">#{order._id}</p>
                      <p className="text-gray-600 font-medium">{order.user?.name || 'Valued Customer'}</p>
                      <p className="text-gray-400 text-[10px]">{order.user?.email || 'Guest Customer'}</p>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-gray-900 text-sm">
                      ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-[#005550]/10 hover:bg-[#005550] text-[#005550] hover:text-white rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                          title="View complete order details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: VIEW ORDER DETAILS --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative my-8 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005550] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                  Order Details
                </span>
                <h3 className="font-mono text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  #{selectedOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 text-xs">
              
              {/* Order Overview Meta Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Date Placed</span>
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#005550]" />
                    <span>{new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Payment Status</span>
                  <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                    selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrder.paymentStatus || 'Pending'} ({String(selectedOrder.paymentMethod || 'cashfree').toUpperCase()})
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Fulfillment</span>
                  <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 text-[#005550] capitalize">
                    {selectedOrder.orderStatus || 'Processing'}
                  </span>
                </div>
              </div>

              {/* Customer & Shipping Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#005550]" /> Customer Details
                  </h4>
                  <p className="font-bold text-sm text-slate-800">{selectedOrder.user?.name || 'Valued Customer'}</p>
                  <p className="text-slate-600">{selectedOrder.user?.email || 'N/A'}</p>
                  {selectedOrder.user?.phone && <p className="text-slate-600 font-mono">{selectedOrder.user.phone}</p>}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#005550]" /> Shipping Address
                  </h4>
                  {selectedOrder.shippingAddress ? (
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {selectedOrder.shippingAddress.street}<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                      {selectedOrder.shippingAddress.country || 'India'}
                    </p>
                  ) : (
                    <p className="text-gray-400">No address recorded</p>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#005550]" /> Purchased Items ({selectedOrder.items?.length || 0})
                </h4>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-xs">{item.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Size: <span className="font-bold text-slate-700">{item.selectedSize || 'Standard'}</span> • Qty: <span className="font-bold text-slate-700">{item.quantity}</span>
                        </p>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total Footer */}
              <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 flex items-center justify-between font-bold text-sm text-[#005550]">
                <span>Total Amount Paid</span>
                <span className="font-mono text-lg font-black text-[#005550]">
                  ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl font-bold bg-[#005550] text-white hover:bg-[#003d39] transition-all text-xs cursor-pointer shadow-md"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
