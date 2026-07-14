const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  verifyUser,
  resendOtp,
  verifyToken,
  requestPasswordReset,
  verifyPasswordReset,
  setNewPassword,
} = require("../controllers/authController");
const requireAuth = require("../middlewares/requireAuthMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/resend-otp", resendOtp);
router.get("/me", requireAuth, verifyToken);
router.post("/password-reset", requestPasswordReset);
router.post("/verify-password-reset", verifyPasswordReset);
router.post("/set-new-password", setNewPassword);

module.exports = router;
