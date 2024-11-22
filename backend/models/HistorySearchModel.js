const mongoose = require('mongoose');
const historySearchSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'hashtag'], 
    required: true 
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: function () { return this.type === 'user'; } 
  },
  tag: {
    type: String,
    required: function () { return this.type === 'hashtag'; } 
  }
}, { timestamps: true }); 

const HistorySearch = mongoose.model('HistorySearch', historySearchSchema);
module.exports = HistorySearch;
