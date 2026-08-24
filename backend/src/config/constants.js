/**
 * LifeLink - Blood Donation Management System
 * Application Constants and Enumerations
 */

// Blood Groups supported by the system
const BLOOD_GROUPS = Object.freeze([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
]);

// Blood Components
const COMPONENTS = Object.freeze([
  'WHOLE_BLOOD',
  'RBC',
  'PLASMA',
  'PLATELETS'
]);

// User Roles for Authentication and RBAC
const ROLES = Object.freeze([
  'PATIENT',
  'DONOR',
  'HOSPITAL',
  'BLOOD_BANK',
  'ADMIN'
]);

// Named Object Mapping for Role Keys
const ROLES_ENUM = Object.freeze({
  PATIENT: 'PATIENT',
  DONOR: 'DONOR',
  HOSPITAL: 'HOSPITAL',
  BLOOD_BANK: 'BLOOD_BANK',
  ADMIN: 'ADMIN'
});

// Blood Request Lifecycle Statuses
const REQUEST_STATUSES = Object.freeze([
  'PENDING',
  'INVENTORY_SEARCH',
  'BLOOD_RESERVED',
  'DONOR_SEARCH',
  'DONOR_ACCEPTED',
  'DONATION_SCHEDULED',
  'DONATION_COMPLETED',
  'FULFILLED',
  'CANCELLED',
  'EXPIRED'
]);

// Inventory Unit Statuses
const INVENTORY_STATUSES = Object.freeze([
  'AVAILABLE',
  'RESERVED',
  'USED',
  'EXPIRED',
  'QUARANTINE',
  'DISCARDED'
]);

// Donation Appointment & Workflow Statuses
const DONATION_STATUSES = Object.freeze([
  'SCHEDULED',
  'SCREENING',
  'COLLECTING',
  'TESTING',
  'PROCESSING',
  'COMPLETED',
  'REJECTED',
  'CANCELLED'
]);

// Blood Request Urgency Levels
const URGENCY_LEVELS = Object.freeze([
  'NORMAL',
  'URGENT',
  'CRITICAL'
]);

// Donor Search Radii (in kilometers) for geo-spatial expansion
const SEARCH_RADII = Object.freeze([5, 10, 20, 50]);

// Valid State Transitions for Blood Requests
const VALID_REQUEST_TRANSITIONS = Object.freeze({
  PENDING: Object.freeze(['INVENTORY_SEARCH', 'CANCELLED', 'EXPIRED']),
  INVENTORY_SEARCH: Object.freeze(['BLOOD_RESERVED', 'DONOR_SEARCH', 'CANCELLED', 'EXPIRED']),
  BLOOD_RESERVED: Object.freeze(['FULFILLED', 'DONOR_SEARCH', 'CANCELLED', 'EXPIRED']),
  DONOR_SEARCH: Object.freeze(['DONOR_ACCEPTED', 'CANCELLED', 'EXPIRED']),
  DONOR_ACCEPTED: Object.freeze(['DONATION_SCHEDULED', 'DONOR_SEARCH', 'CANCELLED', 'EXPIRED']),
  DONATION_SCHEDULED: Object.freeze(['DONATION_COMPLETED', 'DONOR_SEARCH', 'CANCELLED', 'EXPIRED']),
  DONATION_COMPLETED: Object.freeze(['FULFILLED', 'CANCELLED', 'EXPIRED']),
  FULFILLED: Object.freeze([]),
  CANCELLED: Object.freeze([]),
  EXPIRED: Object.freeze([])
});

// Valid State Transitions for Donations
const VALID_DONATION_TRANSITIONS = Object.freeze({
  SCHEDULED: Object.freeze(['SCREENING', 'CANCELLED']),
  SCREENING: Object.freeze(['COLLECTING', 'REJECTED', 'CANCELLED']),
  COLLECTING: Object.freeze(['TESTING', 'REJECTED', 'CANCELLED']),
  TESTING: Object.freeze(['PROCESSING', 'REJECTED', 'CANCELLED']),
  PROCESSING: Object.freeze(['COMPLETED', 'REJECTED']),
  COMPLETED: Object.freeze([]),
  REJECTED: Object.freeze([]),
  CANCELLED: Object.freeze([])
});

// Default Component Expiration Shelf-Life (in days)
const DEFAULT_EXPIRY_DAYS = Object.freeze({
  WHOLE_BLOOD: 35,
  RBC: 42,
  PLASMA: 365,
  PLATELETS: 5
});

// Minimum mandatory cooldown interval between whole blood donations (in days)
const DEFAULT_MIN_DONATION_INTERVAL_DAYS = 56;

