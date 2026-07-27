const settingService = require("../services/settingService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingService.getAllSettings();
    return successResponse(res, "Settings fetched successfully", settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await settingService.updateSettings(req.body);
    return successResponse(res, "Settings updated successfully", settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
