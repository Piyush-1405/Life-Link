export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const COMPONENTS = ['WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS'];
export const URGENCY_LEVELS = ['ROUTINE', 'URGENT', 'EMERGENCY'];

export const REQUEST_STATUSES = [
  'PENDING', 'INVENTORY_SEARCH', 'BLOOD_RESERVED', 'DONOR_SEARCH', 
  'DONOR_ACCEPTED', 'DONATION_SCHEDULED', 'DONATION_COMPLETED', 
  'FULFILLED', 'CANCELLED', 'EXPIRED'
];

export const INVENTORY_STATUSES = ['AVAILABLE', 'RESERVED', 'USED', 'EXPIRED', 'DISCARDED'];
export const DONATION_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
export const ROLES = ['HOSPITAL', 'BLOOD_BANK', 'ADMIN'];

export const STATUS_COLORS = {
  PENDING: 'badge-pending',
  INVENTORY_SEARCH: 'badge-info',
  BLOOD_RESERVED: 'badge-info',
  DONOR_SEARCH: 'badge-info',
  DONOR_ACCEPTED: 'badge-info',
  DONATION_SCHEDULED: 'badge-info',
  DONATION_COMPLETED: 'badge-success',
  FULFILLED: 'badge-success',
  CANCELLED: 'badge-neutral',
  EXPIRED: 'badge-danger',
  
  AVAILABLE: 'badge-success',
  RESERVED: 'badge-info',
  USED: 'badge-neutral',
  DISCARDED: 'badge-danger',
  
  ROUTINE: 'badge-info',
  URGENT: 'badge-pending',
  EMERGENCY: 'badge-danger',
};
