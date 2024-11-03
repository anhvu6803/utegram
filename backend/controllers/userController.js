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