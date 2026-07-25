import React, { useState } from 'react';
import { Search, Plus, ShieldCheck, Edit2, Trash2 } from 'lucide-react';

export default function UsersTab({
  users,
  openAddUserModal,
  openEditUserModal,
  setDeleteConfirmModal
}) {
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
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
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
            />
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value)}
            className="bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
          >
            <option value="All">All Roles</option>
            <option value="customer">Customer / Patient</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={openAddUserModal}
          className="bg-[#005550] hover:bg-[#003d39] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#005550]/20 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Contact Phone</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Registered Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No users found in database.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#005550] text-white flex items-center justify-center font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-gray-500 text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-700">{user.phone || 'N/A'}</td>
                    <td className="py-4 px-6">
                      {user.role === 'admin' ? (
                        <span className="bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="bg-teal-100 text-[#005550] font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => openEditUserModal(user)}
                        className="p-2 bg-slate-100 hover:bg-teal-50 text-gray-700 hover:text-[#005550] rounded-xl transition-colors cursor-pointer"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmModal({
                            isOpen: true,
                            type: 'user',
                            id: user._id,
                            title: user.name,
                          })
                        }
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-gray-700 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                        title="Delete user"
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
