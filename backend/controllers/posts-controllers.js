const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;

const HttpError = require('../models/http-error');
const Post = require('../models/PostModel');
const User = require('../models/UserModel')

const { io } = require('../socket/socket')

cloudinary.config({
  cloud_name: 'dbmynlh3f',
  api_key: '779215831745688',
  api_secret: 'xEetS7q-OzgmxfRngKoljJcd3Lc',
  secure: true,
});


const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  const { age, authorId } = req.query;

  let post;
  try {
    post = await Post.findById(postId);

    post = post.toObject({ getters: true }); // Chuyển đổi Mongoose Document thành Object thuần

    if (age < 18 && post.upeighteen === 'yes' && !authorId?.includes(post?.author)) {
      post.url = [
        "https://res.cloudinary.com/dbmynlh3f/image/upload/v1733123869/Hidden%20Image/i9vh1gxlpocu0ctpmm5a.png",
      ];
    }

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

  res.json({ post: post });
};

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  const { age } = req.query;

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

  const updatedUserWithPosts = [];
  const userWithPostsObject = userWithPosts.posts.map(post => post.toObject({ getters: true }));

  for (const post of userWithPostsObject) {
    if (age < 18 && post.upeighteen === 'yes') {

      post.url = [
        "https://res.cloudinary.com/dbmynlh3f/image/upload/v1733123869/Hidden%20Image/i9vh1gxlpocu0ctpmm5a.png",
      ];
    }

    updatedUserWithPosts.push(post)
  }

  res.json({ posts: updatedUserWithPosts });
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

