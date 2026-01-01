import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  getProfile,
  sendVerificationCode,
  verifyCode,
} from "../controllers/auth.controller.js"; // 👈 your existing controller file

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Add new verification routes
router.post("/send-code", sendVerificationCode);
router.post("/verify-code", verifyCode);

// ✅ Existing routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/change-password", protectRoute, changePassword);
router.get("/profile", protectRoute, getProfile);

export default router;