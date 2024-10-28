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
    const { userId } = req.body; 
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(userId);

    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    if (currentUser.followings.includes(userId))
      return res.status(400).json({ error: 'You are already following this user' });

    currentUser.followings.push(userId);
    targetUser.followers.push(req.user._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(userId);

    if (!targetUser) return res.status(404).json({ error: 'User not found' });
    if (!currentUser.followings.includes(userId))
      return res.status(400).json({ error: 'You are not following this user' });

    currentUser.followings.pull(userId);
    targetUser.followers.pull(req.user._id);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
