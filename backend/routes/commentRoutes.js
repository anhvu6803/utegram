const express = require('express');
const { check } = require('express-validator');

const commentControllers = require('../controllers/commentController');

const router = express.Router();

router.post('/', commentControllers.createComment);
router.get('/reply/:cid', commentControllers.getRepliesByCommentId);
router.post('/:cid/reply', commentControllers.createRely);
router.patch('/:cid/like', commentControllers.likeComment);
router.delete('/comment/:cid', commentControllers.deleteComment);
router.delete('/reply/:cid', commentControllers.deleteReply);

module.exports = router;
