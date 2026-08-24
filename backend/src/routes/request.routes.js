const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller.js');
const { createRequestSchema, transitionSchema } = require('../utils/validators/request.validator.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

router.post('/', auth, authorize('PATIENT'), validate(createRequestSchema), requestController.createRequest);
router.get('/:id', auth, authorize('PATIENT', 'HOSPITAL', 'ADMIN'), requestController.getRequest);
router.get('/', auth, authorize('HOSPITAL', 'ADMIN'), requestController.getRequests);
router.put('/:id/cancel', auth, authorize('PATIENT', 'ADMIN'), requestController.cancelRequest);
router.put('/:id/assign-hospital', auth, authorize('ADMIN'), requestController.assignHospital);
router.put('/:id/transition', auth, authorize('HOSPITAL', 'BLOOD_BANK', 'ADMIN'), validate(transitionSchema), requestController.transitionStatus);
router.get('/:id/timeline', auth, authorize('PATIENT', 'HOSPITAL', 'ADMIN'), requestController.getTimeline);

module.exports = router;
