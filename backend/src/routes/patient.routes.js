const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');

router.get('/profile', auth, authorize('PATIENT'), patientController.getProfile);
router.put('/profile', auth, authorize('PATIENT'), patientController.updateProfile);
router.get('/requests', auth, authorize('PATIENT'), patientController.getMyRequests);

module.exports = router;
