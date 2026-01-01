import User from "../models/user.model.js";
import { sendEmail } from "../lib/emailService.js";
import dotenv from "dotenv";

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

    // 🧠 Use password from frontend OR generate one if missing
    const password = rawPassword || generateStrongPassword();

    // 🗂️ Save user in DB
    const newUser = await User.create({
      username,
      fullName,
      email,
      department,
      phone,
      role,
      password,
    });

    // 📧 Send credentials via email
    const html = `
      <div style="font-family: Arial, sans-serif; color: #24292e; background-color: #ffffff; padding: 40px 0; text-align: center;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 6px; border: 1px solid #d0d7de; padding: 40px;">

          <!-- Logo -->
          <img src="https://yourdomain.com/public/updated-logo.png" alt="RackSmart Logo" style="height: 60px; margin-bottom: 20px;" />

          <!-- Title -->
          <h2 style="color: #1800ad; font-weight: 600; margin-bottom: 10px;">Welcome to RackSmart!</h2>

          <!-- Message -->
          <p style="font-size: 15px; color: #24292e;">
            Hi <strong>${fullName}</strong>,
          </p>
          <p style="font-size: 15px; color: #24292e;">
            Your RackSmart account has been created successfully.
          </p>

          <!-- Credentials Box -->
          <div style="border: 1px solid #1800ad; background: #f5f6ff; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: left;">
            <p style="margin: 6px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 6px 0; font-size: 15px;"><strong>Password:</strong> ${password}</p>
          </div>

          <p style="font-size: 14px; color: #57606a;">
            For your security, please change your password after logging in.
          </p>

          <p style="font-size: 14px; color: #57606a; margin-top: 30px;">
            <b>The RackSmart Team</b>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #d8dee4;" />

          <!-- Footer -->
          <p style="font-size: 12px; color: #6e7781;">
            You’re receiving this email because an account was created for you in the RackSmart system.
            If this wasn’t you, please contact your administrator immediately.
          </p>

          <p style="font-size: 11px; color: #8c959f; margin-top: 10px;">
            RackSmart Upright Storage Solutions · Philippines
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, "Your RackSmart Account Credentials", html);

    res.status(201).json(newUser);
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