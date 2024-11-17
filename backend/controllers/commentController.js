const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/PostModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');

const { io } = require('../socket/socket')

const getRepliesByCommentId = async (req, res, next) => {
  const commentId = req.params.cid; // Assuming `postId` is the correct route parameter.

  let commentWithRelies;
  try {
    commentWithRelies = await Comment.findById(commentId).populate({
      path: 'replies',
      populate: {
        path: 'author', // Populate the author field in each reply
        model: 'User',  // Model name for the user (assuming your User model is named 'User')
        select: 'username avatar' // Specify fields to include, like name and email
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching likes failed, please try again later.',
      500
    );
    return next(error);
  }

  // Check if the post exists and has likes
  if (!commentWithRelies || commentWithRelies.replies.length === 0) {
    return next(
      new HttpError('Could not find likes for the provided post id.', 404)
    );
  }

  res.json({ replies: commentWithRelies.replies.map(reply => reply.toObject({ getters: true })) });
};


const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { text, type = 'comment', author, post } = req.body;

  const createdComment = new Comment({
    text,
    type,
    author,
    post
  });

  let user;
  try {
    user = await User.findById(author);
  } catch (err) {
    const error = new HttpError('Creating user failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  let _post;
  try {
    _post = await Post.findById(post);
    console.log(_post);
  } catch (err) {
    const error = new HttpError('Creating post failed, please try again', 500);
    return next(error);
  }

  if (!_post) {
    const error = new HttpError('Could not find post for provided id', 404);
    return next(error);

  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });
    _post.comments.push(createdComment);
    await _post.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating comment failed, please try again.',
      500
    );
    return next(error);
  }

  let userNameOfAuthor;
  try {
    userNameOfAuthor = await Comment.findById(createdComment._id).populate({
      path: 'author', // Populate the author field in each reply
      model: 'User',  // Model name for the user (assuming your User model is named 'User')
      select: 'username avatar' // Specify fields to include, like name and email
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }

  io.emit('submitComment', { userNameOfAuthor });
  res.status(201).json({ comment: userNameOfAuthor });
};

const createRely = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const commentId = req.params.cid;
  const { text, type = 'reply', author, post } = req.body;

  const createdComment = new Comment({
    text,
    type,
    author,
    post
  });

  let user;
  try {
    user = await User.findById(author);
  } catch (err) {
    const error = new HttpError('Creating user failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  let _post;
  try {
    _post = await Post.findById(post);
    console.log(_post);
  } catch (err) {
    const error = new HttpError('Creating post failed, please try again', 500);
    return next(error);
  }

  if (!_post) {
    const error = new HttpError('Could not find post for provided id', 404);
    return next(error);

  }

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError('Creating comment failed, please try again', 500);
    return next(error);
  }
  if (!comment) {
    const error = new HttpError('Could not find comment for provided id', 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdComment.save({ session: sess });
    comment.replies.push(createdComment)
    await comment.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating comment failed, please try again.',
      500
    );
    return next(error);
  }

  let userNameOfAuthor;
  try {
    userNameOfAuthor = await Comment.findById(createdComment._id).populate({
      path: 'author', // Populate the author field in each reply
      model: 'User',  // Model name for the user (assuming your User model is named 'User')
      select: 'username avatar' // Specify fields to include, like name and email
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }
  io.emit('submitReply', { userNameOfAuthor, commentId });
  res.status(201).json({ comment: userNameOfAuthor, commentId });
};

const deleteComment = async (req, res, next) => {
  const commentId = req.params.cid;

  let comment;
  try {
    comment = await Comment.findById(commentId).populate('post');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comment.',
      500
    );
    return next(error);
  }

  if (!comment) {
    const error = new HttpError('Could not find comment for this id.', 404);
    return next(error);
  }

  let replies;
  try {
    replies = await Comment.findById(commentId).populate('replies');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete replies.',
      500
    );
    return next(error);
  }

  if (replies.replies.length > 0) {
    try {
      for (const reply of replies.replies) {
        await Comment.findByIdAndRemove(reply._id);
      }
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not delete place.',
        500
      );
      return next(error);
    }

    comment.replies = [];
    await comment.save();
  }

  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();
    await comment.deleteOne({ session: sess });
    comment.post.comments.pull(comment._id);
    await comment.post.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();

    const error = new HttpError(
      'Something went wrong, could not delete the comment.',
      500
    );
    return next(error);
  }
};

const deleteReply = async (req, res, next) => {
  const repliesId = req.params.cid;
  const { commentId } = req.body;
  let reply;
  let comment;
  try {
    reply = await Comment.findById(repliesId);
    comment = await Comment.findById(commentId).populate('replies');

  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comment.',
      500
    );
    return next(error);
  }

  if (!reply && !comment) {
    const error = new HttpError('Could not find comment for this id.', 404);
    return next(error);
  }

  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();
    await reply.deleteOne({ session: sess });
    comment.replies.pull(reply._id);
    await comment.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();

    res.status(200).json({ message: 'Reply deleted successfully.' });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();

    const error = new HttpError(
      'Something went wrong, could not delete the reply.',
      500
    );
    return next(error);
  }
};

const likeComment = async (req, res, next) => {
  const commentId = req.params.cid;
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    let message;
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId); // Unlike
      message = 'Comment unliked';
    } else {
      comment.likes.push(userId); // Like
      message = 'Comment liked';
    }
    await comment.save();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    io.emit('updateLikesComment', { commentId, likesCount: comment.likes.length, user: user, message: message, type: comment.type });

    res.status(200).json({
      success: true,
      message,
      likesCount: comment.likes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRepliesByCommentId = getRepliesByCommentId;
exports.createComment = createComment;
exports.createRely = createRely;
exports.deleteComment = deleteComment;
exports.deleteReply = deleteReply;
exports.likeComment = likeComment;
