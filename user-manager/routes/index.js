const express = require('express');
const userController = require('../controllers/userController');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.post('/users',validateToken, userController.createUser);
router.get('/users',validateToken, userController.getAllUsers);
router.get('/users/:email',validateToken, userController.getUserByEmail);
router.delete('/users',validateToken, userController.deleteUser);
router.put('/users',validateToken, userController.updateUser);
router.post('/users/update-password',validateToken, userController.updatePassword);

module.exports = router;
