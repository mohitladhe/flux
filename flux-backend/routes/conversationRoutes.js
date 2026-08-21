const express = require("express");
const router = express.Router();

const { createConversation, getConversations, createGroup } = require("../controllers/conversationController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/create", requireAuth, createConversation);
router.get("/", requireAuth, getConversations);
router.post("/create-group", requireAuth, createGroup);

module.exports = router;