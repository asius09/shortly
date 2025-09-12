const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/config');
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

UserSchema.index({ email: 1 });

UserSchema.pre('save', async (next) => {
  if (!this.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, config.saltRound);
  this.password = hash;
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
