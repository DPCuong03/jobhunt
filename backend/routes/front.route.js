import {
  getAllCompanies,
  getCompaniesById,
  getCompanyFoundedOn,
  getCompanyIndustries,
  getCompanyLocations,
  getCompanySizes,
} from "../controllers/front/company.controller.js";
import {
  getJobCategories,
  //getJobByCategories,
  getJobsById,
  getAllJobs,
  getJobLocations,
  getJobTypes,
  getJobExperiences,
  getJobGenders,
  getJobSalaryRanges,
} from "../controllers/front/job.controller.js";

import { login, signup } from "../controllers/auth.controller.js";

import express from "express";
import { getJobMetadata } from "../controllers/company/company.controller.js";

const router = express.Router();

router.get("/job-listing", getAllJobs);
router.get("/job-detail/:id", getJobsById);

router.get("/job-categories", getJobCategories);
router.get("/job-locations", getJobLocations);
router.get("/job-types", getJobTypes);
router.get("/job-experiences", getJobExperiences);
router.get("/job-genders", getJobGenders);
router.get("/job-salary-ranges", getJobSalaryRanges);
router.get("/metadata/job-info", getJobMetadata);

router.get("/company-listing", getAllCompanies);
router.get("/company-detail/:id", getCompaniesById);

router.get("/company-industries", getCompanyIndustries);
router.get("/company-locations", getCompanyLocations);
router.get("/company-sizes", getCompanySizes);
router.get("/company-founded", getCompanyFoundedOn);

export default router;
