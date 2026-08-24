import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ icon: Icon, value, label, trend, trendValue, color = 'red' }) => {
  const colorSchemes = {
    red: 'from-[#DC2626] to-red-900 shadow-red-500/20 text-[#DC2626]',
    emerald: 'from-emerald-500 to-emerald-700 shadow-emerald-500/20 text-emerald-500',
    blue: 'from-blue-500 to-blue-700 shadow-blue-500/20 text-blue-500',
    amber: 'from-amber-500 to-amber-700 shadow-amber-500/20 text-amber-500',
  };

  const scheme = colorSchemes[color] || colorSchemes.red;

  return (
    <div className="relative overflow-hidden bg-[#0f0f23]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300">
      {/* Background glow effect */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${scheme.split(' ')[0]} ${scheme.split(' ')[1]} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium tracking-wide mb-1">{label}</p>
          <h4 className="text-3xl font-bold text-white tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${scheme.split(' ')[0]} ${scheme.split(' ')[1]} shadow-lg ${scheme.split(' ')[2]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {(trend === 'up' || trend === 'down') && (
        <div className="mt-4 flex items-center gap-2">
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
