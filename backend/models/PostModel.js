const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: [
    {
      type: String,
      required: true,
      default: []
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: []
    }
  ],
  tags: [
    {
      type: String,
      required: true,
      default: []
    }
  ],
  underthirteen: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  },
  upeighteen: {
    type: String,
    enum: ["yes", "no"],
    required: true,
  }
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
