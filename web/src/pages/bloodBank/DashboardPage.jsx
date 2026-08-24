import React from 'react';
import { Database, AlertTriangle, Droplet, ArrowRight, Package, Clock, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { inventory, reservations, requests } = useData();

  const totalUnits = inventory.length;
  const availableUnits = inventory.filter(u => u.status === 'AVAILABLE').length;
  const reservedUnits = inventory.filter(u => u.status === 'RESERVED').length;
  const activeReservationsCount = reservations.filter(r => r.status === 'ACTIVE').length;

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const chartData = bloodGroups.map(bg => {
    const units = inventory.filter(u => u.bloodGroup === bg && u.status === 'AVAILABLE').length;
    return { name: bg, units };
  });

  const lowStockGroups = bloodGroups
    .map(bg => ({
      type: bg,
      units: inventory.filter(u => u.bloodGroup === bg && u.status === 'AVAILABLE').length
    }))
    .filter(g => g.units <= 2);

  return (
    <DashboardLayout role="BLOOD_BANK" title="Blood Bank Overview">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => navigate('/blood-bank/inventory')}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/25 cursor-pointer transition-all"
        >
          <p className="text-gray-400 text-sm">Total In-Stock Units</p>
          <h2 className="text-3xl font-bold mt-1 text-white">{totalUnits} <span className="text-sm font-normal text-gray-400">units</span></h2>
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">Manage inventory →</p>
        </div>

        <div 
          onClick={() => navigate('/blood-bank/inventory')}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <p className="text-gray-400 text-sm">Available for Requests</p>
          <h2 className="text-3xl font-bold text-emerald-400 mt-1">{availableUnits} <span className="text-sm font-normal text-gray-400">units</span></h2>
          <p className="text-xs text-emerald-400/80 mt-2">Ready for auto-reservation</p>
        </div>

        <div 
          onClick={() => navigate('/blood-bank/reservations')}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all"
        >
          <p className="text-gray-400 text-sm">Active Locked Reservations</p>
          <h2 className="text-3xl font-bold text-blue-400 mt-1">{reservedUnits} <span className="text-sm font-normal text-gray-400">units ({activeReservationsCount} reqs)</span></h2>
          <p className="text-xs text-blue-400/80 mt-2">View locked units →</p>
        </div>

        <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/30">
          <p className="text-red-400 text-sm font-semibold">Critical Shortage Types</p>
          <h2 className="text-3xl font-bold text-red-500 mt-1">{lowStockGroups.length} <span className="text-sm font-normal text-red-400/70">groups</span></h2>
          <p className="text-xs text-red-400/80 mt-2">Auto-donor alerts active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Real-time Inventory BarChart */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Stock by Blood Group</h3>
            <span className="text-xs text-gray-400">Live Inventory Count</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="units" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} /> Critical Low Stock Thresholds
            </h3>
            <div className="space-y-3">
              {lowStockGroups.length === 0 ? (
                <p className="text-sm text-emerald-400 py-6 text-center">✓ All blood group stock levels are currently above minimum reserve levels.</p>
              ) : (
                lowStockGroups.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-[#1a1a3a]/80 rounded-xl border border-red-500/30">
                    <div className="flex items-center gap-3">
                      <span className="bg-red-500/20 text-red-400 font-bold px-2.5 py-1 rounded-lg text-sm">{item.type}</span>
                      <span className="font-semibold text-sm text-white">{item.type} Group Components</span>
                    </div>
                    <span className="text-red-400 text-xs font-semibold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                      {item.units === 0 ? 'Out of Stock (0 units)' : `Critical (${item.units} unit${item.units>1?'s':''} left)`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
            ⚡ <strong>Inventory-First Engine:</strong> When patients request blood, LifeLink automatically checks this inventory and reserves matching units immediately.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
