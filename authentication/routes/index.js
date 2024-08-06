const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.post('/login', authController.login);
router.put('/logout',authController.logout);
router.put('/refresh-token', authController.refreshToken);
router.get('/validate', authenticate, authController.validate);
router.get('/me', authenticate, authController.me);
module.exports = router;
