const User = require("../models/UserModel");
const Conversation = require("../models/ConversationModel");
const HTTP_STATUS = require("../constants/httpStatus");
const ApiError = require("../utils/ApiError");
const { formatConversation } = require("../utils/formatConversation");
const crypto = require("crypto");
const { group } = require("console");

const createConversation = async (participantId, userId) => {
  if (!participantId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Participant is required.");
  }

  const participant = await User.findById(participantId);

  if (!participant) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
  }

  if (participantId.toString() === userId.toString()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "You cannot create a conversation with yourself.",
    );
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [userId, participantId],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, participantId],
    });
  }

  conversation = await Conversation.findById(conversation._id).populate({
    path: "participants",
    select: "username name avatar isOnline",
  });

  return formatConversation(conversation, userId);
};

const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate({
      path: "participants",
      select: "username name avatar isOnline",
    })
    .populate({
      path: "lastMessage",
      select: "content sender createdAt type",
      populate: {
        path: "sender",
        select: "username name",
      },
    })
    .sort({ updatedAt: -1 });

  return conversations.map((conversation) =>
    formatConversation(conversation, userId),
  );
};

const createGroup = async (groupName, participants, userId) => {
  if (!groupName?.trim() || !Array.isArray(participants)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Group Name and participants is required.",
    );
  }
  console.log(participants);

  const uniqueParticipants = [...new Set([userId, ...participants])];
  if (uniqueParticipants.length < 2) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Select at least two members.");
  }

  const users = await User.find({
    _id: { $in: uniqueParticipants },
  });

  if (users.length !== uniqueParticipants.length) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "One or more group members are invalid.",
    );
  }

  let conversation = await Conversation.create({
    type: "group",
    participants: uniqueParticipants,
    groupName: groupName,
    admins: [userId],
    groupCreator: userId,
  });

  conversation = await Conversation.findById(conversation._id)
    .populate({
      path: "participants",
      select: "username name avatar isOnline",
    })
    .populate({
      path: "admins",
      select: "username name avatar isOnline",
    })
    .populate({
      path: "groupCreator",
      select: "username name avatar isOnline",
    });

  return formatConversation(conversation, userId);
};

const updateAdminStatus = async (conversationId, memberId, userId, isAdmin) => {
  if (!conversationId || !memberId) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Conversation ID & Member ID is required",
    );
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation not found");
  }

  if (conversation.type !== "group") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This operation is only available for group conversations.",
    );
  }

  const isCurrentUserParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );
  if (!isCurrentUserParticipant) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }

  const isMemberParticipant = conversation.participants.some(
    (participant) => participant.toString() === memberId.toString(),
  );
  if (!isMemberParticipant) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Member is not a participant of this conversation.",
    );
  }

  if (
    !conversation.groupCreator ||
    conversation.groupCreator.toString() !== userId.toString()
  ) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "You are unauthorized for this operation.",
    );
  }

  const isMemberAdmin = conversation.admins.some(
    (admin) => admin.toString() === memberId.toString(),
  );

  if (isAdmin) {
    if (isMemberAdmin) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Member is already an Admin.");
    }

    conversation.admins.push(memberId);
  } else {
    if (!isMemberAdmin) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Member is not an Admin.");
    }
    conversation.admins = conversation.admins.filter(
      (admin) => admin.toString() !== memberId.toString(),
    );
  }

  await conversation.save();

  const updatedConversation = await Conversation.findById(
    conversation._id,
  ).populate({ path: "participants", select: "username name avatar isOnline" });

  return formatConversation(updatedConversation, userId);
};

const removeMember = async (conversationId, memberId, userId) => {
  if (!conversationId || !memberId) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "COnversation ID & Member ID required.",
    );
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation not found.");
  }

  if (conversation.type !== "group") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This operation is only available for group conversations.",
    );
  }

  const isCurrentUserParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );
  if (!isCurrentUserParticipant) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }

  console.log("REMOVE MEMBER DEBUG", {
    conversationId: conversation._id.toString(),
    requestedMemberId: String(memberId),
    participants: conversation.participants.map((participant) =>
      participant.toString(),
    ),
  });
  const isMemberParticipant = conversation.participants.some(
    (participant) => participant.toString() === memberId.toString(),
  );
  if (!isMemberParticipant) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Member is not a participant of this conversation.",
    );
  }

  const isCurrentUserAdmin = conversation.admins.some(
    (admin) => admin.toString() === userId.toString(),
  );

  const isCurrentUserGroupCreator =
    conversation.groupCreator &&
    conversation.groupCreator.toString() === userId.toString();

  const isMemberAdmin = conversation.admins.some(
    (admin) => admin.toString() === memberId.toString(),
  );

  const isMemberGroupCreator =
    conversation.groupCreator &&
    conversation.groupCreator.toString() === memberId.toString();

  if (!isCurrentUserAdmin && !isCurrentUserGroupCreator) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are unauthorized for this operation.",
    );
  }

  if (isMemberGroupCreator) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "The group creator cannot be removed.",
    );
  }

  if (isCurrentUserAdmin && !isCurrentUserGroupCreator && isMemberAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Admins cannot remove other admins.",
    );
  }

  conversation.participants = conversation.participants.filter(
    (participant) => participant.toString() !== memberId.toString(),
  );

  conversation.admins = conversation.admins.filter(
    (admin) => admin.toString() !== memberId.toString(),
  );

  await conversation.save();

  const updatedConversation = await Conversation.findById(
    conversation._id,
  ).populate({
    path: "participants",
    select: "username name avatar isOnline",
  });

  return formatConversation(updatedConversation, userId);
};

