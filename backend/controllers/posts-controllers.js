const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/PostModel');
const User = require('../models/UserModel')

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a post.',
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      'Could not find a post for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ post: post.toObject({ getters: true }) });
};


const getPostsByUserId = async (req, res, next) => {

};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { caption, type, url, author, tags, underthirteen, upeighteen } = req.body;

  // const title = req.body.title;
  const createdPost = new Post({
    caption,
    type,
    url,
    author,
    tags,
    underthirteen,
    upeighteen
  });

  let user;
  try {
    user = await User.findById(author);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(createdPost);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
    return next(error);
  }

  console.log(createdPost);

  res.status(201).json({ post: createdPost });
};

const updatePost = async (req, res, next) => {

};

const deletePost = async (req, res, next) => {

};

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
