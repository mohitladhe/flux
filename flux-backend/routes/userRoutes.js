const express = require('express');
const router = express.Router();

const { searchUser } = require("../controllers/userController");
const requireAuth = require('../middlewares/requireAuthMiddleware');

router.get("/search", requireAuth, searchUser);

module.exports = router;