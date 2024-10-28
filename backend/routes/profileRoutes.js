const express = require('express');
const profileController = require('../controllers/profileController');


const router = express.Router();


router.get('/:username',profileController.getUserProfile);

router.post('/follow',profileController.followUser);


router.post('/unfollow',profileController.unfollowUser);

module.exports = router;
