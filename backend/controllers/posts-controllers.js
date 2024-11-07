const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Post = require('../models/PostModel');
const User = require('../models/UserModel')

const { io } = require('../socket/socket')

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
  const userId = req.params.uid;

  // let places;
  let userWithPosts;
  try {
    userWithPosts = await User.findById(userId).populate({
      path: 'posts',
      options: { sort: { createdAt: -1 }, limit: 6 } // Sort by date descending and limit to 6
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPosts || userWithPosts.posts.length === 0) {
    return next(
      new HttpError('Could not find posts for the provided user id.', 404)
    );
  }

  res.json({ posts: userWithPosts.posts.map(post => post.toObject({ getters: true })) });
};

const getUsersByPostId = async (req, res, next) => {
  const postId = req.params.pid; // Assuming `postId` is the correct route parameter.

  let postWithLikes;
  try {
    postWithLikes = await Post.findById(postId).populate({ path: 'likes' });
  } catch (err) {
    const error = new HttpError(
      'Fetching likes failed, please try again later.',
      500
    );
    return next(error);
  }

  // Check if the post exists and has likes
  if (!postWithLikes || postWithLikes.likes.length === 0) {
    return next(
      new HttpError('Could not find likes for the provided post id.', 404)
    );
  }

  res.json({ users: postWithLikes.likes.map(user => user.toObject({ getters: true })) });
};

const getCommentsByPostId = async (req, res, next) => {
  const postId = req.params.pid; // Assuming `postId` is the correct route parameter.

  let postWithComments;
  try {
    postWithComments = await Post.findById(postId).populate({
      path: 'comments',
      populate: {
        path: 'author', // Populate the author field in each reply
        model: 'User',  // Model name for the user (assuming your User model is named 'User')
        select: 'username avatar' // Specify fields to include, like name and email
      }
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching comments failed, please try again later.',
      500
    );
    return next(error);
  }

  // Check if the post exists and has likes
  if (!postWithComments || postWithComments.comments.length === 0) {
    return next(
      new HttpError('Could not find comments for the provided post id.', 404)
    );
  }

  res.json({ comments: postWithComments.comments.map(comment => comment.toObject({ getters: true })) });
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

const likePost = async (req, res, next) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Toggle like/unlike
    let message;
    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Unlike
      message = 'Post unliked';
    } else {
      post.likes.push(userId); // Like
      message = 'Post liked';
    }

    await post.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Đảm bảo phát lại cả `postId` và `likesCount`
    io.emit('updateLikes', { postId, likesCount: post.likes.length, user: user, message: message });

    res.status(200).json({
      success: true,
      message,
      likesCount: post.likes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getImagePostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;  

  let posts;
  try {
    posts = await Post.find({ author: userId, type: 'image' }).populate('author', 'username avatar');
  } catch (err) {
    const error = new HttpError('Fetching image posts failed, please try again later.', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    return next(new HttpError('No image posts found for the given user id.', 404));
  }
  res.json({
    posts: posts.map(post => post.toObject({ getters: true }))
  });
};
const getVideoPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;  

  let posts;
  try {
    posts = await Post.find({ author: userId, type: 'video' }).populate('author', 'username avatar');
  } catch (err) {
    const error = new HttpError('Fetching video posts failed, please try again later.', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    return next(new HttpError('No video posts found for the given user id.', 404));
  }
  res.json({
    posts: posts.map(post => post.toObject({ getters: true }))
  });
};
const getBookmarkedPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid; 

  let userWithBookmarks;
  try {
    userWithBookmarks = await User.findById(userId).populate({
      path: 'bookmarks',
      populate: {
        path: 'author',
        select: 'username avatar', 
      }
    });
  } catch (err) {
    const error = new HttpError('Fetching bookmarked posts failed, please try again later.', 500);
    return next(error);
  }

  if (!userWithBookmarks || userWithBookmarks.bookmarks.length === 0) {
    return next(new HttpError('No bookmarked posts found for the given user id.', 404));
  }

  res.json({
    posts: userWithBookmarks.bookmarks.map(post => post.toObject({ getters: true }))
  });
};
const bookmarkPost = async (req, res, next) => {
  const { userId, postId } = req.body; 

  let user, post;
  try {
    user = await User.findById(userId);
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError('Failed to find user or post, please try again.', 500);
    return next(error);
  }

  if (!user || !post) {
    return next(new HttpError('User or post not found.', 404));
  }

  if (user.bookmarks.includes(postId)) {
    return next(new HttpError('This post is already bookmarked.', 400));
  }

  try {
    user.bookmarks.push(postId);
    await user.save();
  } catch (err) {
    const error = new HttpError('Failed to bookmark the post, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ message: 'Post bookmarked successfully.' });
};
const unbookmarkPost = async (req, res, next) => {
  const { userId, postId } = req.body; 

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Failed to find user, please try again.', 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError('User not found.', 404));
  }

  if (!user.bookmarks.includes(postId)) {
    return next(new HttpError('This post is not bookmarked.', 400));
  }

  try {
    user.bookmarks.pull(postId);
    await user.save();
  } catch (err) {
    const error = new HttpError('Failed to unbookmark the post, please try again.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Post removed from bookmarks successfully.' });
};


const getPostByTag = async (req, res) => {
  try {
    let { tag } = req.params;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }
    tag = decodeURIComponent(tag);

    const posts = await Post.find({
      tags: { $in: [tag] }
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found with this tag" });
    }

    return res.status(200).json(posts);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getRandomVideoPostsExcludeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 10 } = req.query; 
    const skip = (page - 1) * limit;
    const posts = await Post.find({
      type: 'video', 
      author: { $ne: userId }, 
    })
      .skip(skip) 
      .limit(parseInt(limit)) 
      .populate('author', 'username') 
      .populate('likes', 'username') 
      .populate('comments') 
      .sort({ createdAt: -1 }); 
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.getUsersByPostId = getUsersByPostId;
exports.getCommentsByPostId = getCommentsByPostId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.likePost = likePost;
exports.getImagePostsByUserId = getImagePostsByUserId;
exports.getVideoPostsByUserId = getVideoPostsByUserId;
exports.getBookmarkedPostsByUserId = getBookmarkedPostsByUserId;
exports.bookmarkPost = bookmarkPost;
exports.unbookmarkPost = unbookmarkPost;
exports.getPostByTag = getPostByTag;
exports.getRandomVideoPostsExcludeUser = getRandomVideoPostsExcludeUser;