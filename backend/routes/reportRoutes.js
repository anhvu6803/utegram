const express = require('express');

const reportControllers = require('../controllers/reportController');

const router = express.Router();

router.post('/post', reportControllers.createReportPost);
router.post('/comment', reportControllers.createReportComment);
router.post('/user', reportControllers.createReportUser);
router.get('/report-user', reportControllers.ListReport);
router.get('/report-post', reportControllers.ListPostReport);
router.delete('/resolve-report/:userId', reportControllers.deleteReportUser);
router.get('/comment/:cid', reportControllers.getReportCommentById);
router.get('/post/:pid', reportControllers.getReportPostById);
router.delete('/comment/:cid', reportControllers.deleteReportCommentById);
router.delete('/post/:pid', reportControllers.deleteReportPostById);

module.exports = router;