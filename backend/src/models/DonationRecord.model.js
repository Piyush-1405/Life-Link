/**
 * DonationRecord Model
 * Records scheduled and completed blood donation appointments/sessions.
 * Links donors to blood banks and optional blood requests, capturing screening, collection, and resulting inventory units.
 */

const mongoose = require('mongoose');
const { BLOOD_GROUPS, COMPONENTS, DONATION_STATUSES } = require('../config/constants');

const donationStatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: {
        values: Object.values(DONATION_STATUSES),
        message: 'Invalid donation status: {VALUE}',
      },
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { _id: true }
);

const donationRecordSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: [true, 'Donor reference is required'],
      index: true,
    },
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: [true, 'Blood bank reference is required'],
      index: true,
    },
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
      index: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: Object.values(BLOOD_GROUPS),
        message: 'Invalid blood group: {VALUE}',
      },
    },
    component: {
      type: String,
      required: [true, 'Component type is required'],
      enum: {
        values: Object.values(COMPONENTS),
        message: 'Invalid component: {VALUE}',
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DONATION_STATUSES),
        message: 'Invalid donation status: {VALUE}',
      },
      default: DONATION_STATUSES.SCHEDULED,
      index: true,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    volume: {
      type: Number,
      min: [0, 'Volume cannot be negative'],
      default: 450,
    },
    screeningNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Screening notes cannot exceed 1000 characters'],
      default: '',
    },
    inventoryUnits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryUnit',
      },
    ],
    statusHistory: [donationStatusHistorySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
donationRecordSchema.index({ donor: 1 });
donationRecordSchema.index({ bloodRequest: 1 });
donationRecordSchema.index({ bloodBank: 1, status: 1 });
donationRecordSchema.index({ status: 1, scheduledDate: 1 });

/**
 * Record a status transition with auditing
 * @param {string} newStatus - Destination status
 * @param {string} [note] - Operational remarks
 * @param {ObjectId} [changedBy] - User ID who triggered the transition
 */
donationRecordSchema.methods.updateStatus = function (newStatus, note = '', changedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    changedBy,
  });

  if (newStatus === DONATION_STATUSES.COMPLETED && !this.completedDate) {
    this.completedDate = new Date();
  }
};

const DonationRecord = mongoose.models.DonationRecord || mongoose.model('DonationRecord', donationRecordSchema);

module.exports = DonationRecord;
