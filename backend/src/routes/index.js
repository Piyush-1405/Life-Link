const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const patientRoutes = require('./patient.routes.js');
const donorRoutes = require('./donor.routes.js');
const requestRoutes = require('./request.routes.js');
const inventoryRoutes = require('./inventory.routes.js');
const donationRoutes = require('./donation.routes.js');
const hospitalRoutes = require('./hospital.routes.js');
const bloodBankRoutes = require('./bloodBank.routes.js');
const adminRoutes = require('./admin.routes.js');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/patients', patientRoutes);
router.use('/donors', donorRoutes);
router.use('/requests', requestRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/donations', donationRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/blood-banks', bloodBankRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
