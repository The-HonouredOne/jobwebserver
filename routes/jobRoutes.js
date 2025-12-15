const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createJobValidator } = require('../validators/jobValidator');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');


const router = express.Router();

router.post( "/", protect, restrictTo("admin"), createJobValidator, createJob);

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.put( "/:id", protect, restrictTo("admin"), updateJob);

router.delete("/:id", protect, restrictTo("admin"), deleteJob);

module.exports = router;

