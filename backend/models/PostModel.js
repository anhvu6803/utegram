const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true
  },
  media: [
    {
      type: {
        type: String,
        enum: ['Image', 'Video'],
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
      ref: 'Comment'
    }
  ],
  tags: [
    {
      type: String,
      required: true
    }
  ]
}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
