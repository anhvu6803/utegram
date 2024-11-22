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
  const targetUserId = req.params.uid; 
  const { userId } = req.body; 

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(userId); 

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'Current user not found' });
    }
    let message;
    if (targetUser.followers.includes(userId)) {
      targetUser.followers.pull(userId);
      currentUser.followings.pull(targetUserId);
      message = 'Unfollowed';
    } else {
      targetUser.followers.push(userId); 
      currentUser.followings.push(targetUserId); 
      message = 'Followed';
    }
    await targetUser.save();
    await currentUser.save();

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkFollowStatus = async (req, res) => {
  try {
    const { username } = req.params; 
    const { userId: currentUserId } = req.query;

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
exports.getListFollowerByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).populate('followers', 'username fullname');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};


exports.getListFollowingByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).populate('followings', 'username fullname');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followings: user.followings });
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};