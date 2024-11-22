const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin, isPostOwner } = require('../middleware/authMiddleware'); 
router.get('/', userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.post('/', userController.createUser);

router.get('/except/:userId', userController.getAllUsersExcept);

router.get('/morepost/:uid', userController.getUserHasMorePosts);

router.get('/check-username/:username', userController.checkUsernameExists);

router.get('/search/username', userController.searchUser);

router.get('/follow/:userId', userController.getFollowDataByUserId);

router.patch('/ban/:userId', isAdmin, userController.banUser); 

router.patch('/:uid', userController.updateInformationUser);

module.exports = router;
