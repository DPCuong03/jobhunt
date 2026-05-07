import express from "express";
import {
  getJobCategories,
  getJobLocations,
  getJobTypes,
  getJobExperiences,
  getJobGenders,
  getJobSalaryRanges,
} from "../controllers/front/job.controller.js";

const router = express.Router();

// Public routes for job filter options
router.get("/job-categories", getJobCategories);
router.get("/job-locations", getJobLocations);
router.get("/job-types", getJobTypes);
router.get("/job-experiences", getJobExperiences);
router.get("/job-genders", getJobGenders);
router.get("/job-salary-ranges", getJobSalaryRanges);

export default router;
