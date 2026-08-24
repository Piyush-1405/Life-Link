const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donation.controller.js');
const { createDonationSchema, transitionSchema, completeSchema } = require('../utils/validators/donation.validator.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

router.post('/', auth, authorize('BLOOD_BANK', 'HOSPITAL'), validate(createDonationSchema), donationController.createDonation);
router.get('/:id', auth, authorize('DONOR', 'BLOOD_BANK', 'HOSPITAL', 'ADMIN'), donationController.getDonation);
router.get('/', auth, authorize('BLOOD_BANK', 'HOSPITAL', 'ADMIN'), donationController.getDonations);
router.put('/:id/transition', auth, authorize('BLOOD_BANK'), validate(transitionSchema), donationController.transitionStatus);
router.put('/:id/complete', auth, authorize('BLOOD_BANK'), validate(completeSchema), donationController.completeDonation);

module.exports = router;