// Mandatory Infectious Disease Screening Tests
const TEST_TYPES = Object.freeze([
  'hiv',
  'hepatitisB',
  'hepatitisC',
  'syphilis',
  'malaria'
]);

// Test Result Statuses
const TEST_RESULTS = Object.freeze([
  'NEGATIVE',
  'POSITIVE',
  'PENDING'
]);

// Gender Options
const GENDERS = Object.freeze([
  'MALE',
  'FEMALE',
  'OTHER'
]);

// Red Blood Cell & Whole Blood Compatibility (Recipient -> Compatible Donor Blood Groups)
const RBC_COMPATIBILITY = Object.freeze({
  'O-': Object.freeze(['O-']),
  'O+': Object.freeze(['O+', 'O-']),
  'A-': Object.freeze(['A-', 'O-']),
  'A+': Object.freeze(['A+', 'A-', 'O+', 'O-']),
  'B-': Object.freeze(['B-', 'O-']),
  'B+': Object.freeze(['B+', 'B-', 'O+', 'O-']),
  'AB-': Object.freeze(['AB-', 'A-', 'B-', 'O-']),
  'AB+': Object.freeze(['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'])
});

// Plasma Compatibility (Recipient -> Compatible Donor Blood Groups)
const PLASMA_COMPATIBILITY = Object.freeze({
  'O-': Object.freeze(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']),
  'O+': Object.freeze(['O+', 'A+', 'B+', 'AB+']),
  'A-': Object.freeze(['A-', 'A+', 'AB-', 'AB+']),
  'A+': Object.freeze(['A+', 'AB+']),
  'B-': Object.freeze(['B-', 'B+', 'AB-', 'AB+']),
  'B+': Object.freeze(['B+', 'AB+']),
  'AB-': Object.freeze(['AB-', 'AB+']),
  'AB+': Object.freeze(['AB+'])
});

// Test Result Statuses (object version for enum validation)
const TEST_RESULT_STATUSES = Object.freeze({
  NEGATIVE: 'NEGATIVE',
  POSITIVE: 'POSITIVE',
  PENDING: 'PENDING'
});

// Reservation Statuses
const RESERVATION_STATUSES = Object.freeze({
  ACTIVE: 'ACTIVE',
  FULFILLED: 'FULFILLED',
  RELEASED: 'RELEASED',
  EXPIRED: 'EXPIRED'
});

// Notification Types
const NOTIFICATION_TYPES = Object.freeze({
  REQUEST_CREATED: 'REQUEST_CREATED',
  INVENTORY_FOUND: 'INVENTORY_FOUND',
  BLOOD_RESERVED: 'BLOOD_RESERVED',
  DONOR_MATCH: 'DONOR_MATCH',
  DONOR_ACCEPTED: 'DONOR_ACCEPTED',
  DONOR_REJECTED: 'DONOR_REJECTED',
  DONATION_SCHEDULED: 'DONATION_SCHEDULED',
  DONATION_COMPLETED: 'DONATION_COMPLETED',
  REQUEST_FULFILLED: 'REQUEST_FULFILLED',
  REQUEST_EXPIRED: 'REQUEST_EXPIRED',
  INVENTORY_LOW: 'INVENTORY_LOW',
  INVENTORY_EXPIRING: 'INVENTORY_EXPIRING',
  SYSTEM_ALERT: 'SYSTEM_ALERT'
});

// Donor Match Statuses (within a BloodRequest's matchedDonors array)
const DONOR_MATCH_STATUSES = Object.freeze({
  NOTIFIED: 'NOTIFIED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
});

// Alias for search radii in KM (same as SEARCH_RADII)
const SEARCH_RADIUS_KM = [5, 10, 20, 50];

module.exports = {
  BLOOD_GROUPS,
  COMPONENTS,
  ROLES,
  ROLES_ENUM,
  REQUEST_STATUSES,
  INVENTORY_STATUSES,
  DONATION_STATUSES,
  URGENCY_LEVELS,
  SEARCH_RADII,
  SEARCH_RADIUS_KM,
  VALID_REQUEST_TRANSITIONS,
  VALID_DONATION_TRANSITIONS,
  DEFAULT_EXPIRY_DAYS,
  DEFAULT_MIN_DONATION_INTERVAL_DAYS,
  TEST_TYPES,
  TEST_RESULTS,
  GENDERS,
  RBC_COMPATIBILITY,
  PLASMA_COMPATIBILITY,
  DONOR_MATCH_STATUSES,
  TEST_RESULT_STATUSES,
  RESERVATION_STATUSES,
  NOTIFICATION_TYPES
};
