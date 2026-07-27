const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Role: {
      type: DataTypes.ENUM("Admin", "HR", "Employee", "Manager"),
      allowNull: false,
      defaultValue: "Employee",
    },
    ResetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ResetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    RefreshToken: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

module.exports = User;
