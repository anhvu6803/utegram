const express = require('express');
const { register, verifyCode, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);

module.exports = router;
