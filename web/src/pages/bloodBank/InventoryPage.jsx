import React, { useState } from 'react';
import { Plus, Search, Filter, Droplet, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useData } from '../../contexts/DataContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS'];

const InventoryPage = () => {
  const { inventory, addInventoryUnit } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newUnit, setNewUnit] = useState({
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD',
    location: 'Fridge A-01',
    expiryDate: new Date(Date.now() + 35 * 24 * 3600 * 1000).toISOString().split('T')[0]
  });

  const handleAddUnit = (e) => {
    e.preventDefault();
    addInventoryUnit(newUnit);
    setIsModalOpen(false);
  };

  const filteredInventory = inventory.filter(u => {
    const matchesStatus = filterStatus === 'ALL' || u.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      u.id.toLowerCase().includes(q) ||
      u.bloodGroup.toLowerCase().includes(q) ||
      u.component.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout role="BLOOD_BANK" title="Blood Inventory Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">In-Stock Units ({inventory.length})</h2>
          <p className="text-sm text-gray-400">Manage, test, and register blood components in storage</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-900/30 text-sm transition-all"
        >
          <Plus size={18} /> Add Blood Unit
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Unit Barcode ID, Blood Group, Component, Location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 pl-10 text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors text-sm"
            />
          </div>

          <div className="flex gap-2">
            {['ALL', 'AVAILABLE', 'RESERVED', 'USED'].map(status => (
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

        {/* Units Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm">
                <th className="pb-3 font-semibold">Unit ID</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Storage Location</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Expiry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No inventory units found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((unit, i) => (
                  <tr key={unit.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono font-medium text-red-400 text-xs">{unit.id}</td>
                    <td>
                      <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold text-xs">
                        {unit.bloodGroup}
                      </span>
                    </td>
                    <td className="text-gray-200">{unit.component}</td>
                    <td className="text-gray-400 text-xs font-mono">{unit.location}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        unit.status === 'AVAILABLE' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        unit.status === 'RESERVED' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                        'text-gray-400 bg-gray-500/10 border-gray-500/20'
                      }`}>
                        {unit.status}
                        {unit.reservedForRequestId && ` (${unit.reservedForRequestId})`}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400 font-mono">{unit.expiryDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Unit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Blood Inventory Unit"
        size="md"
      >
        <form onSubmit={handleAddUnit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Blood Group</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setNewUnit({ ...newUnit, bloodGroup: bg })}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    newUnit.bloodGroup === bg
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Component</label>
            <select
              value={newUnit.component}
              onChange={e => setNewUnit({ ...newUnit, component: e.target.value })}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            >
              {COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Storage Equipment / Shelf</label>
            <input
              type="text"
              value={newUnit.location}
              onChange={e => setNewUnit({ ...newUnit, location: e.target.value })}
              placeholder="e.g. Fridge A-02, Agitator 1"
              required
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Expiration Date</label>
            <input
              type="date"
              value={newUnit.expiryDate}
              onChange={e => setNewUnit({ ...newUnit, expiryDate: e.target.value })}
              required
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-500 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-red-900/30"
            >
              Add to Stock
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default InventoryPage;
