/**
 * Send a standardized success response
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data !== null ? data : null,
    errors: null,
  });
};

const errorResponse = (res, message, statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors: errors || null,
  });
};

module.exports = { successResponse, errorResponse };
