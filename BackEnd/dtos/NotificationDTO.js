const toNotificationDTO = (notif) => {
  if (!notif) return null;
  const raw = notif.toJSON ? notif.toJSON() : notif;

  return {
    NotificationId: raw.NotificationId,
    Title: raw.Title || "Announcement",
    Message: raw.Message || "",
    Priority: raw.Priority || "Normal",
    Audience: raw.Audience || "All",
    DepartmentId: raw.DepartmentId || null,
    DepartmentName: raw.Department ? raw.Department.DepartmentName : null,
    IsRead: Boolean(raw.IsRead),
    CreatedAt: raw.CreatedAt || raw.createdAt,
  };
};

module.exports = { toNotificationDTO };
