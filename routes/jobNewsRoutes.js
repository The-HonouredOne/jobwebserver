const express = require("express");
const router = express.Router();
const jobNewsController = require("../controllers/jobNewsController");
const { protect, restrictTo } = require("../middlewares/authMiddleware");

router.get("/", jobNewsController.getAllJobNews);
router.get("/:id", jobNewsController.getJobNewsById);

router.post(
  "/",
  protect,
  restrictTo("admin"),
  jobNewsController.createJobNews
);

router.put(
  "/:id",
  protect,
  restrictTo("admin"),
  jobNewsController.updateJobNews
);

router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  jobNewsController.deleteJobNews
);

module.exports = router;
