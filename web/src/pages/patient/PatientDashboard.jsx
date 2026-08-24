import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, AlertTriangle, Activity, Droplet, ArrowRight, Zap, Ban } from 'lucide-react';
import PatientLayout from './PatientLayout';
import useAuth from '../../hooks/useAuth';
import { useData } from '../../contexts/DataContext';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' },
  INVENTORY_SEARCH: { label: 'Searching Inventory', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  BLOOD_RESERVED: { label: 'Blood Reserved ✓', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  DONOR_SEARCH: { label: 'Finding Donors', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  DONOR_ACCEPTED: { label: 'Donor Found!', color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20' },
  FULFILLED: { label: 'Fulfilled ✓', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests } = useData();

  const totalRequests = requests.length;
  const active = requests.filter(r => !['FULFILLED', 'CANCELLED'].includes(r.status)).length;
  const fulfilled = requests.filter(r => r.status === 'FULFILLED').length;
  const criticalOrUrgent = requests.filter(r => (r.urgency === 'CRITICAL' || r.urgency === 'URGENT') && !['FULFILLED', 'CANCELLED'].includes(r.status)).length;

  return (
    <PatientLayout title="Patient Dashboard">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-red-900/40 to-red-950/20 border border-red-500/20 rounded-2xl p-6 mb-8 overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <Droplet size={200} className="text-red-500 absolute -right-10 -top-10" />
        </div>
        <h2 className="text-2xl font-bold mb-1">
          Welcome, {user?.firstName || user?.name || 'Patient'} 👋
        </h2>
        <p className="text-gray-400 mb-5 text-sm">
          LifeLink provides instant automated inventory reservation and donor matching for critical patient requirements.
        </p>
        <button
          onClick={() => navigate('/patient/request')}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-900/40"
        >
          <PlusCircle size={18} />
          Create Blood Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Requests', val: totalRequests, icon: Activity, color: 'text-blue-400' },
          { label: 'Active Pipeline', val: active, icon: Clock, color: 'text-yellow-400' },
          { label: 'Fulfilled Units', val: fulfilled, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Urgent Pending', val: criticalOrUrgent, icon: AlertTriangle, color: 'text-red-400' },
        ].map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-3xl font-black text-white mt-1">{val}</p>
            </div>
            <Icon size={32} className={color} />
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={18} className="text-yellow-400" /> LifeLink Inventory-First Engine
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { step: '1', title: '1. Patient Requests', desc: 'Submit blood group & location', color: 'bg-blue-500' },
            { step: '2', title: '2. Auto Inventory Check', desc: 'Nearby blood banks queried in real-time', color: 'bg-purple-500' },
            { step: '3', title: '3. Lock & Reserve / Donors', desc: 'Auto-locked if in stock; else donors summoned', color: 'bg-orange-500' },
            { step: '4', title: '4. Fast Delivery', desc: 'Blood dispatched & tracked live', color: 'bg-emerald-500' },
          ].map(({ step, title, desc, color }, i, arr) => (
            <React.Fragment key={step}>
              <div className="flex-1 text-center">
                <div className={`w-8 h-8 ${color} rounded-full text-white font-bold text-sm flex items-center justify-center mx-auto mb-2`}>{step}</div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight size={16} className="text-gray-600 self-center hidden sm:block flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Recent Requests Status</h3>
          <button 
            onClick={() => navigate('/patient/my-requests')} 
            className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 font-medium"
          >
            Track All Requests ({requests.length}) <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {requests.slice(0, 5).map(req => {
            const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
            const urgencyColor = req.urgency === 'CRITICAL' ? 'text-red-400' : req.urgency === 'URGENT' ? 'text-yellow-400' : 'text-green-400';
            return (
              <div 
                key={req.id} 
                onClick={() => navigate('/patient/my-requests')}
                className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 font-black text-red-400 text-lg">
                  {req.bloodGroup}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{req.bloodGroup} {req.component}</span>
                    <span className="text-gray-400 text-sm">• {req.quantity} unit(s)</span>
                    <span className={`text-xs font-semibold ${urgencyColor}`}>[{req.urgency}]</span>
                    {req.patientName && <span className="text-xs text-gray-300">({req.patientName})</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">{req.id} • {req.hospital || 'Hospital'} • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${s.color} ${s.bg} ${s.border}`}>
                  {s.label}
                </span>
                <ArrowRight size={16} className="text-gray-600 group-hover:text-gray-300 transition-colors flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
