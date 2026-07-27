const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { User, Employee } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require("../utils/jwtHelper");
const { Op } = require("sequelize");

const buildAuthenticatedUserContext = (user) => {
  const emp = user.Employee || (typeof user.getDataValue === "function" ? user.getDataValue("Employee") : user.dataValues?.Employee);
  return {
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
    EmployeeId: emp ? emp.EmployeeId : null,
    EmployeeCode: emp ? emp.EmployeeCode : null,
  };
};

const associateEmployeeWithUser = async (user) => {
  if (!user || !user.UserId) return user;

  try {
    let employee = await Employee.findOne({ where: { UserId: user.UserId } });

    if (!employee) {
      const rawUsername = user.Username || `user${user.UserId}`;
      const code = `EMP-U${user.UserId}`;
      const email = rawUsername.includes("@") ? rawUsername : `${rawUsername}_${user.UserId}@hrms.local`;

      // Find by Email or Code
      employee = await Employee.findOne({
        where: {
          [Op.or]: [{ Email: email }, { EmployeeCode: code }],
        },
      });

      if (employee) {
        if (employee.UserId !== user.UserId) {
          await employee.update({ UserId: user.UserId });
        }
      } else {
        const nameParts = rawUsername.split("@")[0].split(/[\._]/);
        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "System";
        const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : (user.Role || "User");

        employee = await Employee.create({
          EmployeeCode: code,
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          UserId: user.UserId,
          Status: "Active",
          HireDate: new Date().toISOString().slice(0, 10),
        });
      }
    }

    user.Employee = employee;
  } catch (err) {
    console.error("⚠️ Error in associateEmployeeWithUser:", err.message);
  }

  return user;
};

const registerUser = async ({ Username, Password, Role }) => {
  const userRole = Role || "Employee";
  const existing = await User.findOne({ where: { Username } });
  if (existing) {
    throw new Error("Username already taken");
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(Password, saltRounds);

  const user = await User.create({ Username, Password: hashedPassword, Role: userRole });
  await associateEmployeeWithUser(user);

  return buildAuthenticatedUserContext(user);
};

const loginUser = async ({ Username, Password }) => {
  let user = await User.findOne({
    where: { Username },
    include: [{ model: Employee, as: "Employee", attributes: ["EmployeeId", "EmployeeCode"] }],
  });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  if (!user.Employee) {
    await associateEmployeeWithUser(user);
    user = await User.findByPk(user.UserId, {
      include: [{ model: Employee, as: "Employee" }],
    });
  }

  const payload = {
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await user.update({ RefreshToken: refreshToken });

  const userContext = buildAuthenticatedUserContext(user);

  return {
    accessToken,
    refreshToken,
    token: accessToken, // Backward compatibility
    user: userContext,
  };
};

const refreshTokenUser = async ({ RefreshToken }) => {
  if (!RefreshToken) {
    throw new Error("Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(RefreshToken);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  let user = await User.findOne({
    where: { UserId: decoded.UserId, RefreshToken },
    include: [{ model: Employee, as: "Employee" }],
  });

  if (!user) {
    throw new Error("Session expired or invalid refresh token");
  }

  const payload = {
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await user.update({ RefreshToken: newRefreshToken });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    token: newAccessToken,
    user: buildAuthenticatedUserContext(user),
  };
};

const forgotPasswordUser = async ({ Username }) => {
  const user = await User.findOne({ where: { Username } });
  if (!user) {
    throw new Error("User with specified username not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await user.update({
    ResetPasswordToken: resetToken,
    ResetPasswordExpires: expiresAt,
  });

  return {
    message: "Password reset token generated successfully",
    resetToken,
    expiresAt,
  };
};

const resetPasswordUser = async ({ Token, NewPassword }) => {
  if (!Token || !NewPassword) {
    throw new Error("Token and new password are required");
  }

  const user = await User.findOne({
    where: {
      ResetPasswordToken: Token,
      ResetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(NewPassword, saltRounds);

  await user.update({
    Password: hashedPassword,
    ResetPasswordToken: null,
    ResetPasswordExpires: null,
    RefreshToken: null, // Revoke active sessions on password change
  });

  return { message: "Password reset successful. Please sign in with your new password." };
};

const logoutUser = async (userId) => {
  if (!userId) return;
  const user = await User.findByPk(userId);
  if (user) {
    await user.update({ RefreshToken: null });
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshTokenUser,
  forgotPasswordUser,
  resetPasswordUser,
  logoutUser,
  buildAuthenticatedUserContext,
  associateEmployeeWithUser,
};
