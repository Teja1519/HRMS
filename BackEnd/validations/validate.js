const { validationResult } = require("express-validator");

/**
 * Middleware to check express-validator results
 * Place this after any validation chain in the route
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const detailMsg = errors.array().map((err) => err.msg).join(". ");
    return res.status(400).json({
      success: false,
      message: detailMsg || "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = { handleValidationErrors };
