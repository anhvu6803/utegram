const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail,sendCodeResetPass } = require('../utils/nodemailer');
const { verifyResetCode } = require('../utils/resetCodeService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const unverifiedUsers = {};

const HttpError = require('../models/http-error');

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex');
}

exports.register = async (req, res) => {
    const { username, fullname, email, password, bornDay } = req.body;

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'Email đã tồn tại' });

        const verificationCode = generateVerificationCode();

        unverifiedUsers[email] = {
            username,
            fullname,
            email,
            password,
            bornDay,
            verificationCode,
        };

        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ msg: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const userData = unverifiedUsers[email];
        if (!userData) return res.status(400).json({ msg: 'Người dùng không tồn tại hoặc đã xác thực' });

        if (userData.verificationCode === code) {
            const user = new User({
                username: userData.username,
                fullname: userData.fullname,
                email: userData.email,
                password: userData.password,
                bornDay: userData.bornDay,
                isVerified: true,
            });

            await user.save();
            delete unverifiedUsers[email];
            res.json({ msg: 'Xác thực thành công' });
        } else {
            res.status(400).json({ msg: 'Mã xác thực không chính xác' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Người dùng không tồn tại' });
  
      if (user.banned) {
        return res.status(400).json({ msg: 'Tài khoản của bạn đã bị cấm. Không thể đăng nhập.' });
      }
  
      if (!user.isVerified) {
        return res.status(400).json({ msg: 'Vui lòng xác thực email trước khi đăng nhập.' });
      }
  
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ msg: 'Mật khẩu không đúng' });
  
      const accessToken = jwt.sign(
        { 
          userId: user._id, 
          isAdmin: user.isAdmin, 
          email: user.email, 
          username: user.username, 
          fullname: user.fullname, 
          bornDay: user.bornDay, 
          avatar: user.avatar, 
          following: user.following, 
          bookmark: user.bookmark 
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({ accessToken });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
exports.checkDuplicateUser = async (req, res) => {
    const { email, username } = req.body;
    const errors = {};
  
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) errors.email = 'Email đã tồn tại';
  
      existingUser = await User.findOne({ username });
      if (existingUser) errors.username = 'Tên người dùng đã tồn tại';
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }
  
      res.status(200).json({ msg: 'No duplicates found' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.forgotPassword =  async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Email không tồn tại trong hệ thống!' });
      }
      sendCodeResetPass(email); 
      res.status(200).json({ message: 'Mã đặt lại mật khẩu đã được gửi đến email của bạn.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email. Vui lòng thử lại!' });
    }
  };
  exports.resetPassword = async (req, res) => {
    const { email, code, password } = req.body;

    if (!email || !code || !password) {
        return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin!' });
    }
    const isCodeValid = verifyResetCode(email, code);
    if (!isCodeValid) {
        return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng với email này!' });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!' });
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi! Vui lòng thử lại.' });
    }
};
  exports.getUser = async (req, res, next) => {
    const userId = req.params.pid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a user.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            'Could not find a user for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ user: user.toObject({ getters: true }) });
};
