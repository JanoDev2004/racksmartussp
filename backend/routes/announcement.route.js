import express from "express";
import {
  createAnnouncement,
  getAnnouncementsForUser,
  displayAnnouncement,
  deleteAnnouncement,
  getAllAnnouncements, // new
} from "../controllers/announcement.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createAnnouncement);
router.get("/", protectRoute, getAnnouncementsForUser); // normal user
router.get("/all", protectRoute, getAllAnnouncements); // admin only
router.put("/:id/display", protectRoute, displayAnnouncement);
router.delete("/:id", protectRoute, deleteAnnouncement);

export default router;
