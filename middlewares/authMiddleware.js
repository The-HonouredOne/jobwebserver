const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Admin = require("../models/Admin");


exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not logged in", 401));
  }

  // 2️⃣ Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3️⃣ Check admin exists
  const admin = await Admin.findById(decoded.id);
  if (!admin) {
    return next(new AppError("User no longer exists", 401));
  }

  // 4️⃣ Attach admin to request
  req.user = admin;
  next();
});



exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
