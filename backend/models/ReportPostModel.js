const mongoose = require('mongoose');
const reportPostSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'rejected'], 
    default: 'pending', 
  },
}, { timestamps: true });

const ReportPost = mongoose.model('ReportPost', reportPostSchema);
module.exports = ReportPost;
