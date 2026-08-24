import React from 'react';
import { ArrowLeft, Droplet, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requests, cancelRequest } = useData();

  const request = requests.find(r => r.id === id) || requests[0];

  return (
    <DashboardLayout role="HOSPITAL" title={`Request Details — ${request?.id || id}`}>
      <Link to="/hospital/requests" className="inline-flex items-center text-gray-400 hover:text-white mb-6 text-sm">
        <ArrowLeft size={16} className="mr-2" /> Back to Requests
      </Link>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold font-mono text-red-400">#{request?.id}</h1>
          <p className="text-gray-400 mt-1 text-sm">Patient: {request?.patientName || 'Emergency Patient'} • Hospital: {request?.hospital}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full font-bold text-xs border ${
          request?.status === 'BLOOD_RESERVED' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
          request?.status === 'FULFILLED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
          request?.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        }`}>
          {request?.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Droplet className="text-red-400" size={32} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Required Product</p>
                <div className="text-2xl font-bold">{request?.bloodGroup} {request?.component}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Quantity Required</div>
              <div className="text-2xl font-bold text-red-400">{request?.quantity} Unit(s)</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Fulfillment Timeline</h3>
            <div className="space-y-4 pl-4 border-l-2 border-white/10 relative text-sm">
              {request?.timeline && request.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border ${
                    step.status === 'CANCELLED' ? 'bg-red-500 border-red-400' :
                    step.current ? 'bg-yellow-500 border-yellow-300 animate-pulse' :
                    step.done ? 'bg-emerald-500 border-emerald-400' : 'bg-transparent border-white/30'
                  }`} />
                  <p className={`font-semibold ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                  <p className="text-xs text-gray-400">{step.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-gray-400">Patient Name</span><span className="text-white font-medium">{request?.patientName || 'Emergency Patient'}</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-gray-400">Age</span><span>{request?.patientAge || '35'}</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-gray-400">Contact</span><span>{request?.contactPhone || 'N/A'}</span></div>
              <div className="flex justify-between py-1 border-b border-white/5"><span className="text-gray-400">Urgency</span><span className="font-bold text-red-400">{request?.urgency}</span></div>
              <div className="flex justify-between py-1"><span className="text-gray-400">Location</span><span className="truncate max-w-[150px]">{request?.hospital || request?.location?.address}</span></div>
            </div>
          </div>

          {!['FULFILLED', 'CANCELLED'].includes(request?.status) && (
            <button 
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to cancel request ${request.id}?`)) {
                  cancelRequest(request.id);
                  navigate('/hospital/requests');
                }
              }}
              className="w-full bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={18} /> Cancel Request
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestDetailPage;
