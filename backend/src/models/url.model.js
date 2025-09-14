const mongoose = require('mongoose');
const config = require('../config/config');
const { Schema } = mongoose;

const domain = config.DOMAIN;

const UrlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      require: [true, 'Original URL is required'],
      trim: true,
    },
    alias: {
      type: String,
      require: [true, 'Alias is required'],
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    shortUrl: {
      type: String,
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 7 * 24 * 60 * 60, // Auto Delete after 7 days
    },
    click: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

UrlSchema.index({ createdAt: -1 });

UrlSchema.pre('save', function (next) {
  if (this.isModified('originalUrl') || this.isModified('alias')) {
    this.shortUrl = `${domain}/${this.alias}`;
  }
  next();
});

UrlSchema.methods.updateClicks = function (clickCount = 1) {
  this.click = clickCount === 1 ? (this.click += 1) : this.click + clickCount;
};

const Url = mongoose.models.Url || mongoose.model('Url', UrlSchema);
module.exports = Url;
