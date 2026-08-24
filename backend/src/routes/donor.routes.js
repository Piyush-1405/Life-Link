const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donor.controller.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');

router.get('/profile', auth, authorize('DONOR'), donorController.getProfile);
router.put('/profile', auth, authorize('DONOR'), donorController.updateProfile);
router.put('/availability', auth, authorize('DONOR'), donorController.toggleAvailability);
router.get('/eligible-requests', auth, authorize('DONOR'), donorController.getEligibleRequests);
router.post('/respond/:requestId', auth, authorize('DONOR'), donorController.respondToRequest);
router.get('/donations', auth, authorize('DONOR'), donorController.getDonationHistory);

module.exports = router;
