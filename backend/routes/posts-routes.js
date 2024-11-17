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
router.post('/check/image', postControllers.checkImagePost)
router.post('/check/video', postControllers.checkVideoPost)
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
router.get('/image/:username', postControllers.getImagePostsByUsername);
router.get('/video/:username', postControllers.getVideoPostsByUsername);
router.get('/bookmark/:username', postControllers.getBookmarkedPostsByUsername);
router.post('/bookmark', postControllers.bookmarkPost);
router.post('/unbookmark', postControllers.unbookmarkPost);
router.get('/tag/:tag', postControllers.getPostByTag);
router.get('/random/:userId', postControllers.getRandomPostsExcludeUser);
router.get('/videoPosts/:userId', postControllers.getRandomPostsVideoExcludeUser);
module.exports = router;
