const test = require("node:test");
const assert = require("node:assert/strict");
const { buildAuthenticatedUserContext } = require("../services/authService");

test("buildAuthenticatedUserContext includes employee identity when present", () => {
  const context = buildAuthenticatedUserContext({
    UserId: 7,
    Username: "jane@example.com",
    Role: "Employee",
    Employee: { EmployeeId: 42, EmployeeCode: "EMP-042" },
  });

  assert.deepEqual(context, {
    UserId: 7,
    Username: "jane@example.com",
    Role: "Employee",
    EmployeeId: 42,
    EmployeeCode: "EMP-042",
  });
});

test("buildAuthenticatedUserContext omits employee identity when not linked", () => {
  const context = buildAuthenticatedUserContext({
    UserId: 8,
    Username: "guest@example.com",
    Role: "Employee",
  });

  assert.deepEqual(context, {
    UserId: 8,
    Username: "guest@example.com",
    Role: "Employee",
    EmployeeId: null,
    EmployeeCode: null,
  });
});
