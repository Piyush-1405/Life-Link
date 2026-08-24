import React, { useState } from 'react';
import { Search, UserCheck, UserX, Shield, Filter, Plus } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useData } from '../../contexts/DataContext';

const UsersPage = () => {
  const { users, toggleUserStatus, addVerifiedEntity } = useData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'HOSPITAL'
  });

  const handleAddEntity = (e) => {
    e.preventDefault();
    addVerifiedEntity(form);
    setIsModalOpen(false);
    setForm({ name: '', email: '', role: 'HOSPITAL' });
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <DashboardLayout role="ADMIN" title="User & Entity Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Registered Accounts ({users.length})</h2>
          <p className="text-sm text-gray-400">View, verify, and moderate Hospitals, Blood Banks, Donors, and Patients</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-900/30 text-sm transition-all"
        >
          <Plus size={18} /> Add Verified Entity
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, role, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 pl-10 text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'HOSPITAL', 'BLOOD_BANK', 'DONOR', 'PATIENT'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  roleFilter === role
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-[#1a1a3a] text-gray-400 border border-white/10 hover:border-white/20'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm">
                <th className="pb-3 font-semibold">User ID</th>
                <th className="pb-3 font-semibold">Name / Organization</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.map((u) => {
                const isActive = u.status === 'ACTIVE';
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono font-medium text-red-400 text-xs">{u.id}</td>
                    <td className="font-medium text-white">{u.name}</td>
                    <td className="text-gray-400">{u.email}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'HOSPITAL' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        u.role === 'BLOOD_BANK' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        u.role === 'DONOR' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        title={isActive ? 'Deactivate User' : 'Activate User'}
                        className={`p-2 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-medium ${
                          isActive 
                            ? 'text-red-400 hover:bg-red-500/15' 
                            : 'text-emerald-400 hover:bg-emerald-500/15'
                        }`}
                      >
                        {isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Verified Entity"
        size="md"
      >
        <form onSubmit={handleAddEntity} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Entity / Facility Name</label>
            <input
              type="text"
              placeholder="e.g. Fortis Memorial Research Institute"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Official Contact Email</label>
            <input
              type="email"
              placeholder="e.g. admin@fortishealthcare.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Role Category</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            >
              <option value="HOSPITAL">Hospital / Healthcare Provider</option>
              <option value="BLOOD_BANK">Licensed Blood Bank Facility</option>
              <option value="DONOR">Verified Donor Group</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-500 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-red-900/30"
            >
              Save & Verify
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default UsersPage;
