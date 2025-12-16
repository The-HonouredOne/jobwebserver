const JobNews = require("../models/JobNews");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/* -----------------------------------
   CREATE NEWS (ADMIN ONLY)
----------------------------------- */
exports.createJobNews = catchAsync(async (req, res, next) => {
  const newsData = {
    title: req.body.title,
    type: req.body.type,
    department: req.body.department,
    relatedJob: req.body.relatedJob || null,
    shortDescription: req.body.shortDescription,
    fullContent: req.body.fullContent,
    officialLink: req.body.officialLink,
    status: req.body.status || "Published",
    postedBy: req.user.id
  };

  // Add image if uploaded
  if (req.file) {
    newsData.image = req.file.path;
  }

  const news = await JobNews.create(newsData);

  res.status(201).json({
    status: "success",
    data: { news }
  });
});


exports.getAllJobNews = catchAsync(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;

  const filter = { status: "Published" };
  if (type) filter.type = type;

  const totalNews = await JobNews.countDocuments(filter);
  const news = await JobNews.find(filter)
    .sort({ publishDate: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-__v");

  res.status(200).json({
    status: "success",
    results: news.length,
    totalNews,
    totalPages: Math.ceil(totalNews / limit),
    currentPage: Number(page),
    data: { news }
  });
});




exports.getJobNewsById = catchAsync(async (req, res, next) => {
  const news = await JobNews.findById(req.params.id)
    .populate("relatedJob", "title department");

  if (!news) {
    return next(new AppError("News not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { news }
  });
});




exports.updateJobNews = catchAsync(async (req, res, next) => {
  const allowedFields = [
    "title",
    "type",
    "department",
    "shortDescription",
    "fullContent",
    "officialLink",
    "status"
  ];

  // Add image if uploaded
  if (req.file) {
    allowedFields.push("image");
    req.body.image = req.file.path;
  }

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const news = await JobNews.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!news) {
    return next(new AppError("News not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { news }
  });
});




exports.deleteJobNews = catchAsync(async (req, res, next) => {
  const news = await JobNews.findByIdAndUpdate(
    req.params.id,
    { status: "Draft" },
    { new: true }
  );

  if (!news) {
    return next(new AppError("News not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});
