import React from 'react';
import { Users, Activity, Droplet, Shield, HeartPulse, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';

const DashboardPage = () => {
  const data = [
    { name: 'Mon', reqs: 40 }, { name: 'Tue', reqs: 30 },
    { name: 'Wed', reqs: 55 }, { name: 'Thu', reqs: 45 },
    { name: 'Fri', reqs: 70 }, { name: 'Sat', reqs: 60 }, { name: 'Sun', reqs: 35 }
  ];

  return (
    <DashboardLayout role="ADMIN" title="System Administration">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Registered Users</p>
              <h2 className="text-3xl font-bold mt-1">12,480</h2>
            </div>
            <Users className="text-purple-400" size={24} />
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Active Requests</p>
              <h2 className="text-3xl font-bold mt-1 text-yellow-400">342</h2>
            </div>
            <Activity className="text-yellow-400" size={24} />
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Global Inventory</p>
              <h2 className="text-3xl font-bold mt-1 text-emerald-400">8,942</h2>
            </div>
            <Droplet className="text-emerald-400" size={24} />
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">Donations Today</p>
              <h2 className="text-3xl font-bold mt-1 text-red-400">124</h2>
            </div>
            <HeartPulse className="text-red-400" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Request Volume Trends (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="reqs" stroke="#DC2626" strokeWidth={3} dot={{ r: 4, fill: '#DC2626' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">System Entity Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Hospitals Connected', count: 820, icon: Building2, color: 'text-blue-400' },
                { label: 'Licensed Blood Banks', count: 340, icon: Droplet, color: 'text-purple-400' },
                { label: 'Verified Active Donors', count: '58,000+', icon: Users, color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#1a1a3a]/60 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={item.color} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-sm text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
            ✓ Geospatial indexing & auto-matching engine active
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
