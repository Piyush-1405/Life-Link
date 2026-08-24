import React from 'react';

const STATUS_CONFIG = {
  PENDING: { color: 'amber', label: 'Pending' },
  INVENTORY_SEARCH: { color: 'blue', label: 'Inventory Search' },
  BLOOD_RESERVED: { color: 'emerald', label: 'Blood Reserved' },
  DONOR_SEARCH: { color: 'purple', label: 'Donor Search' },
  DONOR_ACCEPTED: { color: 'emerald', label: 'Donor Accepted' },
  DONATION_SCHEDULED: { color: 'blue', label: 'Scheduled' },
  DONATION_COMPLETED: { color: 'emerald', label: 'Completed' },
  FULFILLED: { color: 'emerald', label: 'Fulfilled' },
  CANCELLED: { color: 'red', label: 'Cancelled' },
  EXPIRED: { color: 'red', label: 'Expired' }
};

const COLOR_STYLES = {
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  default: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
};

const DOT_COLORS = {
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  default: 'bg-gray-500'
};

const StatusBadge = ({ status, pulse = false, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { color: 'default', label: status };
  const colorStyle = COLOR_STYLES[config.color];
  const dotColor = DOT_COLORS[config.color];
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${colorStyle} ${sizeStyles[size]}`}>
      <span className="relative flex h-2 w-2 items-center justify-center">
        {pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColor}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`}></span>
      </span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
