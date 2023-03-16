const router = require('express').Router();
const authController = require('../controllers/auth');
const authenticateUser = require('../middleware/authentication');
const testUser = require('../middleware/testUser');
const rateLimiter = require('express-rate-limit');
const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        msg: `Too many request from this IP, please try again after 15 minutes`
    }
}); 

router.post('/register', apiLimiter, authController.register);
router.post('/login', apiLimiter, authController.login);
router.patch('/updateUser', authenticateUser, testUser, authController.updateUser);

module.exports = router;