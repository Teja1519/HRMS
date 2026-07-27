const reportService = require("../services/reportService");
const { successResponse } = require("../utils/responseHelper");

const getSummaryReport = async (req, res, next) => {
  try {
    const summary = await reportService.getSummaryReport();
    return successResponse(res, "Summary report fetched successfully", summary);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSummaryReport };
