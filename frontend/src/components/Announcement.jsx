import React, { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import useAnnouncementStore from "../stores/useAnnouncementStore";
import { useUserStore } from "../stores/useUserStore"; // <-- import user store

const roleMap = {
  staff: "inventory",
  personnel: "management",
  admin: "admin",
};

const Announcement = () => {
  const { user } = useUserStore(); // <-- get current user
  const userRole = user?.role || "staff";

  const {
    announcements,
    fetchAnnouncements,
    createAnnouncement,
    displayAnnouncement,
    deleteAnnouncement,
    loading,
  } = useAnnouncementStore();

  const [form, setForm] = useState({
    title: "",
    message: "",
    imageUrl: "",
    targetRoles: [],
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    const isAdmin = userRole === "admin";
    fetchAnnouncements(isAdmin); // <-- fetch all for admin, filtered for normal
  }, [userRole, fetchAnnouncements]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const mappedRoles = form.targetRoles.map((r) => roleMap[r]);

    await createAnnouncement({
      title: form.title,
      message: form.message,
      imageUrl: form.imageUrl,
      targetRoles: mappedRoles,
    });

    setForm({ title: "", message: "", imageUrl: "", targetRoles: [] });

    // Refresh announcements after creating
    const isAdmin = userRole === "admin";
    fetchAnnouncements(isAdmin);
  };

  /* ================= FILTER ANNOUNCEMENTS ================= */
  const now = new Date();
  const visibleAnnouncements =
    userRole === "admin"
      ? announcements // admin sees all
      : announcements.filter((ann) => {
          const notExpired = !ann.expiresAt || new Date(ann.expiresAt) > now;
          return ann.isDisplayed && notExpired && ann.targetRoles.includes(userRole);
        });

  /* ================= UI ================= */
  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <PageHeader pageName="Announcement" />

      {/* ================= FORM ================= */}
      {userRole === "admin" && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h5 className="text-gray-700 font-bold border-b pb-1 mb-4">
            Create New Announcement
          </h5>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-bold text-gray-400">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold text-gray-400">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="border rounded-md px-3 py-2 w-full resize-none"
                  required
                />
              </div>
            </div>

            {/* ================= ROLES ================= */}
            <div className="flex flex-wrap gap-6 bg-gray-50 p-3 rounded border">
              {["staff", "personnel", "admin"].map((role) => (
                <label key={role} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={form.targetRoles.includes(role)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        targetRoles: e.target.checked
                          ? [...form.targetRoles, role]
                          : form.targetRoles.filter((r) => r !== role),
                      })
                    }
                  />
                  <span className="text-sm font-semibold capitalize">{role}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#1800ad] text-white px-6 py-2 rounded font-bold"
              >
                Send Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= LIST ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="font-bold border-b pb-1 mb-4">Existing Announcements</h5>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : visibleAnnouncements.length ? (
          <div className="space-y-3">
            {visibleAnnouncements.map((ann) => (
              <div
                key={ann._id}
                className="border rounded-lg p-4 flex justify-between"
              >
                <div>
                  <h3 className="font-semibold text-lg">{ann.title}</h3>
                  <p className="text-gray-700">{ann.message}</p>

                  <p className="text-xs text-gray-400 mt-1">
                    Roles: {ann.targetRoles.join(", ")}
                  </p>

                  <p
                    className={`text-xs mt-1 ${
                      ann.isDisplayed
                        ? "text-green-600"
                        : "text-yellow-600 italic"
                    }`}
                  >
                    {ann.isDisplayed ? "Displayed" : "Pending display"}
                  </p>
                  <p className="text-xs mt-1">
                    Created At: {new Date(ann.createdAt).toLocaleString()}
                  </p>

                  {ann.expiresAt && new Date(ann.expiresAt) <= now && (
                    <p className="text-xs mt-1 text-red-500 italic">Expired</p>
                  )}
                </div>

                {userRole === "admin" && (
                  <div className="flex flex-col gap-2">
                    {!ann.isDisplayed && (
                      <button
                        onClick={async () => {
                          await displayAnnouncement(ann._id);
                          fetchAnnouncements(true); // refresh
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Display
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        await deleteAnnouncement(ann._id);
                        fetchAnnouncements(true); // refresh
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No announcements available.</p>
        )}
      </div>
    </main>
  );
};

export default Announcement;
