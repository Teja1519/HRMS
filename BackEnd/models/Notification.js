const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Notification = sequelize.define(
  "Notification",
  {
    NotificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Announcement",
    },
    Message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Priority: {
      type: DataTypes.ENUM("Normal", "Important", "Urgent"),
      defaultValue: "Normal",
    },
    Audience: {
      type: DataTypes.ENUM("All", "Department", "User"),
      defaultValue: "All",
    },
    DepartmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Departments",
        key: "DepartmentId",
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "UserId",
      },
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "UserId",
      },
    },
    IsRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Notifications",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

module.exports = Notification;
