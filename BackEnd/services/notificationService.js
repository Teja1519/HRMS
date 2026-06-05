const { Notification } = require("../models");

const getNotifications = async (userId) => {
  return await Notification.findAll({
    where: { UserId: userId },
    order: [["CreatedAt", "DESC"]],
  });
};

const getUnreadNotifications = async (userId) => {
  return await Notification.findAll({
    where: { UserId: userId, IsRead: false },
    order: [["CreatedAt", "DESC"]],
  });
};

const createNotification = async (userId, message) => {
  return await Notification.create({ UserId: userId, Message: message });
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { NotificationId: notificationId, UserId: userId },
  });
  if (!notification) throw new Error("Notification not found");
  await notification.update({ IsRead: true });
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.update({ IsRead: true }, { where: { UserId: userId } });
  return true;
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
};
