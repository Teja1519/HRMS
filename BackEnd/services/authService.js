const bcrypt = require("bcryptjs");
const { User, Employee } = require("../models");
const { generateToken } = require("../utils/jwtHelper");

const buildAuthenticatedUserContext = (user) => ({
  UserId: user.UserId,
  Username: user.Username,
  Role: user.Role,
  EmployeeId: user.Employee ? user.Employee.EmployeeId : null,
  EmployeeCode: user.Employee ? user.Employee.EmployeeCode : null,
});

const associateEmployeeWithUser = async (user) => {
  if (!user || !user.Username) return user;

  const employee = await Employee.findOne({
    where: { Email: user.Username, UserId: null },
  });

  if (employee) {
    await employee.update({ UserId: user.UserId });
  }

  return user;
};

const registerUser = async ({ Username, Password, Role }) => {
  const existing = await User.findOne({ where: { Username } });
  if (existing) {
    throw new Error("Username already taken");
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(Password, saltRounds);

  const user = await User.create({ Username, Password: hashedPassword, Role });
  await associateEmployeeWithUser(user);

  return buildAuthenticatedUserContext(user);
};

const loginUser = async ({ Username, Password }) => {
  const user = await User.findOne({
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

  const token = generateToken({
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
  });

  return {
    token,
    user: buildAuthenticatedUserContext(user),
  };
};

module.exports = { registerUser, loginUser, buildAuthenticatedUserContext };
