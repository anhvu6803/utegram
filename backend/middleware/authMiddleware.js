
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;  
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });  
    }
    if (user.isAdmin) {
      return next(); 
    } else {
      return res.status(403).json({ message: 'Access denied. Admins only.' }); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const isPostOwner = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (post.user.toString() === req.user._id.toString() || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not the owner of the post.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  isAdmin,
  isPostOwner,
};
