const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Hey there! I'm using Flux.",
      maxlength: 140,
    },
    status: {
      type: String,
      enum: ["Available", "Busy", "Away", "Do not disturb", "Invisible"],
      default: "Available",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", UserSchema);
