const express = require("express");
const router = express.Router();

const { getMessages, sendMessage } = require("../controllers/messageController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.get("/:conversationId", requireAuth, getMessages);
router.post("/send", requireAuth, sendMessage);

module.exports = router;