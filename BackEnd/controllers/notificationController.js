const notificationService = require("../services/notificationService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getNotificationsForUser(req.user);
    return successResponse(res, "Notifications fetched", notifications);
  } catch (error) {
    next(error);
  }
};

const getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUnreadNotificationsForUser(req.user);
    return successResponse(res, "Unread notifications fetched", notifications);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { Message, Title } = req.body;
    if (!Title || !Message) {
      return errorResponse(res, "Title and Message are required to publish an announcement", 400);
    }

    const announcement = await notificationService.createAnnouncement(req.body, req.user.UserId);
    return successResponse(res, "Announcement published successfully", announcement, 201);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await notificationService.updateAnnouncement(req.params.id, req.body);
    return successResponse(res, "Announcement updated successfully", announcement);
  } catch (error) {
    if (error.message === "Announcement not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    await notificationService.deleteAnnouncement(req.params.id);
    return successResponse(res, "Announcement deleted successfully");
  } catch (error) {
    if (error.message === "Announcement not found") return errorResponse(res, error.message, 404);
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
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
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
  markAllAsRead,
};
