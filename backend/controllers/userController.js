const User = require('../models/UserModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, '-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, fullname, email, bornDay, password } = req.body;

    const newUser = new User({
        username,
        fullname,
        email,
        bornDay,
        password,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};
exports.getAllUsersExcept = async (req, res) => {
    const { userId } = req.params;
    try {
        const users = await User.find({ _id: { $ne: userId } }, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};
exports.getUserHasMorePosts = async (req, res) => {
    const userId = req.params.uid;
    try {
        const usersWithPostCounts = await User.aggregate([
            { $addFields: { postCount: { $size: "$posts" } } }, // Add a post count field
            { $match: { postCount: { $gt: 0 } } }, // Exclude specific user ID and filter by postCount > 1
            { $sort: { postCount: -1 } }, // Sort users by post count in descending order
            { $project: { avatar: 1, username: 1, fullname: 1, followings: 1 } } // Project relevant fields
        ]);

        const filteredUsers = usersWithPostCounts.filter(user => !user._id.equals(userId));

        let postsList = [];

        await Promise.all(
            filteredUsers.map(async (user) => {
                const populatedUser = await User.findById(user._id).populate({
                    path: 'posts',
                    options: { sort: { createdAt: -1 } } // Sort posts by date in descending order
                });

                postsList = postsList.concat(populatedUser.posts.map(post => post.toObject({ getters: true })));
            })
        );

        res.status(200).json({
            users: filteredUsers,
            posts: postsList
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.checkUsernameExists = async (req, res, next) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return res.status(404).json({ message: 'Username not found' });
      }
      res.status(200).json({ message: 'Username exists', userId: user._id });
    } catch (err) {
      res.status(500).json({ message: 'Fetching username failed, please try again' });
    }
  };
  