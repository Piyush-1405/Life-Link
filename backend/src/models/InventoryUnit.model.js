/**
 * InventoryUnit Model
 * Represents individual blood product units stored in blood bank inventories.
 * Tracks blood group, component type, safety screening test results, reservation status, and shelf life expiry.
 */

const mongoose = require('mongoose');
const { BLOOD_GROUPS, COMPONENTS, INVENTORY_STATUSES, TEST_RESULT_STATUSES } = require('../config/constants');

const testResultEnum = {
  values: Object.values(TEST_RESULT_STATUSES),
  message: 'Invalid test result status: {VALUE}',
};

const inventoryUnitSchema = new mongoose.Schema(
  {
    bloodBank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodBank',
      required: [true, 'Blood bank reference is required'],
      index: true,
    },
    unitNumber: {
      type: String,
      required: [true, 'Unit number is required'],
      unique: true,
      trim: true,
      uppercase: true,
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
        message: 'Invalid blood component: {VALUE}',
      },
      index: true,
    },
    volume: {
      type: Number,
      min: [0, 'Volume cannot be negative'],
      default: 450, // Standard whole blood collection unit is ~450ml
    },
    status: {
      type: String,
      enum: {
        values: Object.values(INVENTORY_STATUSES),
        message: 'Invalid inventory status: {VALUE}',
      },
      default: INVENTORY_STATUSES.AVAILABLE,
      index: true,
    },
    collectionDate: {
      type: Date,
      required: [true, 'Collection date is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
      index: true,
    },
    donationRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationRecord',
      default: null,
      index: true,
    },
    reservedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
      index: true,
    },
    reservedAt: {
      type: Date,
      default: null,
    },
    testResults: {
      hiv: {
        type: String,
        enum: testResultEnum,
        default: TEST_RESULT_STATUSES.PENDING,
      },
      hepatitisB: {
        type: String,
        enum: testResultEnum,
        default: TEST_RESULT_STATUSES.PENDING,
      },
      hepatitisC: {
        type: String,
        enum: testResultEnum,
        default: TEST_RESULT_STATUSES.PENDING,
      },
      syphilis: {
        type: String,
        enum: testResultEnum,
        default: TEST_RESULT_STATUSES.PENDING,
      },
      malaria: {
        type: String,
        enum: testResultEnum,
        default: TEST_RESULT_STATUSES.PENDING,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound and single field indexes
inventoryUnitSchema.index({ bloodBank: 1, bloodGroup: 1, component: 1, status: 1 });
inventoryUnitSchema.index({ status: 1, expiryDate: 1 });
inventoryUnitSchema.index({ unitNumber: 1 }, { unique: true });
inventoryUnitSchema.index({ reservedFor: 1 });
inventoryUnitSchema.index({ donationRecord: 1 });

// Virtual to check if tests are all safe/negative
inventoryUnitSchema.virtual('isTestedSafe').get(function () {
  if (!this.testResults) return false;
  const tests = [
    this.testResults.hiv,
    this.testResults.hepatitisB,
    this.testResults.hepatitisC,
    this.testResults.syphilis,
    this.testResults.malaria,
  ];
  return tests.every((res) => res === TEST_RESULT_STATUSES.NEGATIVE);
});

// Virtual to check if expired
inventoryUnitSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > new Date(this.expiryDate);
});

const InventoryUnit = mongoose.models.InventoryUnit || mongoose.model('InventoryUnit', inventoryUnitSchema);

module.exports = InventoryUnit;
