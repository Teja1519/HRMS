const notificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.UserId);
    return successResponse(res, "Notifications fetched", notifications);
  } catch (error) {
    next(error);
  }
};

const getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUnreadNotifications(req.user.UserId);
    return successResponse(res, "Unread notifications fetched", notifications);
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const { UserId, Message } = req.body;
    if (!UserId || !Message) return errorResponse(res, "UserId and Message are required", 400);

    const notification = await notificationService.createNotification(UserId, Message);
    return successResponse(res, "Notification created", notification, 201);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.UserId
    );
    return successResponse(res, "Notification marked as read", notification);
  } catch (error) {
    if (error.message === "Notification not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user.UserId);
    return successResponse(res, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
};
