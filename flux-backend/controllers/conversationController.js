const conversationService = require("../services/conversationService");

const createConversation = async (req, res) => {
  try {
    const result = await conversationService.createConversation(req.body, req.user._id);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { createConversation };