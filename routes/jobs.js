const express = require("express");

const {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

const router = express.Router();

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").delete(deleteJob).patch(updateJob).get(getSingleJob);

module.exports = router;