const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bornDay: { type: Date, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
    isAdmin: { type: Boolean, default: false },
    banned: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
