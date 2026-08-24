import React from 'react';
import { Droplet } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...', fullscreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const containerClasses = fullscreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f0f23]/90 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        <div className={`absolute ${sizeClasses[size]} bg-[#DC2626] rounded-full opacity-20 animate-ping`}></div>
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} bg-gradient-to-br from-[#DC2626] to-red-900 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse`}>
          <Droplet className="text-white w-1/2 h-1/2" />
        </div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
