/**
 * Reservation Model
 * Tracks time-limited locks/holds placed on specific inventory units for patient blood requests.
 * Supports auto-expiration, manual release, and fulfillment lifecycle states.
 */

const mongoose = require('mongoose');
const { RESERVATION_STATUSES } = require('../config/constants');

const reservationSchema = new mongoose.Schema(
  {
    inventoryUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InventoryUnit',
      required: [true, 'Inventory unit reference is required'],
      index: true,
    },
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: [true, 'Blood request reference is required'],
      index: true,
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: [true, 'Blood bank reference is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(RESERVATION_STATUSES),
        message: 'Invalid reservation status: {VALUE}',
      },
      default: RESERVATION_STATUSES.ACTIVE,
      index: true,
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
    releasedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
reservationSchema.index({ inventoryUnit: 1, status: 1 });
reservationSchema.index({ bloodRequest: 1 });
reservationSchema.index({ expiresAt: 1, status: 1 });
reservationSchema.index({ bloodBank: 1, status: 1 });

// Virtual to check if reservation is currently active
reservationSchema.virtual('isActive').get(function () {
  if (this.status !== RESERVATION_STATUSES.ACTIVE) return false;
  if (this.expiresAt && new Date() > new Date(this.expiresAt)) return false;
  return true;
});

/**
 * Marks reservation as fulfilled
 */
reservationSchema.methods.fulfill = function () {
  this.status = RESERVATION_STATUSES.FULFILLED;
  this.fulfilledAt = new Date();
};

/**
 * Releases reservation back into available inventory
 */
reservationSchema.methods.release = function () {
  this.status = RESERVATION_STATUSES.RELEASED;
  this.releasedAt = new Date();
};

/**
 * Marks reservation as expired
 */
reservationSchema.methods.expire = function () {
  this.status = RESERVATION_STATUSES.EXPIRED;
};

const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
