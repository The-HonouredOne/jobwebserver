const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["Central Govt", "State Govt", "Banking", "Railway", "Defence"],
    required: true
  },

  state: {
    type: String,
    required: true,
    default: 'Unknown',
    index: true
  },

  qualification: {
    type: String,
    required: true
  },

  totalVacancies: {
    type: Number,
    required: true
  },

  ageLimit: {
    min: Number,
    max: Number
  },

  salary: {
    min: Number,
    max: Number
  },

  applicationMode: {
    type: String,
    enum: ["Online", "Offline"]
  },

  applicationStartDate: Date,
  applicationEndDate: Date,

  officialNotificationUrl: {
    type: String,
    required: true
  },

  applyLink: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  importantDates: [{
    label: String,
    date: Date
  }],

  status: {
    type: String,
    enum: ["Active", "Expired"],
    default: "Active"
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  }

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);