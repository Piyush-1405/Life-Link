/**
 * Patient Model
 * Represents recipient/patient profiles requiring blood components.
 * Includes demographic information, blood group, medical notes, and GeoJSON location.
 */

const mongoose = require('mongoose');
const { BLOOD_GROUPS, GENDERS } = require('../config/constants');

const patientSchema = new mongoose.Schema(
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
      enum: {
        values: Object.values(BLOOD_GROUPS),
        message: 'Invalid blood group: {VALUE}',
      },
      default: null,
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
    medicalNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Medical notes cannot exceed 1000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
patientSchema.index({ userId: 1 }, { unique: true });
patientSchema.index({ location: '2dsphere' });
patientSchema.index({ bloodGroup: 1 });

// Virtual to calculate age
patientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const diffMs = Date.now() - new Date(this.dateOfBirth).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

module.exports = Patient;
