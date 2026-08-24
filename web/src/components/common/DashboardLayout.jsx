import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const DashboardLayout = ({ role = 'HOSPITAL', title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const displayName = user?.name || user?.firstName || user?.email || (role === 'BLOOD_BANK' ? 'City Central Blood Bank' : role === 'HOSPITAL' ? 'City Memorial Hospital' : 'System Admin');

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex overflow-hidden">
      <Sidebar
        role={role}
        currentPath={location.pathname}
        onNavigate={navigate}
        user={{ name: displayName }}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <Navbar
          title={title}
          user={{ name: displayName }}
          onLogout={handleLogout}
        />
        <div className="p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
