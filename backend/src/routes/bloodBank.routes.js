const express = require('express');
const router = express.Router();
const bloodBankController = require('../controllers/bloodBank.controller.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');

router.get('/profile', auth, authorize('BLOOD_BANK'), bloodBankController.getProfile);
router.put('/profile', auth, authorize('BLOOD_BANK'), bloodBankController.updateProfile);
router.get('/dashboard', auth, authorize('BLOOD_BANK'), bloodBankController.getDashboard);
router.put('/config', auth, authorize('BLOOD_BANK'), bloodBankController.updateConfig);

module.exports = router;
