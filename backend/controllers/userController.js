const User = require('../models/UserModel');
const Message = require('../models/MessageModel');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

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
exports.updateInformationUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { avatar, bio, gender } = req.body;
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find user.',
            500
        );
        return next(error);
    }

    user.avatar = avatar;
    user.bio = bio;
    user.gender = gender;

    try {
        await user.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update post.',
            500
        );
        return next(error);
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
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

    const { age } = req.query;

    try {
        const usersWithPostCounts = await User.aggregate([
            { $addFields: { postCount: { $size: "$posts" } } },
            { $match: { postCount: { $gt: 0 } } },
            { $sort: { postCount: -1 } },
            { $project: { avatar: 1, username: 1, fullname: 1, followings: 1 } }
        ]);

        const filteredUsers = usersWithPostCounts.filter(user => !user._id.equals(userId));

        res.status(200).json({
            users: filteredUsers,
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
exports.getUsersInteractedWith = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId).select('followings');
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        const messages = await Message.find({
          $or: [{ senderId: userId }, { recipientId: userId }]
        });
    
        const messageUserIds = [
          ...new Set(
            messages
              .map((message) => message.senderId)
              .concat(messages.map((message) => message.recipientId))
              .filter((id) => id !== userId) 
          ),
        ];
    
        const allUserIds = [
          ...new Set([
            ...messageUserIds,
            ...user.followings.map((following) => following.toString()), 
          ]),
        ];
    
        const users = await User.find({
          _id: { $in: allUserIds },
        });
    
        res.status(200).json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};
exports.getFollowDataByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId)
            .populate('followings', 'username avatar fullname')
            .populate('followers', 'username avatar fullname');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            following: user.followings,
            followers: user.followers,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.banUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.banned) {
            return res.status(400).json({ message: "User is already banned" });
        }

        user.banned = true;
        await user.save();

        res.status(200).json({ message: "User has been banned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.unbanUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        if (!user.banned) {
            return res.status(400).json("User is not banned");
        }

        user.banned = false;
        await user.save();

        return res.status(200).json("User has been unbanned successfully");
    } catch (err) {
        console.error(err);
        return res.status(500).json("Internal server error");
    }
};
exports.searchUser = async (req, res, next) => {
    const { query, userId } = req.query;
    if (!query || query.trim() === "") {
        return res.status(400).json({ error: "Từ khóa tìm kiếm không được để trống." });
    }

    try {
        const users = await User.aggregate([
            {
                $match: {
                    username: { $regex: query, $options: "i" }, // Tìm kiếm chuỗi con bất kỳ trong username
                }
            },
            { $sample: { size: 5 } }, // Lấy 5 kết quả ngẫu nhiên
            {
                $project: {
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1
                }
            }
        ]);

        const exceptUser = users.filter((item) => item._id.toString() !== userId);

        res.json(exceptUser);
    } catch (err) {
        res.status(500).json({ error: "Có lỗi xảy ra khi tìm kiếm." });
    }
};

