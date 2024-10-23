const mongoose = require('mongoose');

const reportCommentSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ReportComment = mongoose.model('ReportComment', reportCommentSchema);
module.exports = ReportComment;
