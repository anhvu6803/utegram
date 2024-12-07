const express = require('express');
const chatController = require('../controllers/chatController');
const { sendMessage, getMessages,markMessagesAsRead,getUnreadMessagesInfo} = require('../controllers/chatController');

const router = express.Router();

router.post('/', sendMessage);

router.get('/:userId/:otherUserId', getMessages);

router.put('/markMessagesAsRead', markMessagesAsRead);

router.get('/unread', chatController.getUnreadMessagesInfo);
module.exports = router;
