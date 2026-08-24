/**
 * AuditLog Model
 * Implements immutable change auditing and security tracking across the LifeLink platform.
 * Captures actor identity, actions performed, affected entities, delta diffs, and IP origins.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Audit log actor is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      index: true,
    },
    entity: {
      type: String,
      required: [true, 'Target entity is required'],
      trim: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    // Audit logs are append-only; disable automatic updatedAt modifications
    timestamps: { createdAt: false, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ entity: 1, createdAt: -1 });

/**
 * Helper static method to record an audit log entry
 * @param {Object} auditData
 * @param {ObjectId} auditData.actor
 * @param {string} auditData.action
 * @param {string} auditData.entity
 * @param {ObjectId} [auditData.entityId]
 * @param {Object} [auditData.changes]
 * @param {string} [auditData.ipAddress]
 * @returns {Promise<Document>}
 */
auditLogSchema.statics.log = async function (auditData) {
  return this.create(auditData);
};

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
