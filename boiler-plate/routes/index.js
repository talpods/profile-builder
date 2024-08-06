const express = require('express');
const helloController = require('../controllers/helloController');

const router = express.Router();

router.get('/greet/:username', helloController.getGreeting);
router.post('/user', helloController.saveUser);

module.exports = router;
