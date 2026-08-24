/**
 * Hospital Model
 * Represents verified clinical institutions requesting blood products and managing transfusions.
 */

const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
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
      required: [true, 'Hospital name is required'],
      trim: true,
      maxlength: [200, 'Hospital name cannot exceed 200 characters'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration/license number is required'],
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
    affiliatedBloodBanks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodBank',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
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
hospitalSchema.index({ userId: 1 }, { unique: true });
hospitalSchema.index({ registrationNumber: 1 }, { unique: true });
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ isVerified: 1 });
hospitalSchema.index({ name: 'text' });

const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
