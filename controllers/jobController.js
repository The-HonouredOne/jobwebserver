const Job = require("../models/Job");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { validationResult } = require("express-validator");

/* ----------------------------------------
   CREATE JOB (ADMIN ONLY)
---------------------------------------- */
exports.createJob = catchAsync(async (req, res, next) => {
  //  Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }

  //  Create job safely
  const job = await Job.create({
    title: req.body.title,
    department: req.body.department,
    state: req.body.state,
    category: req.body.category,
    qualification: req.body.qualification,
    totalVacancies: req.body.totalVacancies,
    ageLimit: req.body.ageLimit,
    salary: req.body.salary,
    applicationMode: req.body.applicationMode,
    applicationStartDate: req.body.applicationStartDate,
    applicationEndDate: req.body.applicationEndDate,
    applyLink: req.body.applyLink,
    officialNotificationUrl: req.body.officialNotificationUrl,
    description: req.body.description,
    postedBy: req.user.id
  });

  res.status(201).json({
    status: "success",
    data: { job }
  });
});




exports.getAllJobs = catchAsync(async (req, res, next) => {
  const {
    category,
    qualification,
    title,
    state,
    page = 1,
    limit = 10
  } = req.query;

  const filter = { status: "Active" };

  if (category) filter.category = category;
  if (qualification) filter.qualification = qualification;
  if (title) filter.title = { $regex: title, $options: 'i' };
  if (state) filter.state = { $regex: state, $options: 'i' };

  const totalJobs = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-__v");

  res.status(200).json({
    status: "success",
    results: jobs.length,
    totalJobs,
    totalPages: Math.ceil(totalJobs / limit),
    currentPage: Number(page),
    data: { jobs }
  });
});




exports.getJobById = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { job }
  });
});



exports.updateJob = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "title",
    "department",
    "state",
    "qualification",
    "totalVacancies",
    "salary",
    "applicationEndDate",
    "status"
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const job = await Job.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { job }
  });
});



exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    { status: "Expired" },
    { new: true }
  );

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});
