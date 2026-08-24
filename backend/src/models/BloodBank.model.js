/**
 * BloodBank Model
 * Represents licensed blood banks and donor centers.
 * Manages inventory rules, operating hours, geolocation, and hospital affiliations.
 */

const mongoose = require('mongoose');
const { DEFAULT_EXPIRY_DAYS, DEFAULT_MIN_DONATION_INTERVAL_DAYS } = require('../config/constants');

const bloodBankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Blood bank name is required'],
      trim: true,
      maxlength: [200, 'Blood bank name cannot exceed 200 characters'],
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true,
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
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      zipCode: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: '' },
    },
    contactPerson: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    operatingHours: {
      open: {
        type: String,
        default: '08:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Operating open hour must be in HH:MM format'],
      },
      close: {
        type: String,
        default: '20:00',
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Operating close hour must be in HH:MM format'],
      },
    },
    affiliatedHospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    config: {
      expiryDays: {
        WHOLE_BLOOD: {
          type: Number,
          default: DEFAULT_EXPIRY_DAYS.WHOLE_BLOOD,
          min: 1,
        },
        RBC: {
          type: Number,
          default: DEFAULT_EXPIRY_DAYS.RBC,
          min: 1,
        },
        PLASMA: {
          type: Number,
          default: DEFAULT_EXPIRY_DAYS.PLASMA,
          min: 1,
        },
        PLATELETS: {
          type: Number,
          default: DEFAULT_EXPIRY_DAYS.PLATELETS,
          min: 1,
        },
      },
      minDonationIntervalDays: {
        type: Number,
        default: DEFAULT_MIN_DONATION_INTERVAL_DAYS,
        min: 1,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
bloodBankSchema.index({ userId: 1 }, { unique: true });
bloodBankSchema.index({ licenseNumber: 1 }, { unique: true });
bloodBankSchema.index({ location: '2dsphere' });
bloodBankSchema.index({ isVerified: 1 });
bloodBankSchema.index({ name: 'text' });

const BloodBank = mongoose.models.BloodBank || mongoose.model('BloodBank', bloodBankSchema);

module.exports = BloodBank;
