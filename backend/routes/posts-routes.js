const express = require('express');
const { check } = require('express-validator');

const postControllers = require('../controllers/posts-controllers');

const router = express.Router();

router.get('/:pid', postControllers.getPostById);

router.get('/user/:uid', postControllers.getPostsByUserId);
router.get('/like/:pid', postControllers.getUsersByPostId);
router.get('/comment/:pid', postControllers.getCommentsByPostId);

router.post('/',
  [
    check('caption').isLength({ max: 2000 })
  ],
  postControllers.createPost
);
router.post('/:id/like', postControllers.likePost)
router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  postControllers.updatePost
);

router.delete('/:pid', postControllers.deletePost);

module.exports = router;
