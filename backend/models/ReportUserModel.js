const mongoose = require('mongoose');
const reportUserSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ReportUser = mongoose.model('ReportUser', reportUserSchema);
module.exports = ReportUser;
