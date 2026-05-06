import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/admin/adminPage.controller.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/admin/adminJob.controller.js";
import { getDashboardStats } from "../controllers/admin/adminSystem.controller.js";
import { adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// API Routes
router.get("/dashboard", adminRoute, getDashboardStats);
router.get("/faqs", adminRoute, getAllFaqs);
router.post("/faqs", adminRoute, createFaq);

router.get("/faqs/:id", adminRoute, getFaqById);
router.put("/faqs/:id", adminRoute, updateFaq);
router.delete("/faqs/:id", adminRoute, deleteFaq);

router.get("/job-categories", getAllCategories);
router.post("/job-categories/create", createCategory);
router.get("/job-categories/:id", getCategoryById);
router.put("/job-categories/edit/:id", updateCategory);
router.delete("/job-categories/delete/:id", deleteCategory);

// Home Page
router.get("/home", (req, res) => res.render("admin-home"));
router.get("/edit-profile", (req, res) => res.render("admin-profile"));
router.post("/edit-profile-submit", (req, res) =>
  res.render("admin-profile-submit"),
);

// Các trang tĩnh
const pages = [
  "home",
  "faq",
  "blog",
  "term",
  "privacy",
  "contact",
  "job-category",
  "pricing",
  "other",
];

pages.forEach((page) => {
  router.get(`/${page}-page`, (req, res) => res.render(`admin-${page}-page`));
  router.post(`/${page}-page/update`, (req, res) =>
    res.render(`admin-${page}-page-update`),
  );
});

const jobAttrs = [
  "job-category",
  "job-location",
  "job-type",
  "job-experience",
  "job-gender",
  "job-salary-range",
];

jobAttrs.forEach((attr) => {
  router.get(`/${attr}/view`, (req, res) => res.render(`admin-${attr}-view`));
  router.get(`/${attr}/create`, (req, res) =>
    res.render(`admin-${attr}-create`),
  );
  router.post(`/${attr}/store`, (req, res) =>
    res.render(`admin-${attr}-store`),
  );
  router.get(`/${attr}/edit/:id`, (req, res) =>
    res.render(`admin-${attr}-edit`),
  );
  router.post(`/${attr}/update/:id`, (req, res) =>
    res.render(`admin-${attr}-update`),
  );
  router.get(`/${attr}/delete/:id`, (req, res) =>
    res.render(`admin-${attr}-delete`),
  );
});

// Company & Industry
const companyAttrs = ["company-location", "company-industry", "company-size"];
companyAttrs.forEach((attr) => {
  router.get(`/${attr}/view`, (req, res) => res.render(`admin-${attr}-view`));
  router.post(`/${attr}/store`, (req, res) =>
    res.render(`admin-${attr}-store`),
  );
  // ... tương tự cho edit/delete
});

// Chức năng quản lý thực thể
router.get("/companies", (req, res) => res.render("admin-companies"));
router.get("/companies-detail/:id", (req, res) =>
  res.render("admin-companies-detail"),
);
router.get("/candidates", (req, res) => res.render("admin-candidates"));

router.get("/advertisement", (req, res) => res.render("admin-advertisement"));
router.post("/advertisement/update", (req, res) =>
  res.render("admin-advertisement-update"),
);

router.get("/banner", (req, res) => res.render("admin-banner"));
router.post("/banner/update", (req, res) => res.render("admin-banner-update"));

router.get("/settings", (req, res) => res.render("admin-settings"));
router.post("/settings/update", (req, res) =>
  res.render("admin-settings-update"),
);

// Subscribers
router.get("/all-subscribers", (req, res) =>
  res.render("admin-all-subscribers"),
);
router.post("/subscribers-send-email-submit", (req, res) =>
  res.render("admin-subscribers-send-email-submit"),
);

const components = ["why-choose", "testimonial", "post", "faq", "package"];

components.forEach((comp) => {
  router.get(`/${comp}/view`, (req, res) => res.render(`admin-${comp}-view`));
  router.get(`/${comp}/create`, (req, res) =>
    res.render(`admin-${comp}-create`),
  );
  router.post(`/${comp}/store`, (req, res) =>
    res.render(`admin-${comp}-store`),
  );
  router.get(`/${comp}/edit/:id`, (req, res) =>
    res.render(`admin-${comp}-edit`),
  );
  router.post(`/${comp}/update/:id`, (req, res) =>
    res.render(`admin-${comp}-update`),
  );
  router.get(`/${comp}/delete/:id`, (req, res) =>
    res.render(`admin-${comp}-delete`),
  );
});

export default router;
