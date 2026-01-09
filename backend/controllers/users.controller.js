import User from "../models/user.model.js";
import { sendEmail } from "../lib/emailService.js";
import dotenv from "dotenv";
import crypto from "crypto";
import { generateVerificationToken } from "../controllers/auth.controller.js"; // reuse function

dotenv.config();

/** ✅ Get all users */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** ✅ Get single user by ID */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** ✅ Create new user (with auto password + email send via Resend) */
export const createUser = async (req, res) => {
  try {
    const { username, fullName, email, department, phone, role, password: rawPassword } = req.body;

    if (!username || !fullName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const password = rawPassword || generateStrongPassword();

    // ✅ Generate verification token
    const { token, expires } = generateVerificationToken();

    const newUser = await User.create({
      username,
      fullName,
      email: normalizedEmail,
      department,
      phone,
      role,
      password,
      isActive: true,
      isVerified: false,
      verificationToken: token,
      verificationTokenExpires: expires,
    });

    // Verification link points directly to backend
    const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${token}&id=${newUser._id}`;

    const html = `
      <div style="font-family: Arial, sans-serif; text-align:center; padding:40px;">
        <h2 style="color:#1800ad;">Welcome to RackSmart</h2>
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Your account has been created. Click below to verify your email:</p>
        <a href="${verificationLink}" style="display:inline-block; background:#1800ad; color:#fff; text-decoration:none; padding:12px 32px; border-radius:6px;">Verify Email</a>
        <p>Your temporary password is: <strong>${password}</strong></p>
      </div>
    `;

    const text = `Hi ${fullName},\nYour account has been created.\nPassword: ${password}\nVerify email: ${verificationLink}`;

    await sendEmail(normalizedEmail, "Verify your RackSmart account", html, text);

    res.status(201).json({
      message: "User created successfully. Verification email sent.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message });
  }
};

/** ✅ Update user */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/** ✅ Delete user */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================
   🔧 Helper Functions
======================= */

/** Generate strong random password */
function generateStrongPassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const all = upper + lower + numbers;
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += all.charAt(Math.floor(Math.random() * all.length));
  }
  return password;
}
