/**
 * Donor Model
 * Represents registered voluntary blood donors.
 * Stores blood group, availability, donation history, component eligibility, and location.
 */

const mongoose = require('mongoose');
const { BLOOD_GROUPS, GENDERS, DEFAULT_MIN_DONATION_INTERVAL_DAYS } = require('../config/constants');

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
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
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(GENDERS),
        message: 'Invalid gender: {VALUE}',
      },
      default: null,
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
      default: null,
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
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      zipCode: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: '' },
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
      min: [0, 'Total donations cannot be negative'],
    },
    componentEligibility: {
      wholeBlood: {
        type: Boolean,
        default: true,
      },
      rbc: {
        type: Boolean,
        default: true,
      },
      plasma: {
        type: Boolean,
        default: true,
      },
      platelets: {
        type: Boolean,
        default: true,
      },
    },
    healthDeclarationDate: {
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
donorSchema.index({ userId: 1 }, { unique: true });
donorSchema.index({ bloodGroup: 1, isAvailable: 1 });
donorSchema.index({ location: '2dsphere' });
donorSchema.index({ isAvailable: 1, lastDonationDate: 1 });

// Virtual to calculate donor age
donorSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diffMs = Date.now() - new Date(this.dateOfBirth).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});

// Virtual to check if donation interval has passed
donorSchema.virtual('isIntervalElapsed').get(function () {
  if (!this.lastDonationDate) return true;
  const intervalMs = DEFAULT_MIN_DONATION_INTERVAL_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.lastDonationDate).getTime() >= intervalMs;
});

/**
 * Checks if donor is eligible for donation at this moment
 * @param {number} minIntervalDays - Custom minimum interval in days (optional)
 * @returns {boolean}
 */
donorSchema.methods.checkEligibility = function (minIntervalDays = DEFAULT_MIN_DONATION_INTERVAL_DAYS) {
  if (!this.isAvailable) return false;
  if (this.weight && this.weight < 45) return false; // Standard minimum weight threshold

  if (this.lastDonationDate) {
    const elapsedDays = (Date.now() - new Date(this.lastDonationDate).getTime()) / (1000 * 60 * 60 * 24);
    if (elapsedDays < minIntervalDays) {
      return false;
    }
  }

  return true;
};

const Donor = mongoose.models.Donor || mongoose.model('Donor', donorSchema);

module.exports = Donor;
