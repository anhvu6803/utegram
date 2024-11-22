const express = require('express');
const { isAdmin, isPostOwner } = require('../middleware/authMiddleware');

const profileController = require('../controllers/profileController');


const router = express.Router();


router.get('/:username',profileController.getUserProfile);

router.patch('/follow/:uid',profileController.followUser);

router.get('/follow-status/:username',profileController.checkFollowStatus);
router.get('/followers/:username',profileController.getListFollowerByUsername);
router.get('/following/:username',profileController.getListFollowingByUsername);
module.exports = router;
