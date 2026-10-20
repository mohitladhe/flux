const HTTP_STATUS = require("../constants/httpStatus");
const conversationService = require("../services/conversationService");
const asyncHandler = require("../utils/asyncHandler");

const createConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;
  const result = await conversationService.createConversation(
    participantId,
    req.user._id,
  );
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: result,
  });
});

const getConversations = asyncHandler(async (req, res) => {
  const result = await conversationService.getConversations(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const createGroup = asyncHandler(async (req, res) => {
  console.log("BODY: " + req.body);
  const { groupName, participants } = req.body;
  const result = await conversationService.createGroup(
    groupName,
    participants,
    req.user._id,
  );
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const updateAdminStatus = asyncHandler(async (req, res) => {
  const { conversationId, memberId } = req.params;
  const { isAdmin } = req.body;

  const result = await conversationService.updateAdminStatus(
    conversationId,
    memberId,
    req.user._id,
    isAdmin,
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const removeMember = asyncHandler(async (req, res) => {
  const { conversationId, memberId } = req.params;

  const result = await conversationService.removeMember(
    conversationId,
    memberId,
    req.user._id,
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const addMember = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { memberId } = req.body;

  const result = await conversationService.addMember(
    conversationId,
    memberId,
    req.user._id,
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const generateGroupInvite = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const result = await conversationService.generateGroupInvite(
    conversationId,
    req.user._id,
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const getGroupInvitePreview = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const result = await conversationService.getGroupInvitePreview(token);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const joinGroupByInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const result = await conversationService.joinGroupByInvite(token, req.user._id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const revokeGroupInvite = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const result = await conversationService.revokeGroupInvite(
    conversationId,
    req.user._id,
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

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
