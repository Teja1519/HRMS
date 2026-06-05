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
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "UserId",
      },
    },
    Message: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    updatedAt: false,
  }
);

module.exports = Notification;
