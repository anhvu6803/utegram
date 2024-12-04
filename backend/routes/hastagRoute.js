const express = require('express');

const tagController = require('../controllers/hastagController');

const router = express.Router();

router.get('/', tagController.getTags);
router.patch('/', tagController.updateTags);

module.exports = router;