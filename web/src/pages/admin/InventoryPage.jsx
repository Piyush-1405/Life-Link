import React, { useState } from 'react';
import { Search, Filter, Database } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { useData } from '../../contexts/DataContext';

const InventoryPage = () => {
  const { inventory } = useData();
  const [search, setSearch] = useState('');

  const wholeBlood = inventory.filter(u => u.component === 'WHOLE_BLOOD').length;
  const rbc = inventory.filter(u => u.component === 'RBC').length;
  const plasma = inventory.filter(u => u.component === 'PLASMA').length;
  const platelets = inventory.filter(u => u.component === 'PLATELETS').length;

  const filtered = inventory.filter(u => {
    const q = search.toLowerCase().trim();
    return !q ||
      u.id.toLowerCase().includes(q) ||
      u.bloodGroup.toLowerCase().includes(q) ||
      u.component.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.status.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout role="ADMIN" title="Global Inventory Pool">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Network Inventory Overview ({inventory.length} total units)</h2>
        <p className="text-sm text-gray-400">Total consolidated blood units across all registered blood banks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Whole Blood</p>
          <h2 className="text-2xl font-bold mt-1 text-red-400">{wholeBlood} <span className="text-xs text-gray-400">units</span></h2>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Packed RBC</p>
          <h2 className="text-2xl font-bold mt-1 text-blue-400">{rbc} <span className="text-xs text-gray-400">units</span></h2>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Fresh Plasma</p>
          <h2 className="text-2xl font-bold mt-1 text-purple-400">{plasma} <span className="text-xs text-gray-400">units</span></h2>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm">Platelet Units</p>
          <h2 className="text-2xl font-bold mt-1 text-yellow-400">{platelets} <span className="text-xs text-gray-400">units</span></h2>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search all global inventory units by ID, blood type, equipment..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 pl-10 text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm">
                <th className="pb-3 font-semibold">Unit ID</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Facility Storage</th>
                <th className="pb-3 font-semibold">Expiry Date</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filtered.map((u, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono font-medium text-red-400 text-xs">{u.id}</td>
                  <td><span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold text-xs">{u.bloodGroup}</span></td>
                  <td className="text-gray-200">{u.component}</td>
                  <td className="text-gray-400 text-xs font-mono">{u.location}</td>
                  <td className="text-gray-400 text-xs">{u.expiryDate}</td>
                  <td>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.status === 'AVAILABLE' ? 'text-emerald-400 bg-emerald-500/10' :
                      u.status === 'RESERVED' ? 'text-blue-400 bg-blue-500/10' :
                      'text-gray-400 bg-gray-500/10'
                    }`}>
                      {u.status} {u.reservedForRequestId && `(${u.reservedForRequestId})`}
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

export default InventoryPage;
