const { Notification, Department, User, Employee } = require("../models");
const { Op } = require("sequelize");

const getNotificationsForUser = async (userContext) => {
  const { UserId, EmployeeId } = userContext;

  let departmentId = null;
  if (EmployeeId) {
    const emp = await Employee.findByPk(EmployeeId, { attributes: ["DepartmentId"] });
    if (emp) departmentId = emp.DepartmentId;
  }

  const whereConditions = [
    { Audience: "All" },
    { UserId: UserId },
  ];

  if (departmentId) {
    whereConditions.push({ Audience: "Department", DepartmentId: departmentId });
  }

  return await Notification.findAll({
    where: { [Op.or]: whereConditions },
    include: [
      { model: Department, as: "Department", attributes: ["DepartmentId", "DepartmentName"] },
      { model: User, as: "Creator", attributes: ["UserId", "Username", "Role"] },
    ],
    order: [["CreatedAt", "DESC"]],
  });
};

const getUnreadNotificationsForUser = async (userContext) => {
  const notifications = await getNotificationsForUser(userContext);
  return notifications.filter((n) => !n.IsRead);
};

const createAnnouncement = async (data) => {
  return await Notification.create({
    Title: data.Title || "Company Announcement",
    Message: data.Message,
    Priority: data.Priority || "Normal",
    Audience: data.Audience || "All",
    DepartmentId: data.DepartmentId ? Number(data.DepartmentId) : null,
    UserId: data.UserId ? Number(data.UserId) : null,
    CreatedBy: data.CreatedBy ? Number(data.CreatedBy) : null,
    IsRead: false,
  });
};

const updateAnnouncement = async (id, data) => {
  const notification = await Notification.findByPk(id);
  if (!notification) throw new Error("Announcement not found");
  await notification.update(data);
  return notification;
};

const deleteAnnouncement = async (id) => {
  const notification = await Notification.findByPk(id);
  if (!notification) throw new Error("Announcement not found");
  await notification.destroy();
  return true;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findByPk(notificationId);
  if (!notification) throw new Error("Notification not found");
  await notification.update({ IsRead: true });
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.update({ IsRead: true }, { where: { [Op.or]: [{ UserId: userId }, { Audience: "All" }] } });
  return true;
};

module.exports = {
  getNotificationsForUser,
  getUnreadNotificationsForUser,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
  markAllAsRead,
};
