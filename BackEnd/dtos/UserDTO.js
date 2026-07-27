const toUserDTO = (user) => {
  if (!user) return null;
  const raw = user.toJSON ? user.toJSON() : user;
  return {
    UserId: raw.UserId,
    Username: raw.Username,
    Role: raw.Role,
    EmployeeId: raw.Employee ? raw.Employee.EmployeeId : (raw.EmployeeId || null),
    EmployeeCode: raw.Employee ? raw.Employee.EmployeeCode : (raw.EmployeeCode || null),
  };
};

module.exports = { toUserDTO };
