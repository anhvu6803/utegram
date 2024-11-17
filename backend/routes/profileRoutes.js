const express = require('express');
const profileController = require('../controllers/profileController');


const router = express.Router();


router.get('/:username',profileController.getUserProfile);

router.post('/follow/:username',profileController.followUser);


router.post('/unfollow/:username',profileController.unfollowUser);
router.post('/follow-status/:username',profileController.checkFollowStatus);

module.exports = router;
