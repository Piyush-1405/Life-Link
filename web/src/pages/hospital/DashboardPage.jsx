import React from 'react';
import { Activity, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import DashboardLayout from '../../components/common/DashboardLayout';

const DashboardPage = () => {
  const data = [{ name: 'Pending', value: 12 }, { name: 'Active', value: 19 }, { name: 'Fulfilled', value: 45 }];
  const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

  return (
    <DashboardLayout role="HOSPITAL" title="Hospital Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Requests', val: '76', icon: Activity, color: 'text-blue-500' },
          { title: 'Pending', val: '12', icon: Clock, color: 'text-yellow-500' },
          { title: 'Urgent', val: '4', icon: AlertCircle, color: 'text-red-500' },
          { title: 'Fulfilled', val: '45', icon: CheckCircle, color: 'text-green-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 flex items-center justify-between">
            <div><p className="text-gray-400">{s.title}</p><h2 className="text-3xl font-bold">{s.val}</h2></div>
            <s.icon size={36} className={s.color} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Recent Requests</h3>
          <table className="w-full text-left">
            <thead><tr className="text-gray-400 border-b border-white/10"><th className="pb-2">Patient</th><th className="pb-2">Blood Group</th><th className="pb-2">Status</th><th className="pb-2">Date</th></tr></thead>
            <tbody>
              {['John D.', 'Sarah M.', 'Mike R.'].map((n, i) => (
                <tr key={i} className="border-b border-white/5"><td className="py-3">{n}</td><td><span className="bg-red-500/20 text-red-400 px-2 py-1 rounded">O+</span></td><td><span className="text-yellow-400">Pending</span></td><td className="text-gray-400">Today</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a3a', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
