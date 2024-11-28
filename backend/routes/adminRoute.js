const express = require('express');

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/ban-post/:postId',authMiddleware.veriyTokenAndAdminAuth, adminController.updatePostByAdmin);
router.patch('/resolve/:postId',authMiddleware.veriyTokenAndAdminAuth, adminController.resolve);
module.exports = router;