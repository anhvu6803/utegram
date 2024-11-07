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
      username: user.username,
      fullname: user.fullname,
      bio: user.bio,
      avatar: user.avatar,
      followers: user.followers.length,
      following: user.followings.length,
      posts: user.posts.length,
      isFollowing: user.followers.some(follower => follower._id.equals(req.user._id)),  
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
exports.followUser = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const isAlreadyFollowing = await User.exists({
      _id: currentUserId,
      followings: targetUserId,
    });

    if (isAlreadyFollowing) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    await User.updateOne(
      { _id: currentUserId },
      { $addToSet: { followings: targetUserId } }
    );

    await User.updateOne(
      { _id: targetUserId },
      { $addToSet: { followers: currentUserId } }
    );

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.unfollowUser = async (req, res) => {
  try {
    const { currentUserId, targetUserId } = req.body;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'You cannot unfollow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const isFollowing = await User.exists({
      _id: currentUserId,
      followings: targetUserId,
    });

    if (!isFollowing) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    await User.updateOne(
      { _id: currentUserId },
      { $pull: { followings: targetUserId } }
    );

    await User.updateOne(
      { _id: targetUserId },
      { $pull: { followers: currentUserId } }
    );

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};