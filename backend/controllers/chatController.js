const Message = require('../models/MessageModel');
const User = require('../models/UserModel');
exports.sendMessage = async (req, res) => {
  const { senderId, recipientId, content } = req.body;

  if (!senderId || !recipientId || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newMessage = new Message({
    senderId,
    recipientId,
    content,
  });

  try {
    const savedMessage = await newMessage.save();
    return res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ message: 'Server error while saving message' });
  }
};

exports.getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 }); 

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

