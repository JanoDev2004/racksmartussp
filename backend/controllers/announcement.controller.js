import Announcement from "../models/announcement.model.js";

/* ================= CREATE ANNOUNCEMENT ================= */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, imageUrl, targetRoles } = req.body;

    if (!title || !message || !targetRoles?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      imageUrl,
      targetRoles,
      createdBy: req.user._id,
      isActive: true,
      isDisplayed: false, // 🔒 default
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ANNOUNCEMENTS FOR USER (DASHBOARD) ================= */
export const getAnnouncementsForUser = async (req, res) => {
  try {
    const userRole = req.user.role;
    const now = new Date();

    const announcements = await Announcement.find({
      isActive: true,
      isDisplayed: true,
      targetRoles: userRole,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .sort({ createdAt: -1 })
      .lean();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= DISPLAY ANNOUNCEMENT (SET 1 WEEK EXPIRY) ================= */
export const displayAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // ⏱️ 1 WEEK

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      {
        isDisplayed: true,
        expiresAt,
      },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ANNOUNCEMENT ================= */
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
