const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { User, Employee, Department } = require("../models");
const { toEmployeeDTO } = require("../dtos/EmployeeDTO");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const { associateEmployeeWithUser } = require("../services/authService");

const resolveEmployee = async (userContext) => {
  if (!userContext || !userContext.UserId) return null;

  let emp = null;
  if (userContext.EmployeeId) {
    emp = await Employee.findByPk(userContext.EmployeeId, {
      include: [{ model: Department, as: "Department" }],
    });
  }

  if (!emp) {
    let user = await User.findByPk(userContext.UserId, {
      include: [{ model: Employee, as: "Employee" }],
    });
    if (user) {
      if (!user.Employee) {
        await associateEmployeeWithUser(user);
        user = await User.findByPk(userContext.UserId, {
          include: [{ model: Employee, as: "Employee" }],
        });
      }
      if (user && user.Employee) {
        emp = await Employee.findByPk(user.Employee.EmployeeId, {
          include: [{ model: Department, as: "Department" }],
        });
      }
    }
  }

  return emp;
};

// GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const employee = await resolveEmployee(req.user);
    if (!employee) {
      return errorResponse(res, "Employee profile not found for authenticated user", 404);
    }
    return successResponse(res, "Profile fetched successfully", toEmployeeDTO(employee));
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const employee = await resolveEmployee(req.user);
    if (!employee) {
      return errorResponse(res, "Employee profile not found for authenticated user", 404);
    }

    const {
      FirstName,
      LastName,
      Gender,
      DateOfBirth,
      BloodGroup,
      MaritalStatus,
      Nationality,
      Phone,
      AlternatePhone,
      Address,
      City,
      State,
      Country,
      PinCode,
      EmergencyContactName,
      EmergencyContactRelation,
      EmergencyContactPhone,
      BankName,
      BankAccountHolder,
      BankAccountNumber,
      BankIFSC,
      BankBranch,
    } = req.body;

    // Strict security: Restrict employee ID / designation / department / salary modifications from this endpoint
    const updatePayload = {};

    if (FirstName !== undefined) updatePayload.FirstName = String(FirstName).trim();
    if (LastName !== undefined) updatePayload.LastName = String(LastName).trim();
    if (Gender !== undefined) updatePayload.Gender = Gender;
    if (DateOfBirth !== undefined) updatePayload.DateOfBirth = DateOfBirth || null;
    if (BloodGroup !== undefined) updatePayload.BloodGroup = String(BloodGroup).trim();
    if (MaritalStatus !== undefined) updatePayload.MaritalStatus = String(MaritalStatus).trim();
    if (Nationality !== undefined) updatePayload.Nationality = String(Nationality).trim();
    if (Phone !== undefined) updatePayload.Phone = String(Phone).trim();
    if (AlternatePhone !== undefined) updatePayload.AlternatePhone = String(AlternatePhone).trim();
    if (Address !== undefined) updatePayload.Address = String(Address).trim();
    if (City !== undefined) updatePayload.City = String(City).trim();
    if (State !== undefined) updatePayload.State = String(State).trim();
    if (Country !== undefined) updatePayload.Country = String(Country).trim();
    if (PinCode !== undefined) updatePayload.PinCode = String(PinCode).trim();

    if (EmergencyContactName !== undefined) updatePayload.EmergencyContactName = String(EmergencyContactName).trim();
    if (EmergencyContactRelation !== undefined) updatePayload.EmergencyContactRelation = String(EmergencyContactRelation).trim();
    if (EmergencyContactPhone !== undefined) updatePayload.EmergencyContactPhone = String(EmergencyContactPhone).trim();

    // Bank Information editing restricted to HR / Admin or if employee updating their own account details
    if (BankName !== undefined) updatePayload.BankName = String(BankName).trim();
    if (BankAccountHolder !== undefined) updatePayload.BankAccountHolder = String(BankAccountHolder).trim();
    if (BankAccountNumber !== undefined) updatePayload.BankAccountNumber = String(BankAccountNumber).trim();
    if (BankIFSC !== undefined) updatePayload.BankIFSC = String(BankIFSC).trim();
    if (BankBranch !== undefined) updatePayload.BankBranch = String(BankBranch).trim();

    await employee.update(updatePayload);

    const refreshed = await Employee.findByPk(employee.EmployeeId, {
      include: [{ model: Department, as: "Department" }],
    });

    return successResponse(res, "Profile updated successfully", toEmployeeDTO(refreshed));
  } catch (error) {
    next(error);
  }
};

// POST /api/profile/upload-photo
const uploadPhoto = async (req, res, next) => {
  try {
    const employee = await resolveEmployee(req.user);
    if (!employee) {
      return errorResponse(res, "Employee profile not found", 404);
    }

    if (!req.file) {
      return errorResponse(res, "No image file provided", 400);
    }

    // Delete old picture if it exists
    if (employee.ProfilePicture) {
      const oldPath = path.join(__dirname, "..", employee.ProfilePicture);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {}
      }
    }

    const photoUrl = `/uploads/avatars/${req.file.filename}`;
    await employee.update({ ProfilePicture: photoUrl });

    const refreshed = await Employee.findByPk(employee.EmployeeId, {
      include: [{ model: Department, as: "Department" }],
    });

    return successResponse(res, "Profile picture uploaded successfully", toEmployeeDTO(refreshed));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/profile/photo
const deletePhoto = async (req, res, next) => {
  try {
    const employee = await resolveEmployee(req.user);
    if (!employee) {
      return errorResponse(res, "Employee profile not found", 404);
    }

    if (employee.ProfilePicture) {
      const oldPath = path.join(__dirname, "..", employee.ProfilePicture);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {}
      }
      await employee.update({ ProfilePicture: null });
    }

    const refreshed = await Employee.findByPk(employee.EmployeeId, {
      include: [{ model: Department, as: "Department" }],
    });

    return successResponse(res, "Profile picture removed successfully", toEmployeeDTO(refreshed));
  } catch (error) {
    next(error);
  }
};

// PUT /api/profile/change-password
const changePassword = async (req, res, next) => {
  try {
    const { CurrentPassword, NewPassword, ConfirmPassword } = req.body;

    if (!CurrentPassword || !NewPassword || !ConfirmPassword) {
      return errorResponse(res, "Current password, new password, and confirmation are required", 400);
    }

    if (NewPassword !== ConfirmPassword) {
      return errorResponse(res, "New password and confirm password do not match", 400);
    }

    // Validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(NewPassword)) {
      return errorResponse(
        res,
        "New password must be at least 8 characters long and include an uppercase letter, lowercase letter, a number, and a special character (@$!%*?&)",
        400
      );
    }

    const user = await User.findByPk(req.user.UserId);
    if (!user) {
      return errorResponse(res, "User account not found", 404);
    }

    const isMatch = await bcrypt.compare(CurrentPassword, user.Password);
    if (!isMatch) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(NewPassword, saltRounds);

    await user.update({
      Password: hashedPassword,
      RefreshToken: null, // Revoke active refresh tokens
    });

    return successResponse(res, "Password updated successfully. Please log in with your new password on your next session.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  changePassword,
};
