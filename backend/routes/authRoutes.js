const express = require('express');
const router = express.Router();
const { checkDuplicateUser, register, verifyCode, login } = require('../controllers/authController');

router.post('/check', checkDuplicateUser);
router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/login', login);
router.get('/:pid', getUser);

module.exports = router;
