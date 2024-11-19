const express = require('express');
const profileController = require('../controllers/profileController');


const router = express.Router();


router.get('/:username',profileController.getUserProfile);

router.patch('/follow/:uid',profileController.followUser);

router.get('/follow-status/:username',profileController.checkFollowStatus);

module.exports = router;
