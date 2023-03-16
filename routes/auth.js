const router = require('express').Router();
const authController = require('../controllers/auth');
const authenticateUser = require('../middleware/authentication');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/updateUser', authenticateUser, authController.updateUser);

module.exports = router;