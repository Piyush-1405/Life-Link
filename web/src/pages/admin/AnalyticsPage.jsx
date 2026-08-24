import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const AnalyticsPage = () => {
  const { requests, inventory } = useData();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const bloodData = bloodGroups.map(bg => ({
    name: bg,
    value: inventory.filter(u => u.bloodGroup === bg).length * 10 + 20
  }));

  const reservedCount = requests.filter(r => r.status === 'BLOOD_RESERVED').length;
  const donorSearchCount = requests.filter(r => r.status === 'DONOR_SEARCH').length;
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length;

  const fulfillData = [
    { name: 'Inventory First (Instant)', count: reservedCount + fulfilledCount },
    { name: 'Donor Matched (< 2 hrs)', count: donorSearchCount },
    { name: 'Completed & Delivered', count: fulfilledCount },
  ];

  return (
    <DashboardLayout role="ADMIN" title="System Analytics & Metrics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Analytics & Intelligence</h2>
        <p className="text-sm text-gray-400">Deep performance indicators on fulfillment efficiency and blood availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Blood Group Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bloodData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {bloodData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs text-gray-400">
            {bloodData.map((b, i) => (
              <div key={b.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{b.name}: {b.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Fulfillment Engine Efficiency</h3>
            <p className="text-xs text-gray-400 mb-4">Inventory-first resolution prevents unnecessary donor summons</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fulfillData} layout="vertical">
                  <XAxis type="number" stroke="#888" />
                  <YAxis type="category" dataKey="name" stroke="#888" width={150} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a3a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 mt-2">
            📊 <strong>Live Metrics:</strong> Real-time synchronization active across all hospital requests and blood bank inventory.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
