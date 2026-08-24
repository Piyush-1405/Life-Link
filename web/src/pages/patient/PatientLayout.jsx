import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Droplet, Home, PlusCircle, ClipboardList, User, LogOut, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Home, path: '/patient/dashboard' },
  { label: 'Request Blood', icon: PlusCircle, path: '/patient/request' },
  { label: 'My Requests', icon: ClipboardList, path: '/patient/my-requests' },
  { label: 'Track Status', icon: Activity, path: '/patient/track' },
  { label: 'Profile', icon: User, path: '/patient/profile' },
];

const PatientLayout = ({ children, title = 'Patient Portal' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-[#0a0a1a]/95 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-900/40">
            <Droplet size={20} className="text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">LifeLink</span>
            <p className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">Patient Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group ${
                  isActive ? 'bg-red-500/15 text-white border border-red-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <div className="relative">
                  {isActive && <div className="absolute -left-3 w-1 h-5 bg-red-500 rounded-r-full shadow-[0_0_10px_rgba(220,38,38,0.6)]" />}
                  <Icon size={18} className={isActive ? 'text-red-400' : 'group-hover:scale-110 transition-transform'} />
                </div>
                <span className="font-medium text-sm">{label}</span>
                {label === 'Request Blood' && (
                  <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white font-bold text-sm border border-white/20">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName || user?.email || 'Patient'}</p>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Patient</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 h-16 bg-[#0f0f23]/80 backdrop-blur-xl border-b border-white/10">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/patient/request')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-900/30">
              <PlusCircle size={16} />
              New Request
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default PatientLayout;
