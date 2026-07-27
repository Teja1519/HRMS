const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getLocalTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const calculateWorkingHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return "0.0";
  const [inH, inM, inS] = checkInTime.split(":").map(Number);
  const [outH, outM, outS] = checkOutTime.split(":").map(Number);
  const inMinutes = inH * 60 + inM + (inS || 0) / 60;
  const outMinutes = outH * 60 + outM + (outS || 0) / 60;
  const diffMinutes = Math.max(0, outMinutes - inMinutes);
  return (diffMinutes / 60).toFixed(1);
};

module.exports = {
  getLocalDate,
  getLocalTime,
  calculateWorkingHours,
};
