const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { locationUpdateSchema } = require('../utils/validators/common.validator.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateMe);
router.put('/me/location', auth, authorize('PATIENT', 'DONOR'), validate(locationUpdateSchema), userController.updateLocation);

module.exports = router;
