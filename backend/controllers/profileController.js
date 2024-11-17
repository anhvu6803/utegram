const User = require('../models/UserModel');

exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }) 
      .populate('followers', 'username')
      .populate('followings', 'username')
      .populate('posts', 'content');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers.length,
      following: user.followings.length,
      posts: user.posts.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body; 
    const { username } = req.params; 
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (targetUser._id.toString() === userId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }
    const isAlreadyFollowing = targetUser.followers.includes(userId);
    if (isAlreadyFollowing) {
      return res.status(400).json({ error: 'You are already following this user' });
    }
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followings: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $addToSet: { followers: userId },
    });

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body; 
    const { username } = req.params; 
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (targetUser._id.toString() === userId) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' });
    }
    const isFollowing = targetUser.followers.includes(userId);
    if (!isFollowing) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { followings: targetUser._id },
    });

    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: userId },
    });

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.checkFollowStatus = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.body.userId; 
    if (!currentUserId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isFollowing = targetUser.followers.includes(currentUserId);
    res.json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};