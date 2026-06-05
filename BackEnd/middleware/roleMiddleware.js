// roleMiddleware.js
// Usage: authorize("Admin", "HR") — pass allowed roles as arguments

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    if (!roles.includes(req.user.Role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = { authorize };
