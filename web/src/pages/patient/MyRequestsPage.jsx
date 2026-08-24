import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, XCircle, Droplet, Clock, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import PatientLayout from './PatientLayout';
import { useData } from '../../contexts/DataContext';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', dot: 'bg-gray-400' },
  INVENTORY_SEARCH: { label: 'Searching Inventory', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', dot: 'bg-blue-400' },
  BLOOD_RESERVED: { label: 'Blood Reserved ✓', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', dot: 'bg-green-400' },
  DONOR_SEARCH: { label: 'Finding Donors', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', dot: 'bg-purple-400 animate-pulse' },
  DONOR_ACCEPTED: { label: 'Donor Found!', color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20', dot: 'bg-teal-400' },
  DONATION_SCHEDULED: { label: 'Donation Scheduled', color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', dot: 'bg-cyan-400' },
  FULFILLED: { label: 'Fulfilled ✓', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', dot: 'bg-emerald-400' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-400' },
};

const MyRequestsPage = () => {
  const navigate = useNavigate();
  const { requests, cancelRequest } = useData();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = requests.filter(r => {
    const isFulfilled = r.status === 'FULFILLED';
    const isCancelled = r.status === 'CANCELLED';
    const isActive = !isFulfilled && !isCancelled;

    const matchesFilter =
      filter === 'ALL' ? true :
      filter === 'ACTIVE' ? isActive :
      filter === 'FULFILLED' ? isFulfilled :
      filter === 'CANCELLED' ? isCancelled :
      r.status === filter;

    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      r.bloodGroup?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q) ||
      r.hospital?.toLowerCase().includes(q) ||
      r.patientName?.toLowerCase().includes(q) ||
      r.component?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <PatientLayout title="Track Blood Requests">
      {/* Header with Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Request ID, blood type, patient name, hospital..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'ACTIVE', 'FULFILLED', 'CANCELLED'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-900/20'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 p-8">
          <Droplet size={48} className="mx-auto mb-4 text-red-500 opacity-40 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">No Requests Found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            {search ? 'No requests match your current search query.' : 'You have not submitted any blood requests yet.'}
          </p>
          <button
            onClick={() => navigate('/patient/request')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/30"
          >
            <PlusCircle size={18} /> Create Blood Request Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
            const urgencyColor = req.urgency === 'CRITICAL' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                                 req.urgency === 'URGENT' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
                                 'text-green-400 bg-green-500/10 border-green-500/30';
            const isExpanded = expanded === req.id;

            return (
              <div
                key={req.id}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all shadow-xl"
              >
                {/* Card Header */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : req.id)}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-red-900/30 border border-red-500/40 flex items-center justify-center font-black text-red-400 text-xl flex-shrink-0">
                    {req.bloodGroup}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-white text-base">{req.bloodGroup} {req.component}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${urgencyColor}`}>{req.urgency}</span>
                      {req.patientName && (
                        <span className="text-xs text-gray-300 font-medium">Patient: {req.patientName}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                      <span className="font-mono text-red-400 font-medium">ID: {req.id}</span>
                      <span>•</span>
                      <span>{req.quantity} unit(s)</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">{req.hospital || req.location?.address}</span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${s.color} ${s.bg} ${s.border}`}>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                    <span className="text-gray-500 text-sm font-bold bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded Details & Timeline */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/10 pt-5 bg-black/10">
                    {/* Visual Timeline */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">Live Fulfillment Journey</p>
                      <div className="space-y-3 pl-2">
                        {req.timeline && req.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 relative">
                            <div className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0 ${
                                step.status === 'CANCELLED' ? 'border-red-500 bg-red-500/20 text-red-400' :
                                step.current ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 animate-pulse' :
                                step.done ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                                'border-white/20 text-gray-600 bg-transparent'
                              }`}>
                                {step.status === 'CANCELLED' ? '✕' : step.done ? '✓' : idx + 1}
                              </div>
                              {idx < req.timeline.length - 1 && (
                                <div className={`w-0.5 h-6 my-1 ${step.done ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                              )}
                            </div>
                            <div className="flex-1 pb-1">
                              <p className={`text-sm font-semibold ${
                                step.status === 'CANCELLED' ? 'text-red-400' :
                                step.current ? 'text-yellow-400' :
                                step.done ? 'text-white' : 'text-gray-500'
                              }`}>
                                {step.label}
                              </p>
                              <p className="text-xs text-gray-500">{step.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-5">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-gray-400">Search Radius</p>
                        <p className="text-white font-semibold mt-0.5">{req.searchRadiusKm || 10} km</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-gray-400">Quantity Needed</p>
                        <p className="text-white font-semibold mt-0.5">{req.quantity} Unit(s)</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-gray-400">Location / Hospital</p>
                        <p className="text-white font-semibold mt-0.5 truncate">{req.hospital || req.location?.address}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <p className="text-xs text-gray-400">Contact Number</p>
                        <p className="text-white font-semibold mt-0.5">{req.contactPhone || 'N/A'}</p>
                      </div>
                    </div>

                    {req.notes && (
                      <div className="mb-5 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                        <span className="font-semibold text-gray-400">Doctor / Medical Notes:</span> {req.notes}
                      </div>
                    )}

                    {/* Actions: Cancel Request */}
                    {!['FULFILLED', 'CANCELLED'].includes(req.status) && (
                      <div className="flex justify-end pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel blood request ${req.id}? Any reserved blood units will be returned to inventory.`)) {
                              cancelRequest(req.id);
                            }
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 rounded-xl text-sm font-semibold transition-all"
                        >
                          <XCircle size={16} /> Cancel This Request
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </PatientLayout>
  );
};

export default MyRequestsPage;
