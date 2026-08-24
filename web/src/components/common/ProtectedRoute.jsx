import React from 'react';
import { Navigate } from 'react-router-dom';
// Using a mock hook here. Adjust path or context as needed for real usage.
// import { useAuth } from '@/hooks/useAuth'; 

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Mock auth state for the template
  const isAuthenticated = true;
  const user = { role: 'HOSPITAL' };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f23] text-white">
        <h1 className="text-4xl font-bold mb-4 text-[#DC2626]">403</h1>
        <p className="text-xl text-gray-400">Access Denied</p>
        <p className="mt-2 text-gray-500">You do not have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
