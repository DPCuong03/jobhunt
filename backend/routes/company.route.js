import {
  createCheckoutSession,
  createOrder,
  updatePassword,
} from "../controllers/company/company.controller.js";
import { companyRoute } from "../middleware/auth.middleware.js";
import {
  getDashboard,
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyMetadata,
  getOrder,
  getApplicationsForCompany,
  getCandidateResume,
  updateApplicationStatus,
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobDetail,
} from "../controllers/company/company.controller.js";
import express from "express";

const router = express.Router();

// Public routes
// Job listing with search/filters
router.get("/dashboard", companyRoute, getDashboard);
router.get("/profile", companyRoute, getCompanyProfile);
router.put("/profile/update", companyRoute, updateCompanyProfile);
router.get("/metadata", companyRoute, getCompanyMetadata);
router.get("/order", companyRoute, getOrder);
router.get("/applications", companyRoute, getApplicationsForCompany);
router.get("/resume/:candidateId", companyRoute, getCandidateResume);
router.put(
  "/applications/:applicationId/status",
  companyRoute,
  updateApplicationStatus,
);

router.get("/jobs/all-jobs", companyRoute, getAllJobs);
router.post("/jobs/create", companyRoute, createJob);
router.put("/jobs/edit/:id", companyRoute, updateJob);
router.delete("/jobs/delete/:id", companyRoute, deleteJob);
router.get("/jobs/:id", companyRoute, getJobDetail);

router.post("/create-checkout-session", companyRoute, createCheckoutSession);
router.post("/create-order", companyRoute, createOrder);
router.put("/editPassword", companyRoute, updatePassword);

export default router;
