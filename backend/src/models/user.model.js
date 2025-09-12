const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const { createToken } = require('../utils/jwtToken');
const SALT_ROUND = Number(config.saltRound);
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },

    refreshToken: {
      type: String,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// UserSchema.index({ email: 1 });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, SALT_ROUND);
  this.password = await hash;
  next();
});

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createRefreshToken = function () {
  const refreshToken = createToken({
    id: this._id,
    tokenVersion: this.tokenVersion,
  });

  this.refreshToken = refreshToken;
  this.save();

  return refreshToken;
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
