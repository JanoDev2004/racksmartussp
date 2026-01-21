import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // Who can see it
    targetRoles: {
      type: [String],
      enum: ["admin", "inventory", "management"],
      required: true,
    },

    // Control flags
    isActive: {
      type: Boolean,
      default: true,
    },

    isDisplayed: {
      type: Boolean,
      default: false,
    },

    // ⏱️ Auto-expire after display
    expiresAt: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
