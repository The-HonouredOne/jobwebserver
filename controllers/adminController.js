const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password required", 400));
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return next(new AppError("Invalid credentials", 401));
  }

  const token = signToken(admin._id);

  res.status(200).json({
    status: "success",
    token,
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role
    }
  });
});
