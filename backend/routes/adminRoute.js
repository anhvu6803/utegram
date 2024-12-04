const express = require('express');

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.patch('/ban-post/:postId',authMiddleware.veriyTokenAndAdminAuth, adminController.updatePostByAdmin);
router.patch('/resolve/:postId',authMiddleware.veriyTokenAndAdminAuth, adminController.resolve);
router.delete('/deletecomment/:commentId',authMiddleware.veriyTokenAndAdminAuth, adminController.deleteComment);
router.delete('/deletepost/:postId',authMiddleware.veriyTokenAndAdminAuth, adminController.deletePost);
module.exports = router;