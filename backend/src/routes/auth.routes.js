const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { registerSchema, loginSchema, changePasswordSchema } = require('../utils/validators/auth.validator.js');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', auth, authController.logout);
router.post('/change-password', auth, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
