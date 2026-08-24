import React, { useState } from 'react';
import { Activity, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/common/DashboardLayout';
import Modal from '../../components/common/Modal';
import { useData } from '../../contexts/DataContext';

const STAGE_COLORS = {
  SCHEDULED: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  SCREENING: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  COLLECTING: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  TESTING: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  PROCESSING: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  COMPLETED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const DonationsPage = () => {
  const { donations, advanceDonationStage, addWalkInDonation } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    donorName: '',
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD'
  });

  const handleRegisterDonor = (e) => {
    e.preventDefault();
    addWalkInDonation(form);
    setIsModalOpen(false);
    setForm({ donorName: '', bloodGroup: 'O+', component: 'WHOLE_BLOOD' });
  };

  return (
    <DashboardLayout role="BLOOD_BANK" title="Donation Workflow & Processing">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Donation Pipeline ({donations.length})</h2>
          <p className="text-sm text-gray-400">Track donor appointments, screening, collection, and laboratory testing</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-red-900/30 text-sm transition-all"
        >
          <Plus size={18} /> Register Walk-in Donor
        </button>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-sm">
                <th className="pb-3 font-semibold">Donation ID</th>
                <th className="pb-3 font-semibold">Donor Name / ID</th>
                <th className="pb-3 font-semibold">Blood Group</th>
                <th className="pb-3 font-semibold">Component</th>
                <th className="pb-3 font-semibold">Current Stage</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {donations.map((record) => {
                const colorClass = STAGE_COLORS[record.stage] || STAGE_COLORS.SCHEDULED;
                return (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono font-medium text-red-400 text-xs">{record.id}</td>
                    <td className="text-white font-medium">{record.donorName} <span className="text-xs text-gray-400">({record.donorId})</span></td>
                    <td>
                      <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg font-bold text-xs">
                        {record.bloodGroup}
                      </span>
                    </td>
                    <td className="text-gray-300">{record.component}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
                        {record.stage}
                      </span>
                    </td>
                    <td className="text-gray-400 text-xs">{record.date}</td>
                    <td className="text-right">
                      {record.stage === 'COMPLETED' ? (
                        <span className="text-emerald-400 text-xs font-semibold flex items-center justify-end gap-1">
                          <CheckCircle size={14} /> Added to Stock
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => advanceDonationStage(record.id)}
                          className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 text-gray-200 hover:text-white"
                        >
                          Advance Stage <ArrowRight size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Walk-in Donor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Walk-in Donor"
        size="md"
      >
        <form onSubmit={handleRegisterDonor} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Donor Full Name</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={form.donorName}
              onChange={e => setForm({ ...form, donorName: e.target.value })}
              required
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Blood Group</label>
            <select
              value={form.bloodGroup}
              onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 font-medium">Donation Component</label>
            <select
              value={form.component}
              onChange={e => setForm({ ...form, component: e.target.value })}
              className="w-full bg-[#1a1a3a] border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-red-500 text-sm"
            >
              <option value="WHOLE_BLOOD">Whole Blood</option>
              <option value="RBC">Red Blood Cells</option>
              <option value="PLASMA">Plasma</option>
              <option value="PLATELETS">Platelets</option>
            </select>
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
              Start Collection
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default DonationsPage;