const getPostsByUserFollowing = async (req, res, next) => {
  const userId = req.params.uid;

  const { age } = req.query;
  // let places;
  let followings;
  try {
    followings = await User.findById(userId).populate({
      path: 'followings',
    });
  } catch (err) {
    const error = new HttpError(
      'Fetching user failed, please try again later.',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!followings || followings.followings.length === 0) {
    return next(
      new HttpError('Could not find posts for the provided user id.', 404)
    );
  }

  let postsOfFollowing = [];

  try {
    for (const following of followings.followings) {
      const posts = await User.findById(following._id).populate({
        path: 'posts',
        populate: {
          path: 'author', // Đây là trường liên kết tới following
          select: 'username avatar fullname', // Chọn các trường bạn muốn từ following
        },
      })
      for (const post of posts.posts) {
        if (age < 13 && post.underthirteen === 'yes') {
          postsOfFollowing.push(post);
        }
        else if (age >= 18 && post.upeighteen === 'yes') {
          postsOfFollowing.push(post);
        }
        else if (age >= 13 && age < 18 &&
          post.underthirteen === 'no' && post.upeighteen === 'no') {
          postsOfFollowing.push(post);
        }
      }
    }

  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({ posts: postsOfFollowing.map(post => post.toObject({ getters: true })) });
};

const checkImagePost = async (req, res, next) => {
  const picpurifyUrl = 'https://www.picpurify.com/analyse/1.1';

  const form = new FormData();

  const { image, publicId } = req.body

  form.append('url_image', image);
  form.append('API_KEY', 'R5UKlPg9CDbT3P7Oy8tFtxgP3rKuyBE7');
  form.append('task', 'porn_moderation,drug_moderation,gore_moderation');


  try {
    const response = await axios.post(picpurifyUrl, form, {
      headers: form.getHeaders()
    });

    if (response.data.final_decision === 'KO') {

      await cloudinary.uploader.destroy(publicId);
    }

    res.status(201).json({ final_decision: response.data.final_decision });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to check post', error: error.message }); // Handle any errors
  };
}

const checkVideoPost = async (req, res, next) => {
  const picpurifyUrl = 'https://www.picpurify.com/analyse_video/1.0';
  const { video, publicId } = req.body;

  // Tạo form data cho yêu cầu
  const form = new FormData();
  form.append('url_video', video);
  form.append('API_KEY', 'R5UKlPg9CDbT3P7Oy8tFtxgP3rKuyBE7');
  form.append('frame_interval', 1);
  form.append('task', 'porn_moderation,drug_moderation,gore_moderation');

  try {
    // Gửi yêu cầu tới Picpurify và đính kèm headers từ form data
    const response = await axios.post(picpurifyUrl, form, {
      headers: form.getHeaders()
    });

    if (response.data.final_decision === 'KO') {
      await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
    // Trả về kết quả với các tiêu chí bị từ chối (nếu có)
    res.status(201).json({ final_decision: response.data.final_decision });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check post', error: error.message });
  }
}

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { caption, tags, underthirteen, upeighteen } = req.body;
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update post.',
      500
    );
    return next(error);
  }

  post.caption = caption;
  post.tags = tags;
  post.underthirteen = underthirteen;
  post.upeighteen = upeighteen;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update post.',
      500
    );
    return next(error);
  }

  res.status(200).json({ post: post.toObject({ getters: true }) });
};

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId).populate('author');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }

  console.log(post)

  const sess = await mongoose.startSession();
  try {
    sess.startTransaction();
    await post.deleteOne({ session: sess });
    post.author.posts.pull(post._id);
    await post.author.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();

    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();

    const error = new HttpError(
      'Something went wrong, could not delete the post.',
      500
    );
    return next(error);
  }
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
const getImagePostsByUsername = async (req, res, next) => {
  const username = req.params.username;

  const { age, author } = req.query;

  let user;
  let posts;

  try {

    user = await User.findOne({ username: username });

    if (!user) {
      const error = new HttpError('User not found with the given username.', 404);
      return next(error);
    }
    posts = await Post.find({ author: user._id, type: 'image' }).populate('author', 'username avatar');
  } catch (err) {
    const error = new HttpError('Fetching image posts failed, please try again later.', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    return next(new HttpError('No image posts found for the given user username.', 404));
  }

  const updatedUserWithPosts = [];
  const userWithPostsObject = posts.map(post => post.toObject({ getters: true }));

  for (const post of userWithPostsObject) {
    if (age < 18 && post.upeighteen === 'yes' && username !== author) {

      post.url = [
        "https://res.cloudinary.com/dbmynlh3f/image/upload/v1733123869/Hidden%20Image/i9vh1gxlpocu0ctpmm5a.png",
      ];
    }

    updatedUserWithPosts.push(post)
  }

  res.json({ posts: updatedUserWithPosts });
};
const getVideoPostsByUsername = async (req, res, next) => {
  const username = req.params.username;  // Get username from the URL parameter

  const { age, author } = req.query;

  let user;
  let posts;

  try {
    // Find the user by username
    user = await User.findOne({ username: username });

    if (!user) {
      const error = new HttpError('User not found with the given username.', 404);
      return next(error);
    }

    // Fetch posts by the user's ID and type 'video'
    posts = await Post.find({ author: user._id, type: 'video' }).populate('author', 'username avatar');
  } catch (err) {
    const error = new HttpError('Fetching video posts failed, please try again later.', 500);
    return next(error);
  }

  if (!posts || posts.length === 0) {
    return next(new HttpError('No video posts found for the given user username.', 404));
  }

  const updatedUserWithPosts = [];
  const userWithPostsObject = posts.map(post => post.toObject({ getters: true }));

  for (const post of userWithPostsObject) {
    if (age < 18 && post.upeighteen === 'yes' && username !== author) {

      post.url = [
        "https://res.cloudinary.com/dbmynlh3f/image/upload/v1733123869/Hidden%20Image/i9vh1gxlpocu0ctpmm5a.png",
      ];
    }

    updatedUserWithPosts.push(post)
  }

  res.json({ posts: updatedUserWithPosts });
};
const getBookmarkedPostsByUsername = async (req, res, next) => {
  const username = req.params.username;
  const { age, author } = req.query;

  let userWithBookmarks;

  try {
    userWithBookmarks = await User.findOne({ username: username }).populate({
      path: 'bookmarks',
      populate: {
        path: 'author',
        select: 'username avatar',
      }
    });

    if (!userWithBookmarks || userWithBookmarks.bookmarks.length === 0) {
      return next(new HttpError('No bookmarked posts found for the given user username.', 404));
    }
  } catch (err) {
    const error = new HttpError('Fetching bookmarked posts failed, please try again later.', 500);
    return next(error);
  }

  const updatedUserWithPosts = [];
  const userWithPostsObject = userWithBookmarks.bookmarks.map(post => post.toObject({ getters: true }));

  for (const post of userWithPostsObject) {
    if (age < 18 && post.upeighteen === 'yes' && username !== author) {

      post.url = [
        "https://res.cloudinary.com/dbmynlh3f/image/upload/v1733123869/Hidden%20Image/i9vh1gxlpocu0ctpmm5a.png",
      ];
    }

    updatedUserWithPosts.push(post)
  }

  res.json({ posts: updatedUserWithPosts });
};

const bookmarkPost = async (req, res, next) => {
  const postId = req.params.pid;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let message;
    if (user.bookmarks.includes(postId)) {
      user.bookmarks.pull(postId);
      message = 'Unbookmarked';
    } else {
      user.bookmarks.push(postId);
      message = 'Bookmarked';
    }
    console.log(postId)
    await user.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
const getRandomPostsVideoExcludeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 9 } = req.query;
    const skip = (page - 1) * limit;
    const posts = await Post.aggregate([
      { $match: { author: { $ne: userId }, type: 'video' } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    return res.json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
const getRandomPostsExcludeUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { page = 1, limit = 9 } = req.query;
    const skip = (page - 1) * limit;
    const posts = await Post.aggregate([
      { $match: { author: { $ne: userId } } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

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
exports.getPostsByUserFollowing = getPostsByUserFollowing;
exports.checkImagePost = checkImagePost;
exports.checkVideoPost = checkVideoPost;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.likePost = likePost;
exports.getImagePostsByUsername = getImagePostsByUsername;
exports.getVideoPostsByUsername = getVideoPostsByUsername;
exports.getBookmarkedPostsByUsername = getBookmarkedPostsByUsername;
exports.bookmarkPost = bookmarkPost;
exports.getPostByTag = getPostByTag;
exports.getRandomPostsVideoExcludeUser = getRandomPostsVideoExcludeUser;
exports.getRandomPostsExcludeUser = getRandomPostsExcludeUser;