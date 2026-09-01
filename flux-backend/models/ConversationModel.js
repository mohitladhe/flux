const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          return this.type === "group";
        },
      },
    ],
    groupName: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "group";
      },
    },
    groupAvatar: {
      type: String,
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Conversation", ConversationSchema);
