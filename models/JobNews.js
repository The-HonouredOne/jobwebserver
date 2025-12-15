const mongoose = require("mongoose");

const jobNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: [
      "Notification",
      "Admit Card",
      "Result",
      "Exam Date",
      "Answer Key",
      "Application Update"
    ],
    required: true
  },

  department: {
    type: String,
    required: true
  },

  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    default: null
  },

  shortDescription: {
    type: String,
    required: true,
    maxlength: 300
  },

  fullContent: {
    type: String,
    required: true
  },

  officialLink: {
    type: String,
    required: true
  },

  publishDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["Published", "Draft"],
    default: "Published"
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("JobNews", jobNewsSchema);
