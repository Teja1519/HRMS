const jwt = require("jsonwebtoken");
const { User, Employee } = require("../models");
const { buildAuthenticatedUserContext } = require("../services/authService");

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.UserId, {
      include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "EmployeeCode"] }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid. User not found.",
      });
    }

    const { buildAuthenticatedUserContext, associateEmployeeWithUser } = require("../services/authService");

    if (!user.Employee) {
      await associateEmployeeWithUser(user);
      user = await User.findByPk(decoded.UserId, {
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
