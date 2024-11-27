const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

router.get('/except/:userId', userController.getAllUsersExcept);

router.get('/morepost/:uid', userController.getUserHasMorePosts);

router.get('/check-username/:username', userController.checkUsernameExists);

router.get('/search/username', userController.searchUser);

router.get('/follow/:userId', userController.getFollowDataByUserId);

router.patch('/ban/:userId', userController.banUser);

router.patch('/:uid',
    [
        check('bio').isLength({ max: 150 })
    ],
    userController.updateInformationUser
);

module.exports = router;
