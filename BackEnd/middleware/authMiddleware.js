const { User, Employee } = require("../models");
const { verifyAccessToken } = require("../utils/jwtHelper");
const { buildAuthenticatedUserContext, associateEmployeeWithUser } = require("../services/authService");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = verifyAccessToken(token);

    let user = await User.findByPk(decoded.UserId, {
      attributes: ["UserId", "Username", "Role"],
      include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "EmployeeCode"] }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid. User not found.",
      });
    }

    if (!user.Employee) {
      await associateEmployeeWithUser(user);
      user = await User.findByPk(decoded.UserId, {
        attributes: ["UserId", "Username", "Role"],
        include: [{ model: Employee, as: "Employee" }],
      });
    }

    req.user = buildAuthenticatedUserContext(user);

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired." });
    }
    next(error);
  }
};

module.exports = { protect };
