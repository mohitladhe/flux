const express = require("express");
const router = express.Router();

const { createConversation } = require("../controllers/conversationController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/create", requireAuth, createConversation);

module.exports = router;