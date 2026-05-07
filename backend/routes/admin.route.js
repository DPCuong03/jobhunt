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

export default router;
