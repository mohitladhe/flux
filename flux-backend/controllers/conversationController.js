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

module.exports = { createConversation, getConversations, createGroup };
