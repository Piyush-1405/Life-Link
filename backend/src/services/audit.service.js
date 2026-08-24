const AuditLog = require('../models/AuditLog.model');

class AuditService {
  async log(actorId, action, entity, entityId, changes = null, ipAddress = null) {
    return AuditLog.create({
      actor: actorId,
      action,
      entity,
      entityId,
      changes,
      ipAddress
    });
  }

  async getLogs(filters = {}, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.actor) query.actor = filters.actor;
    if (filters.entity) query.entity = filters.entity;
    if (filters.action) query.action = filters.action;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('actor', 'email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(query)
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }
}

module.exports = new AuditService();
