const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateToken } = require("../utils/jwtHelper");

const registerUser = async ({ Username, Password, Role }) => {
  // Check if username already exists
  const existing = await User.findOne({ where: { Username } });
  if (existing) {
    throw new Error("Username already taken");
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(Password, saltRounds);

  // Create user
  const user = await User.create({ Username, Password: hashedPassword, Role });

  return {
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
  };
};

const loginUser = async ({ Username, Password }) => {
  // Find user
  const user = await User.findOne({ where: { Username } });
  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(Password, user.Password);
  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  // Generate token
  const token = generateToken({
    UserId: user.UserId,
    Username: user.Username,
    Role: user.Role,
  });

  return {
    token,
    user: {
      UserId: user.UserId,
      Username: user.Username,
      Role: user.Role,
    },
  };
};

module.exports = { registerUser, loginUser };