const addMember = async (conversationId, memberId, userId) => {
  if (!conversationId || !memberId) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Conversation ID & Member ID are required.",
    );
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Converation not found.");
  }

  if (conversation.type !== "group") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "This operation is only available for group conversations.",
    );
  }

  const isCurrentUserParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );

  if (!isCurrentUserParticipant) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You are not a participant of this conversation.",
    );
  }

  const isCurrentUserAdmin = conversation.admins.some(
    (admin) => admin.toString() === userId.toString(),
  );

  if (!isCurrentUserAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only group admins can add members.",
    );
  }

  const isAlreadyMember = conversation.participants.some(
    (participant) => participant.toString() === memberId.toString(),
  );

  if (isAlreadyMember) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "User is already a member of this group.",
    );
  }

  conversation.participants.push(memberId);

  await conversation.save();

  const updatedConversation = await Conversation.findById(
    conversation._id,
  ).populate({
    path: "participants",
    select: "username name avatar isOnline",
  });

  return formatConversation(updatedConversation, userId);
};

const INVITE_EXPIRY_DATE = 7;

const hashInviteToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateGroupInvite = async (conversationId, userId) => {
  if (!conversationId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Conversation ID is required.");
  }

  if (!userId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User ID is required.");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversaton not found.");
  }

  if (conversation.type !== "group") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invites are only available for groups.",
    );
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString(),
  );

  const isAdmin = conversation.admins.some(
    (admin) => admin.toString() === userId.toString(),
  );

  if (!isParticipant || !isAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only group admins can generate the invite links.",
    );
  }

  const token = crypto.randomBytes(32).toString("hex");

  conversation.inviteTokenHash = hashInviteToken(token);
  conversation.inviteExpiresAt = new Date(
    Date.now() + INVITE_EXPIRY_DATE * 24 * 60 * 60 * 1000,
  );

  conversation.inviteRevokedAt = null;

  await conversation.save();

  return {
    token,
    expiresAt: conversation.inviteExpiresAt,
  };
};

const getGroupInvitePreview = async (token) => {
  if (!token) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Token is required.");
  }

  if (!/^[a-f0-9]{64}$/i.test(token || "")) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Invite Link.");
  }

  const conversation = await Conversation.findOne({
    inviteTokenHash: hashInviteToken(token),
    inviteExpiresAt: { $gt: new Date() },
    inviteRevokedAt: null,
    type: "group",
  }).select("+inviteTokenHash");

  if (!conversation) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "The invite link is invalid, expired or revoked.",
    );
  }

  return {
    groupId: conversation._id,
    groupName: conversation.groupName,
    groupAvatarP: conversation.groupAvatar,
    memberCount: conversation.participants.length,
  };
};

const joinGroupByInvite = async (token, userId) => {
  if (!token || !userId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Token & User ID is required.");
  }

  if (!/^[a-f0-9]{64}$/i.test(token || "")) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid Invite Link.");
  }

  const conversation = await Conversation.findOne({
    inviteTokenHash: hashInviteToken(token),
    inviteExpiresAt: { $gt: new Date() },
    inviteRevokedAt: null,
    type: "group",
  }).select("+inviteTokenHash");

  if (!conversation) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,
      "The invite link is invalid, expired or revoked.",
    );
  }

  const isAlreadyMember = conversation.participants.some(
    (admin) => admin.toString() === userId.toString(),
  );

  if (isAlreadyMember) {
    return {
      groupId: conversation._id,
      alreadyMember: true,
    };
  }

  conversation.participants.addToSet(userId);
  await conversation.save();

  return {
    groupId: conversation._id,
    alreadyMember: false,
  };
};

const revokeGroupInvite = async (conversationId, userId) => {
  if (!conversationId || !userId) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Conversation ID & User ID is required.",
    );
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Conversation not found.");
  }

  const isAdmin = conversation.admins.some(
    (admin) => admin.toString() === userId.toString(),
  );
  if (!isAdmin) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Only group admins can revoke invite links.",
    );
  }

  conversation.inviteTokenHash = null;
  conversation.inviteExpiresAt = null;
  conversation.inviteRevokedAt = new Date();

  await conversation.save();

  return { revoked: true };
};

module.exports = {
  createConversation,
  getConversations,
  createGroup,
  updateAdminStatus,
  removeMember,
  addMember,
  generateGroupInvite,
  getGroupInvitePreview,
  joinGroupByInvite,
  revokeGroupInvite,
};
