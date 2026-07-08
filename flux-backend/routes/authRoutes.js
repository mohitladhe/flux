const express = require("express");
const router = express.Router();

const { loginUser, registerUser, verifyUser, resendOtp, verifyToken } = require("../controllers/authController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/resend-otp", resendOtp);
router.get("/me", requireAuth, verifyToken);

module.exports = router;
