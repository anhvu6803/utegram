const express = require('express');
const router = express.Router();
const { checkDuplicateUser, register, verifyCode, login, getUser,resetPassword,forgotPassword} = require('../controllers/authController');

router.post('/check', checkDuplicateUser);
router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/send-password-email', forgotPassword);
router.get('/:pid', getUser);
module.exports = router;
