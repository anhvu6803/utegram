const { response } = require('express');
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

exports.markMessagesAsRead = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng." });
    }


    const result = await Message.updateMany(
      {
        $or: [
          { senderId: userId2, recipientId: userId1, read: false },
        ]
      },
      { $set: { read: true } }
    );

    res.status(200).json({
      message: "Tất cả tin nhắn đã được cập nhật thành đã đọc.",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái tin nhắn." });
  }
};
exports.getUnreadMessagesInfo =  async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const unreadMessages = await Message.find({
      recipientId: userId,
      read: false,
    }).distinct('senderId');

    if (unreadMessages.length === 0) {
      return res.status(404).json({ message: 'No unread messages found' });
    }

    const users = await User.find({
      _id: { $in: unreadMessages },
    }).select('username fullname email avatar'); 

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};