/**
 * BloodRequest Model
 * Manages patient blood and component requests.
 * Tracks matching workflows (inventory vs donor search), urgency levels, reservation progress, and status lifecycles.
 */

const mongoose = require('mongoose');
const {
  BLOOD_GROUPS,
  COMPONENTS,
  URGENCY_LEVELS,
  REQUEST_STATUSES,
  DONOR_MATCH_STATUSES,
  SEARCH_RADIUS_KM,
} = require('../config/constants');

const matchedDonorSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DONOR_MATCH_STATUSES),
        message: 'Invalid donor match status: {VALUE}',
      },
      default: DONOR_MATCH_STATUSES.NOTIFIED,
    },
    notifiedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: {
        values: Object.values(REQUEST_STATUSES),
        message: 'Invalid request status: {VALUE}',
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

const bloodRequestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
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
      index: true,
    },
    component: {
      type: String,
      required: [true, 'Component type is required'],
      enum: {
        values: Object.values(COMPONENTS),
        message: 'Invalid component: {VALUE}',
      },
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 unit'],
    },
    urgency: {
      type: String,
      enum: {
        values: Object.values(URGENCY_LEVELS),
        message: 'Invalid urgency level: {VALUE}',
      },
      default: URGENCY_LEVELS.NORMAL,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(REQUEST_STATUSES),
        message: 'Invalid request status: {VALUE}',
      },
      default: REQUEST_STATUSES.PENDING,
      index: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
        validate: {
          validator: function (coords) {
            if (!coords || coords.length !== 2) return false;
            const [lng, lat] = coords;
            return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
          },
          message: 'Coordinates must be valid [longitude (-180 to 180), latitude (-90 to 90)]',
        },
      },
    },
    searchRadiusKm: {
      type: Number,
      enum: {
        values: SEARCH_RADIUS_KM,
        message: 'Invalid search radius: {VALUE}. Allowed: 5, 10, 20, 50',
      },
      default: 10,
    },
    unitsReserved: {
      type: Number,
      default: 0,
      min: [0, 'Units reserved cannot be negative'],
    },
    matchedDonors: [matchedDonorSchema],
    statusHistory: [statusHistorySchema],
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
bloodRequestSchema.index({ patient: 1, status: 1 });
bloodRequestSchema.index({ status: 1, urgency: 1 });
bloodRequestSchema.index({ hospital: 1, status: 1 });
bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ createdAt: -1 });

// Virtual to check remaining units needed
bloodRequestSchema.virtual('unitsRemaining').get(function () {
  return Math.max(0, this.quantity - (this.unitsReserved || 0));
});

// Virtual to check if fully reserved
bloodRequestSchema.virtual('isFullyReserved').get(function () {
  return (this.unitsReserved || 0) >= this.quantity;
});

/**
 * Push status transition to history and update status
 * @param {string} newStatus - The new request status
 * @param {string} [note] - Optional description or reason
 * @param {ObjectId} [changedBy] - ID of user triggering change
 */
bloodRequestSchema.methods.updateStatus = function (newStatus, note = '', changedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    changedBy,
  });

  if (newStatus === REQUEST_STATUSES.FULFILLED && !this.fulfilledAt) {
    this.fulfilledAt = new Date();
  }
};

const BloodRequest = mongoose.models.BloodRequest || mongoose.model('BloodRequest', bloodRequestSchema);

module.exports = BloodRequest;
