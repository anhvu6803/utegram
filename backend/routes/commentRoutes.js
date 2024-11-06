const express = require('express');
const { check } = require('express-validator');

const commentControllers = require('../controllers/commentController');

const router = express.Router();

router.post('/', commentControllers.createComment);
router.get('/reply/:cid', commentControllers.getRepliesByCommentId);
router.post('/:cid/reply', commentControllers.createRely);
router.post('/:cid/like', commentControllers.likeComment);
module.exports = router;
