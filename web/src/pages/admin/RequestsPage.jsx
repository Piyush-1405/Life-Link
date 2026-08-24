import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const RequestsPage = () => {
  const { requests } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = requests.filter(r => {
    const isFulfilled = r.status === 'FULFILLED';
    const isCancelled = r.status === 'CANCELLED';
    const isActive = !isFulfilled && !isCancelled;

    const matchesFilter =
      filterStatus === 'ALL' ? true :
      filterStatus === 'ACTIVE' ? isActive :
      filterStatus === 'FULFILLED' ? isFulfilled :
      filterStatus === 'CANCELLED' ? isCancelled :
      r.status === filterStatus;

    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      r.id.toLowerCase().includes(q) ||
      r.bloodGroup.toLowerCase().includes(q) ||
      r.patientName?.toLowerCase().includes(q) ||
      r.hospital?.toLowerCase().includes(q) ||
      r.component?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout role="ADMIN" title="Global Blood Requests">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">System-wide Blood Demand ({requests.length})</h2>
        <p className="text-sm text-gray-400">All emergency and routine blood requests across connected hospitals and patients</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by Request ID, blood type, urgency, patient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 pl-10 text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'ACTIVE', 'FULFILLED', 'CANCELLED'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-[#1a1a3a] text-gray-400 border border-white/10 hover:border-white/20'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm">
                <th className="pb-3 font-semibold">Request ID</th>
                <th className="pb-3 font-semibold">Requester / Patient</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Urgency</th>
                <th className="pb-3 font-semibold">Fulfillment Engine</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono font-medium text-red-400 text-xs">{r.id}</td>
                  <td className="text-gray-200">
                    <span className="font-semibold text-white">{r.patientName || 'Patient'}</span>
                    <span className="block text-xs text-gray-400">{r.hospital}</span>
                  </td>
                  <td><span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold text-xs">{r.bloodGroup}</span></td>
                  <td className="text-gray-300">{r.component} ({r.quantity}u)</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                      r.urgency === 'URGENT' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {r.urgency}
                    </span>
                  </td>
                  <td className="text-gray-400 text-xs">
                    {r.status === 'BLOOD_RESERVED' ? '⚡ Auto-Inventory Lock' :
                     r.status === 'DONOR_SEARCH' ? `📡 Donor Broadcast (${r.searchRadiusKm}km)` :
                     r.status === 'FULFILLED' ? '✓ Dispatched & Received' :
                     'Cancelled'}
                  </td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'FULFILLED' ? 'text-emerald-400 bg-emerald-500/10' :
                      r.status === 'BLOOD_RESERVED' ? 'text-green-400 bg-green-500/10' :
                      r.status === 'CANCELLED' ? 'text-red-400 bg-red-500/10' :
                      'text-yellow-400 bg-yellow-500/10'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestsPage;
