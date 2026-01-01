import React, { useState, useEffect } from "react";

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [form, setForm] = useState({
        title: "",
        message: "",
        imageUrl: "",
        targetRoles: [],
    });

    // Demo static announcements
    const fetchAnnouncements = () => {
        setAnnouncements([
            {
                _id: "1",
                title: "Welcome to RackSmart",
                message: "This is a demo announcement",
                imageUrl: "",
                targetRoles: ["staff", "personnel"],
                isActive: true,
                isDisplayed: false,
            },
            {
                _id: "2",
                title: "System Update",
                message: "Demo announcement for admins",
                imageUrl: "",
                targetRoles: ["admin"],
                isActive: true,
                isDisplayed: true,
            },
        ]);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newAnn = {
            _id: Date.now().toString(),
            title: form.title,
            message: form.message,
            imageUrl: form.imageUrl || "",
            targetRoles: form.targetRoles,
            isActive: true,
            isDisplayed: false,
        };
        setAnnouncements([newAnn, ...announcements]);
        setForm({ title: "", message: "", imageUrl: "", targetRoles: [] });
    };

    const handleDelete = (id) => {
        setAnnouncements(announcements.filter((ann) => ann._id !== id));
    };

    const handleDisplay = (id) => {
        setAnnouncements(
            announcements.map((ann) =>
                ann._id === id ? { ...ann, isDisplayed: true } : ann
            )
        );
    };

    return (
        <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    RACKSMART – Announcement Center
                </h1>
                <p className="text-gray-500 text-sm">
                    Create and manage announcements visible to specific user roles.
                </p>

                {/* Instruction Box */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
                    <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                        <li>Use clear and concise titles for announcements.</li>
                        <li>Assign announcements to the proper user roles.</li>
                        <li>Ensure the content is accurate and relevant.</li>
                    </ul>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
                    Create New Announcement
                </h5>

                <form onSubmit={handleSubmit} className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title Field */}
        <div className="flex flex-col">
        <label className="text-[14px] font-bold text-gray-400 mb-1">Title</label>
            <input
                type="text"
                placeholder="Enter title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1800ad] transition-all"
                required
            />
        </div>

        {/* Message Field */}
        <div className="flex flex-col md:col-span-2">
        <label className="text-[14px] font-bold text-gray-400 mb-1">Message</label>
            <textarea
                placeholder="Type your announcement message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full resize-none text-sm outline-none focus:ring-2 focus:ring-[#1800ad] transition-all"
                rows={4}
                required
            />
        </div>
    </div>

    {/* Checkbox Group */}
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 items-start sm:items-center bg-gray-50 p-3 rounded-md border border-dashed border-gray-200">
        <label className="text-[14px] font-bold text-gray-400 mb-1">Send to:</label>
        
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1800ad] transition">
            <input
                type="checkbox"
                className="w-4 h-4 accent-[#1800ad]"
                checked={form.targetRoles.includes("staff")}
                onChange={(e) =>
                    setForm({
                        ...form,
                        targetRoles: e.target.checked
                            ? [...form.targetRoles, "staff"]
                            : form.targetRoles.filter((r) => r !== "staff"),
                    })
                }
            />
            <span className="text-sm font-semibold">Inventory Personnel</span>
        </label>

        <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1800ad] transition">
            <input
                type="checkbox"
                className="w-4 h-4 accent-[#1800ad]"
                checked={form.targetRoles.includes("personnel")}
                onChange={(e) =>
                    setForm({
                        ...form,
                        targetRoles: e.target.checked
                            ? [...form.targetRoles, "personnel"]
                            : form.targetRoles.filter((r) => r !== "personnel"),
                    })
                }
            />
            <span className="text-sm font-semibold">Project Personnel</span>
        </label>

        <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#1800ad] transition">
            <input
                type="checkbox"
                className="w-4 h-4 accent-[#1800ad]"
                checked={form.targetRoles.includes("admin")}
                onChange={(e) =>
                    setForm({
                        ...form,
                        targetRoles: e.target.checked
                            ? [...form.targetRoles, "admin"]
                            : form.targetRoles.filter((r) => r !== "admin"),
                    })
                }
            />
            <span className="text-sm font-semibold">Admin Users</span>
        </label>
    </div>

    {/* Submit Button */}
    <div className="flex justify-end pt-2">
        <button
            type="submit"
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
        >
            Send Announcement
        </button>
    </div>
</form>
            </div>

            {/* Announcements List */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
                    Existing Announcements
                </h5>

                <div className="space-y-3 max-h-100 overflow-y-auto">
                    {announcements.length > 0 ? (
                        announcements.map((ann) => (
                            <div
                                key={ann._id}
                                className={`border border-gray-200 rounded-lg p-4 flex justify-between items-start transition ${ann.isActive ? "bg-white hover:bg-gray-50" : "bg-gray-100"
                                    }`}
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-800">
                                        {ann.title}
                                    </h3>
                                    <p className="text-gray-700 mt-1">{ann.message}</p>

                                    {ann.imageUrl && (
                                        <img
                                            src={ann.imageUrl}
                                            alt={ann.title}
                                            className="mt-2 max-h-40 object-contain rounded"
                                        />
                                    )}

                                    <p className="text-xs text-gray-400 mt-1">
                                        Target Roles: {ann.targetRoles.join(", ") || "-"}
                                    </p>

                                    <p
                                        className={`text-xs mt-1 font-medium ${ann.isDisplayed
                                            ? "text-green-600"
                                            : "text-yellow-600 italic"
                                            }`}
                                    >
                                        Status:{" "}
                                        {ann.isDisplayed
                                            ? "Displayed to department(s)"
                                            : "Pending display"}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                    {!ann.isDisplayed && (
                                        <button
                                            onClick={() => handleDisplay(ann._id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs font-medium"
                                        >
                                            Display
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(ann._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No announcements available.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Announcement;
