const { body } = require("express-validator");

exports.createJobValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("category").isIn([
    "Central Govt",
    "State Govt",
    "Banking",
    "Railway",
    "Defence"
  ]).withMessage("Invalid category"),
  body("state").trim().notEmpty().isLength({ max: 100 }).withMessage("State/Region is required and must be under 100 characters"),
  body("qualification").trim().notEmpty().withMessage("Qualification is required"),
  body("totalVacancies").isInt({ min: 1 }).withMessage("Total vacancies must be a positive number"),
  body("salary.min").optional().isNumeric().withMessage("Salary min must be a number"),
  body("salary.max").optional().isNumeric().withMessage("Salary max must be a number"),
  body("applicationStartDate").optional().isISO8601().withMessage("Invalid start date format"),
  body("applicationEndDate").optional().isISO8601().withMessage("Invalid end date format"),
  body("applyLink").isURL().withMessage("Apply link must be a valid URL"),
  body("officialNotificationUrl").isURL().withMessage("Official notification URL must be valid")
];
