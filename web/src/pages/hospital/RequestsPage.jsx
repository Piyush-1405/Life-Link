import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const RequestsPage = () => {
  const navigate = useNavigate();
  const { requests } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredRequests = requests.filter(r => {
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
      r.hospital?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <DashboardLayout role="HOSPITAL" title="Blood Requests">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Hospital Blood Requests ({requests.length})</h2>
          <p className="text-sm text-gray-400">Track and create hospital emergency blood unit requisitions</p>
        </div>
        <button 
          type="button"
          onClick={() => navigate('/patient/request')}
          className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-900/30 text-sm transition-all"
        >
          <Plus size={18} /> New Request
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search requests by ID, patient, blood type..."
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
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Urgency</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredRequests.map((req) => (
                <tr 
                  key={req.id} 
                  onClick={() => navigate(`/hospital/requests/${req.id}`)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-4 font-mono text-red-400 font-semibold text-xs">{req.id}</td>
                  <td className="text-gray-200">{req.patientName || 'Emergency Patient'}</td>
                  <td><span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold text-xs">{req.bloodGroup}</span></td>
                  <td className="text-gray-300">{req.component} ({req.quantity}u)</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      req.urgency === 'URGENT' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      req.status === 'FULFILLED' ? 'text-emerald-400 bg-emerald-500/10' :
                      req.status === 'BLOOD_RESERVED' ? 'text-green-400 bg-green-500/10' :
                      req.status === 'CANCELLED' ? 'text-red-400 bg-red-500/10' :
                      'text-yellow-400 bg-yellow-500/10'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="text-gray-400 text-xs">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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
