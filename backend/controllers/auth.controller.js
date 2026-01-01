import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserLog from "../models/userLog.js";
import dotenv from "dotenv";
import { sendEmail } from "../lib/emailService.js";

const CLIENT_URL = process.env.CLIENT_URL || "https://racksmartussp.site";

// ============================
// VERIFICATION CODE
// ============================
export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis
    await redis.set(`verify:${normalizedEmail}`, code, "EX", 600);
    console.log("Verification code stored:", code);

    // Send email
    const html = `<p>Your verification code is <b>${code}</b></p>`;
    const text = `Your verification code is ${code}. Valid for 10 minutes.`;
    await sendEmail(email, "Racksmart Verification Code", html, text);

    console.log("✅ Verification email sent to", email);
    res.status(200).json({ message: "Verification code sent successfully!" });
  } catch (error) {
    console.error("sendVerificationCode Error:", error);
    res.status(500).json({ message: "Failed to send verification code", error: error.message });
  }
};

// ============================
// PASSWORD RESET
// ============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; text-align:center; padding:40px 0; color:#24292e;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:6px; border:1px solid #d0d7de; padding:40px;">
          <img src="https://racksmartussp.site/public/updated-logo.png" alt="Racksmart Logo" style="height:60px; margin-bottom:20px;" />
          <h2 style="color:#1800ad;">Reset Your Password</h2>
          <p>Hello ${
            user.fullName || "User"
          },<br />Click the button below to set a new password.</p>
          <div style="margin:30px 0;">
            <a href="${resetUrl}" style="display:inline-block; background:#1800ad; color:#fff; text-decoration:none; padding:12px 32px; border-radius:6px; font-weight:bold;">Reset Password</a>
          </div>
          <p>This password reset link is valid for <b>1 hour</b>.</p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    const text = `Hello ${
      user.fullName || "User"
    },\n\nReset your password using this link:\n${resetUrl}\n\nThis link is valid for 1 hour.`;

    await sendEmail(email, "Reset your Racksmart password", html, text);

    console.log("✅ Password reset email sent");
    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("❌ forgotPassword Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send reset email", error: error.message });
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

    const storedCode = await redis.get(`verify:${email}`);
    if (!storedCode) return res.status(400).json({ message: "Code expired or not found" });
    if (storedCode !== code) return res.status(400).json({ message: "Invalid code" });

    await redis.del(`verify:${email}`);

    // ✅ Mark user as verified
    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    res.json({ message: "Code verified successfully!", user });
  } catch (error) {
    console.error("verifyCode error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;
  if (!token || !newPassword || !confirmNewPassword)
    return res.status(400).json({ message: "All fields are required" });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  res.json({ message: "Password reset successfully!" });
};

// ============================
// AUTHENTICATION & TOKENS
// ============================
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ============================
// SIGNUP, LOGIN, LOGOUT
// ============================
export const signup = async (req, res) => {
  const {
    username,
    fullName,
    email,
    password,
    confirmPassword,
    department,
    phone,
    role,
  } = req.body;

  try {
    // Validate required fields
    if (!username || !fullName || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Map old roles to new roles
    let mappedRole = role || "inventory"; // Default to inventory if not provided
    if (role === "staff") {
      mappedRole = "inventory";
    } else if (role === "personnel") {
      mappedRole = "management";
    }

    // Check for existing admin
    if (mappedRole === "admin" && (await User.findOne({ role: "admin" }))) {
      return res.status(400).json({ message: "Admin account already exists" });
    }

    // Check for duplicate email or username
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Create user
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      department,
      phone,
      role: mappedRole,
      isActive: true,
    });

    // Log the activity
    await UserLog.create({
      userId: user._id,
      userName: user.fullName || user.username,
      role: user.role,
      activity: "Account created",
      status: "Logged In",
      loginTime: new Date(),
      ip:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    // Return user data without password
    res.status(201).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account inactive. Contact admin." });

    // If not verified, send verification code
    if (!user.isVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await redis.set(`verify:${email}`, code, "EX", 600); // store code in Redis

      const html = `<p>Your Racksmart verification code: <b>${code}</b></p>`;
      await sendEmail(email, "Racksmart Verification Code", html);

      return res.json({
        message: "Verification code sent. Check your email.",
        user: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          department: user.department,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
        requiresVerification: true,
      });
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Store refresh token
    await redis.set(`refresh_token:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);

    // Set cookies
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

    // ✅ Create a new log row for login
    await UserLog.create({
      userId: user._id,
      userName: user.fullName || user.username,
      role: user.role,
      event: "User logged in",
      additional: `IP: ${req.ip || req.headers["x-forwarded-for"] || "N/A"}`,
      dateTime: new Date(),
    });

    res.json({
      message: "Login successful",
      user,
      requiresVerification: false,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // ✅ Create a new log row for logout
      await UserLog.create({
        userId: decoded.userId,
        userName: decoded.userName || "Unknown",
        role: decoded.role || "Unknown",
        event: "User logged out",
        additional: `IP: ${req.ip || req.headers["x-forwarded-for"] || "N/A"}`,
        dateTime: new Date(),
      });

      // Delete refresh token
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword)
      return res.status(400).json({ message: "All fields are required" });
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "New passwords do not match" });

    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("changePassword error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================
// REFRESH TOKEN
// ============================
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("refreshToken error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ============================
// GET PROFILE
// ============================
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("getProfile error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
