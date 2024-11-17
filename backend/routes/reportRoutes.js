const express = require('express');

const reportControllers = require('../controllers/reportController');

const router = express.Router();

router.post('/post', reportControllers.createReportPost);
router.post('/comment', reportControllers.createReportComment);
router.post('/user', reportControllers.createReportUser);

module.exports = router;