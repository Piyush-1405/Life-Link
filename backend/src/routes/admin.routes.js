const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');

router.get('/users', auth, authorize('ADMIN'), adminController.getUsers);
router.put('/users/:id/status', auth, authorize('ADMIN'), adminController.toggleUserStatus);
router.put('/users/:id/verify', auth, authorize('ADMIN'), adminController.verifyEntity);
router.get('/dashboard', auth, authorize('ADMIN'), adminController.getDashboard);
router.get('/analytics', auth, authorize('ADMIN'), adminController.getAnalytics);
router.get('/audit-logs', auth, authorize('ADMIN'), adminController.getAuditLogs);
router.post('/hospitals', auth, authorize('ADMIN'), adminController.createHospital);
router.post('/blood-banks', auth, authorize('ADMIN'), adminController.createBloodBank);

module.exports = router;
