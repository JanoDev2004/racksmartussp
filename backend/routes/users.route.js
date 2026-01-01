import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/users.controller.js";

const router = express.Router();

// List all users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUserById);

// Create user
router.post("/", createUser);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);



export default router;