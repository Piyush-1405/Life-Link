import React from 'react';
import { Clock, CheckCircle2, XCircle, PackageCheck, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const ReservationsPage = () => {
  const { reservations, fulfillReservation, releaseReservation } = useData();

  return (
    <DashboardLayout role="BLOOD_BANK" title="Active Patient Blood Reservations">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Locked Units for Emergency Requests ({reservations.length})</h2>
        <p className="text-sm text-gray-400">Inventory units automatically reserved to guarantee blood for critical patients</p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white/5 p-12 rounded-2xl border border-white/10 text-center">
          <PackageCheck size={48} className="mx-auto mb-3 text-gray-500" />
          <h3 className="text-lg font-bold text-gray-300">No Active Reservations</h3>
          <p className="text-sm text-gray-500 mt-1">When a patient or hospital submits a request with available stock, units are automatically locked here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => {
            const isActive = res.status === 'ACTIVE';
            const isFulfilled = res.status === 'FULFILLED';
            const isReleased = res.status === 'RELEASED';

            return (
              <div
                key={res.id}
                className={`bg-white/5 p-6 rounded-2xl border relative overflow-hidden flex flex-col justify-between shadow-xl transition-all ${
                  isFulfilled ? 'border-emerald-500/30' :
                  isReleased ? 'border-red-500/30 opacity-60' :
                  'border-blue-500/30'
                }`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  isFulfilled ? 'bg-emerald-500' : isReleased ? 'bg-red-500' : 'bg-blue-500'
                }`} />

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg font-mono text-red-400">{res.requestId || res.id}</h3>
                      <p className="text-sm text-gray-300 font-medium truncate max-w-[180px]">{res.hospital}</p>
                    </div>
                    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-lg font-bold text-xs">
                      {res.bloodGroup} {res.component}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Reserved Quantity:</span>
                      <span className="font-semibold text-white">{res.units} Unit(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unit IDs:</span>
                      <span className="font-mono text-red-300 font-semibold">{res.unitIds?.join(', ') || 'Auto-Allocated'}</span>
                    </div>
                  </div>

                  <div className={`flex items-center text-xs mb-6 px-3 py-2 rounded-xl border ${
                    isFulfilled ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    isReleased ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                    'text-blue-400 bg-blue-500/10 border-blue-500/20'
                  }`}>
                    <Clock size={14} className="mr-2 flex-shrink-0" />
                    {isFulfilled ? 'Fulfilled and Dispatched to Patient ✓' :
                     isReleased ? 'Reservation Released' :
                     `Locked: Expires ${res.expiresAt}`}
                  </div>
                </div>

                {isActive ? (
                  <div className="flex gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => fulfillReservation(res.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-blue-900/30 text-white"
                    >
                      <CheckCircle2 size={14} /> Fulfill & Dispatch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Release locked units back to available inventory?')) {
                          releaseReservation(res.id);
                        }
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl font-semibold text-xs text-gray-300 hover:text-white transition-colors"
                    >
                      Release
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10 text-center">
                    <span className={`text-xs font-semibold ${isFulfilled ? 'text-emerald-400' : 'text-red-400'}`}>
                      Status: {res.status}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReservationsPage;
