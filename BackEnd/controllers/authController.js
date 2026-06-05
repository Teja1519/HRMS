const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const register = async (req, res, next) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, "User registered successfully", user, 201);
  } catch (error) {
    if (error.message === "Username already taken") {
      return errorResponse(res, error.message, 409);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    return successResponse(res, "Login successful", result);
  } catch (error) {
    if (error.message === "Invalid username or password") {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

// Get currently logged-in user info
const getMe = async (req, res) => {
  return successResponse(res, "User fetched", req.user);
};

module.exports = { register, login, getMe };
