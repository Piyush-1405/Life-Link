import React from 'react';
import { Search, Bell, Settings, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = ({ title, user, unreadNotifications = 0, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-8 h-20 bg-[#0f0f23]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            )}
          </button>

          <div className="h-6 w-px bg-white/10 mx-2"></div>

          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center border border-white/20">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>

            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f0f23]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <UserIcon className="w-4 h-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="h-px bg-white/10 my-1"></div>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
