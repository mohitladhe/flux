const express = require("express");
const router = express.Router();

const { createConversation, getConversations, createGroup, updateAdminStatus, removeMember, addMember, generateGroupInvite, revokeGroupInvite, getGroupInvitePreview, joinGroupByInvite } = require("../controllers/conversationController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/create", requireAuth, createConversation);
router.get("/", requireAuth, getConversations);
router.post("/create-group", requireAuth, createGroup);
router.patch("/:conversationId/members/:memberId/admin", requireAuth, updateAdminStatus);
router.delete("/:conversationId/members/:memberId", requireAuth, removeMember);
router.post("/:conversationId/members", requireAuth, addMember);
router.post("/:conversationId/invite-link", requireAuth, generateGroupInvite);
router.post("/:conversationId/invite-link/revoke", requireAuth, revokeGroupInvite);
router.post("/invite/:token", requireAuth, getGroupInvitePreview);
router.post("/invite/:token/join", requireAuth, joinGroupByInvite);

module.exports = router;