const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');

const router = express.Router();

router.post('/', sendMessage);

router.get('/:userId/:otherUserId', getMessages);



module.exports = router;
