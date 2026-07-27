const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

const register = async (req, res, next) => {
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

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.RefreshToken || req.body.refreshToken;
    const result = await authService.refreshTokenUser({ RefreshToken: refreshToken });
    return successResponse(res, "Token refreshed successfully", result);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPasswordUser(req.body);
    return successResponse(res, result.message, { resetToken: result.resetToken, expiresAt: result.expiresAt });
  } catch (error) {
    if (error.message.includes("not found")) {
      return errorResponse(res, error.message, 404);
    }
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPasswordUser(req.body);
    return successResponse(res, result.message);
  } catch (error) {
    if (error.message.includes("Invalid or expired")) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.user && req.user.UserId) {
      await authService.logoutUser(req.user.UserId);
    }
    return successResponse(res, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  return successResponse(res, "User profile fetched", req.user);
};

module.exports = {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
};
