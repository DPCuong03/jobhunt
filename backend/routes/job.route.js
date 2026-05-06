import express from "express";
import {
  createJob,
  deleteJob,
  updateJob,
  searchJobs,
  getAllJobs,
  getFeaturedJobs,
  getJobsByCategory,
  getJobsById,
  getCompanyJobs,
  getJobApplications,
  getApplicantsForJob,
  getApplicantResume,
  updateApplicationStatus,
  sendJobInquiry,
} from "../controllers/front/job.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
// Job listing with search/filters
router.get("/job-detail/:id", getJobsById);
router.get("/search", searchJobs); // Alias for search
router.get("/featured", getFeaturedJobs);
router.get("/category/:categoryId", getJobsByCategory);
router.post("/:jobId/inquiry", sendJobInquiry); // Job inquiry

// Protected routes (Company)
router.post("/", protectRoute, createJob);
router.put("/:id", protectRoute, updateJob);
router.delete("/:id", protectRoute, deleteJob);
router.get("/company/jobs", protectRoute, getCompanyJobs);
router.get("/company/applications", protectRoute, getJobApplications);
router.get(
  "/company/jobs/:jobId/applicants",
  protectRoute,
  getApplicantsForJob,
);
router.get(
  "/company/applicants/:applicantId/resume",
  protectRoute,
  getApplicantResume,
);
router.put(
  "/company/applications/:applicationId/status",
  protectRoute,
  updateApplicationStatus,
);

export default router;
