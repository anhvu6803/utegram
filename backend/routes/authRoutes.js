const express = require('express');
const { register, verifyCode, login, getUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);
router.get('/:pid', getUser);

module.exports = router;
