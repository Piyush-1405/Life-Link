const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');

router.get('/profile', auth, authorize('HOSPITAL'), hospitalController.getProfile);
router.put('/profile', auth, authorize('HOSPITAL'), hospitalController.updateProfile);
router.get('/requests', auth, authorize('HOSPITAL'), hospitalController.getRequests);
router.get('/dashboard', auth, authorize('HOSPITAL'), hospitalController.getDashboard);

module.exports = router;
