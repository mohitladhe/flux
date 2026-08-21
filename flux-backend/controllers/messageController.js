const messageService = require("../services/messageService");
const asyncHandler = require("../utils/asyncHandler");
const HTTP_STATUS = require("../constants/httpStatus");

const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const result = await messageService.getMessages(conversationId, req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, content } = req.body;
  const result = await messageService.sendMessage(
    conversationId,
    content,
    req.user._id,
  );
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
});

module.exports = { getMessages, sendMessage };
