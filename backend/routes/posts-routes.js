const express = require('express');
const { check } = require('express-validator');

const postControllers = require('../controllers/posts-controllers');

const router = express.Router();

router.get('/:pid', postControllers.getPostById);

router.get('/user/:uid', postControllers.getPostsByUserId);

router.post('/',
  [
    check('caption').isLength({ max: 2000 })
  ],
  postControllers.createPost
);

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
