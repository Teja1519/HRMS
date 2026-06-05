const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Setting = sequelize.define(
  "Setting",
  {
    SettingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    SettingName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    SettingValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Settings",
    timestamps: true,
  }
);

module.exports = Setting;
