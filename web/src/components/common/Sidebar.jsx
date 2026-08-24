import React, { useState } from 'react';
import { Droplet, Home, Activity, Users, Database, HeartPulse, FileText, BarChart, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

const ROLE_NAV_ITEMS = {
  HOSPITAL: [
    { name: 'Dashboard', icon: Home, path: '/hospital/dashboard' },
    { name: 'Blood Requests', icon: Activity, path: '/hospital/requests' },
  ],
  BLOOD_BANK: [
    { name: 'Dashboard', icon: Home, path: '/blood-bank/dashboard' },
    { name: 'Inventory', icon: Database, path: '/blood-bank/inventory' },
    { name: 'Donations', icon: HeartPulse, path: '/blood-bank/donations' },
    { name: 'Reservations', icon: FileText, path: '/blood-bank/reservations' },
  ],
  ADMIN: [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Blood Requests', icon: Activity, path: '/admin/requests' },
    { name: 'Inventory', icon: Database, path: '/admin/inventory' },
    { name: 'Analytics', icon: BarChart, path: '/admin/analytics' },
  ]
};

const Sidebar = ({ role = 'HOSPITAL', currentPath, onNavigate, user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const items = ROLE_NAV_ITEMS[role] || ROLE_NAV_ITEMS.HOSPITAL;

  return (
    <div className={`relative h-screen bg-[#0f0f23]/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col flex-shrink-0 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC2626] to-red-900 shadow-lg shadow-red-500/20 flex-shrink-0">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              LifeLink
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              title={collapsed ? item.name : ''}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-white/10 text-white border border-white/15' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`relative flex items-center justify-center ${collapsed ? 'mx-auto' : ''}`}>
                {isActive && (
                  <div className="absolute -left-3 w-1 h-8 bg-[#DC2626] rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-[#DC2626]' : 'group-hover:scale-110'}`} />
              </div>
              {!collapsed && (
                <span className="font-medium tracking-wide text-sm">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center flex-col' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center flex-shrink-0 text-white font-bold border border-white/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-[#DC2626] font-semibold tracking-wider uppercase">{role.replace('_', ' ')}</p>
            </div>
          )}
          <button 
            onClick={onLogout}
            title="Logout"
            className={`p-2 text-gray-400 hover:text-[#DC2626] hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center ${collapsed ? 'mt-2' : ''}`}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 w-8 h-8 flex items-center justify-center bg-[#0f0f23] border border-white/10 rounded-full text-gray-400 hover:text-white hover:border-white/30 transition-all z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default Sidebar;
