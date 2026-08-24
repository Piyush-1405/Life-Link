import React from 'react';
import { Droplet } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BloodGroupBadge = ({ group, size = 'md' }) => {
  const isValidGroup = BLOOD_GROUPS.includes(group);
  const displayGroup = isValidGroup ? group : '??';

  const isPositive = displayGroup.includes('+');
  
  // Rh Positive = Red gradient, Rh Negative = Blue/Purple gradient 
  // (Just adding some visual distinction as an example of premium UI)
  const bgGradient = isPositive 
    ? 'bg-gradient-to-br from-[#DC2626] to-red-900 shadow-red-500/30' 
    : 'bg-gradient-to-br from-indigo-500 to-indigo-900 shadow-indigo-500/30';

  const sizeClasses = {
    sm: 'w-8 h-10 text-xs',
    md: 'w-10 h-12 text-sm',
    lg: 'w-14 h-16 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${bgGradient} rounded-t-full rounded-bl-full rounded-br-sm rotate-45 shadow-lg`}>
      <div className="-rotate-45 flex flex-col items-center justify-center mt-1">
        <span className="font-bold text-white tracking-tighter leading-none">{displayGroup}</span>
        <Droplet className={`${iconSizes[size]} text-white/50 absolute top-1`} style={{ opacity: 0.1 }} />
      </div>
    </div>
  );
};

export default BloodGroupBadge;
