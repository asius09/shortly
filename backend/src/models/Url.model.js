const mongoose = require("mongoose");
const { Schema } = mongoose;
export const UrlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      require: [true, "Original URL is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      require: [true, "Original URL is required"],
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
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
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

UrlSchema.index({ shortCode: 1 });
UrlSchema.index({ user: 1 });
UrlSchema.index({ createdAt: -1 });

export const Url = mongoose.models.Url || mongoose.model("Url", UrlSchema);
