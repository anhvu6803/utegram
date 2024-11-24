const express = require('express');

const notifyController = require('../controllers/notifyController');

const router = express.Router();


router.post('/', notifyController.createNotify);

module.exports = router;