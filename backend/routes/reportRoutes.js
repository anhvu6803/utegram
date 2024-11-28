const express = require('express');

const reportControllers = require('../controllers/reportController');

const router = express.Router();

router.post('/post', reportControllers.createReportPost);
router.post('/comment', reportControllers.createReportComment);
router.post('/user', reportControllers.createReportUser);
router.get('/report-user', reportControllers.ListReport);
router.get('/report-post', reportControllers.ListPostReport);
router.delete('/resolve-report/:userId', reportControllers.deleteReportUser);
module.exports = router;