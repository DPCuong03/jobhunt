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

router.get("/terms-of-use", (req, res) => res.render("terms"));
router.get("/privacy-policy", (req, res) => res.render("privacy"));
//router.get("/job-categories", getJobByCategories);
router.get("/blog", (req, res) => res.render("blog"));
router.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  res.render("post", { postId });
});
router.get("/faq", (req, res) => res.render("faq"));
router.get("/contact", (req, res) => res.render("contact"));
router.post("/contact/submit", (req, res) => res.render("contact-submit"));
router.get("/pricing", (req, res) => res.render("pricing"));

router.get("/job-listing", getAllJobs);
router.get("/job-detail/:id", getJobsById);
router.post("/job-enquiry/email", (req, res) => res.render("job-enquiry"));

router.get("/job-categories", getJobCategories);
router.get("/job-locations", getJobLocations);
router.get("/job-types", getJobTypes);
router.get("/job-experiences", getJobExperiences);
router.get("/job-genders", getJobGenders);
router.get("/job-salary-ranges", getJobSalaryRanges);
router.get("/metadata/job-info", getJobMetadata);

router.get("/company-listing", getAllCompanies);
router.get("/company-detail/:id", getCompaniesById);
router.post("/company-enquiry/email", (req, res) =>
  res.render("company-enquiry"),
);

router.get("/company-industries", getCompanyIndustries);
router.get("/company-locations", getCompanyLocations);
router.get("/company-sizes", getCompanySizes);
router.get("/company-founded", getCompanyFoundedOn);

router.post("/subcriber/send-email", (req, res) =>
  res.render("subscriber-email"),
);
router.get("subcribler/verify/:email/:token", (req, res) => {
  const { email, token } = req.params;
  res.render("subscriber-verify", { email, token });
});

// COMPANY

router.get("/company-signup-verify/:token/:email", (req, res) =>
  res.render("company-signup-submit"),
);
router.get("/forget-password/company", (req, res) =>
  res.render("company-forget-password"),
);
router.get("/forget-password/company/submit", (req, res) =>
  res.render("company-forget-password-submit"),
);
router.get("/reset-password/company/{token}/{email}", (req, res) =>
  res.render("company-reset-password"),
);
router.post("/reset-password/company/submit", (req, res) =>
  res.render("company-reset-password-submit"),
);

//CANDIDATE

router.get("/candidate-signup-verify/:token/:email", (req, res) =>
  res.render("candidate-signup-verify"),
);

router.get("/forget-password/candidate", (req, res) =>
  res.render("candidate-forget-password"),
);

router.post("/forget-password/candidate/submit", (req, res) =>
  res.render("candidate-forget-password-submit"),
);

router.get("/reset-password/candidate/:token/:email", (req, res) =>
  res.render("candidate-reset-password"),
);

router.post("/reset-password/candidate/submit", (req, res) =>
  res.render("candidate-reset-password-submit"),
);

router.get("/candidate/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
});

router.get("/company/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out successfully" });
});

//ADMIN
router.get("/admin/login", (req, res) => res.render("admin-login"));
router.post("/admin/login-submit", (req, res) =>
  res.render("admin-login-submit"),
);
router.get("/admin/logout", (req, res) => res.render("admin-logout"));
router.get("/admin/forget-password", (req, res) =>
  res.render("admin-forget-password"),
);
router.post("/admin/forget-password-submit", (req, res) =>
  res.render("admin-forget-password-submit"),
);
router.get("/admin/reset-password/:token/:email", (req, res) =>
  res.render("admin-reset-password"),
);

router.post("/admin/reset-password-submit", (req, res) =>
  res.render("admin-reset-password-submit"),
);

export default router;
