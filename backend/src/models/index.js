/**
 * Models Barrel Index
 * Re-exports all Mongoose models for centralized importing.
 */

const User = require('./User.model');
const Patient = require('./Patient.model');
const Donor = require('./Donor.model');
const Hospital = require('./Hospital.model');
const BloodBank = require('./BloodBank.model');
const InventoryUnit = require('./InventoryUnit.model');
const BloodRequest = require('./BloodRequest.model');
const DonationRecord = require('./DonationRecord.model');
const Reservation = require('./Reservation.model');
const Notification = require('./Notification.model');
const AuditLog = require('./AuditLog.model');

module.exports = {
  User,
  Patient,
  Donor,
  Hospital,
  BloodBank,
  InventoryUnit,
  BloodRequest,
  DonationRecord,
  Reservation,
  Notification,
  AuditLog,
};
