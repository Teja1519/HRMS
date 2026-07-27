const { Setting } = require("../models");

const getAllSettings = async () => {
  const settingsList = await Setting.findAll();
  const settingsMap = {};
  settingsList.forEach((s) => {
    settingsMap[s.SettingName] = s.SettingValue;
  });
  return settingsMap;
};

const updateSettings = async (settingsMap) => {
  for (const [key, value] of Object.entries(settingsMap)) {
    const [setting] = await Setting.findOrCreate({
      where: { SettingName: key },
      defaults: { SettingValue: String(value) },
    });
    await setting.update({ SettingValue: String(value) });
  }
  return await getAllSettings();
};

module.exports = { getAllSettings, updateSettings };
