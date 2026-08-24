const express = require('express');
const router = express.Router();
const inventoryUnitController = require('../controllers/inventoryUnit.controller.js');
const { addUnitSchema, updateUnitSchema, searchSchema } = require('../utils/validators/inventory.validator.js');
const auth = require('../middleware/auth.middleware');
const authorize = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');

router.post('/', auth, authorize('BLOOD_BANK'), validate(addUnitSchema), inventoryUnitController.addUnit);
router.get('/', auth, authorize('BLOOD_BANK', 'HOSPITAL', 'ADMIN'), inventoryUnitController.getUnits);
router.get('/stats', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.getStats);
router.get('/expiring', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.getExpiringUnits);
router.get('/:id', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.getUnit);
router.put('/:id', auth, authorize('BLOOD_BANK'), validate(updateUnitSchema), inventoryUnitController.updateUnit);
router.delete('/:id', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.deleteUnit);
router.post('/search', auth, authorize('BLOOD_BANK', 'HOSPITAL', 'ADMIN'), validate(searchSchema), inventoryUnitController.searchCompatible);
router.post('/reserve', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.reserveUnits);
router.post('/release/:reservationId', auth, authorize('BLOOD_BANK', 'ADMIN'), inventoryUnitController.releaseReservation);

module.exports = router;
