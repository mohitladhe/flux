const express = require("express");
const router = express.Router();

const { createConversation, getConversations } = require("../controllers/conversationController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/create", requireAuth, createConversation);

module.exports = router;