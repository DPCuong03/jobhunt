import express from "express";
import {
  getAppliedJobs,
  getDashboard,
  getBookmarkedJobs,
  getEducation,
  deleteEducationRecord,
  createEducationRecord,
  editEducationRecord,
  getEducationRecordById,
  getSkills,
  createSkillRecord,
  editSkillRecord,
  deleteSkillRecord,
  getSkillRecordById,
  getExperience,
  createExperienceRecord,
  editExperienceRecord,
  deleteExperienceRecord,
  getExperienceRecordById,
  getResumes,
  createResumeRecord,
  deleteResumeRecord,
  getProfile,
  updateProfile,
  updatePassword,
  applyJob,
  bookmarkJob,
  removeBookmark,
} from "../controllers/candidate/candidate.controller.js";
import { candidateRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Dashboard and Profile
router.get("/dashboard", candidateRoute, getDashboard);
router.get("/profile", candidateRoute, getProfile);
router.put("/profile/update", candidateRoute, updateProfile);
router.put("/editPassword", candidateRoute, updatePassword);

// Education
router.get("/education", candidateRoute, getEducation);
router.post("/education/create", candidateRoute, createEducationRecord);
router.put("/education/edit/:id", candidateRoute, editEducationRecord);
router.delete("/education/delete/:id", candidateRoute, deleteEducationRecord);
router.get("/education/:id", candidateRoute, getEducationRecordById);

// Skills
router.get("/skills", candidateRoute, getSkills);
router.post("/skills/create", candidateRoute, createSkillRecord);
router.put("/skills/edit/:id", candidateRoute, editSkillRecord);
router.delete("/skills/delete/:id", candidateRoute, deleteSkillRecord);
router.get("/skills/:id", candidateRoute, getSkillRecordById);

// Experience
router.get("/experience", candidateRoute, getExperience);
router.post("/experience/create", candidateRoute, createExperienceRecord);
router.put("/experience/edit/:id", candidateRoute, editExperienceRecord);
router.delete("/experience/delete/:id", candidateRoute, deleteExperienceRecord);
router.get("/experience/:id", candidateRoute, getExperienceRecordById);

// Resume
router.get("/resume", candidateRoute, getResumes);
router.post("/resume/create", candidateRoute, createResumeRecord);
router.delete("/resume/delete/:id", candidateRoute, deleteResumeRecord);

// Applications and Bookmarks
router.get("/applications", candidateRoute, getAppliedJobs);
router.post("/apply-job", candidateRoute, applyJob);
router.get("/bookmarks", candidateRoute, getBookmarkedJobs);
router.post("/bookmark-job", candidateRoute, bookmarkJob);
router.post("/remove-bookmark", candidateRoute, removeBookmark);

export default router;
