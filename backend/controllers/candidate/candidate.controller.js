import prisma from "../../lib/db.js";
import bcrypt from "bcryptjs";

const candidateRelations = {
  include: {
    candidate_applications: true,
    candidate_bookmarks: true,
    candidate_award: true,
    candidate_education: true,
    candidate_experiences: true,
    candidate_skills: true,
    candidate_resumes: true,
  },
};
/* --- DASHBOARD & PROFILE --- */

export const getDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [appliedCount, bookmarkedCount] = await Promise.all([
      prisma.candidate_applications.count({
        where: { candidate_id: candidateId },
      }),
      prisma.candidate_bookmarks.count({
        where: { candidate_id: candidateId },
      }),
    ]);

    res.json({
      applied_jobs: appliedCount,
      bookmarked_jobs: bookmarkedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* --- CV / RESUME COMPONENTS (CRUD) --- */

// Quản lý Education
export const addEducation = async (req, res) => {
  try {
    const education = await prisma.candidate_education.create({
      data: { ...req.body, candidate_id: req.user.id },
    });
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error adding education" });
  }
};

// Quản lý Experience
export const addExperience = async (req, res) => {
  try {
    const experience = await prisma.candidate_experiences.create({
      data: { ...req.body, candidate_id: req.user.id },
    });
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error adding experience" });
  }
};

/* --- JOB APPLICATIONS & BOOKMARKS --- */

export const applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const candidate_id = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!coverLetter || !coverLetter.trim()) {
      return res.status(400).json({ message: "Cover letter is required" });
    }

    // Kiểm tra trùng lặp đơn ứng tuyển
    const existing = await prisma.candidate_applications.findFirst({
      where: { candidate_id, job_id: BigInt(jobId) },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already applied for this job" });
    }

    const application = await prisma.candidate_applications.create({
      data: {
        candidate_id,
        job_id: BigInt(jobId),
        cover_letter: coverLetter.trim(),
        status: "Applied",
      },
    });

    res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    console.error("[APPLY_JOB_ERROR]:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidate_id = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if already bookmarked
    const existing = await prisma.candidate_bookmarks.findFirst({
      where: { candidate_id, job_id: BigInt(jobId) },
    });

    if (existing) {
      return res.status(400).json({ message: "Job already bookmarked" });
    }

    const bookmark = await prisma.candidate_bookmarks.create({
      data: {
        candidate_id,
        job_id: BigInt(jobId),
      },
    });

    res.status(201).json({ message: "Job bookmarked successfully", bookmark });
  } catch (error) {
    console.error("[BOOKMARK_JOB_ERROR]:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidate_id = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if bookmark exists
    const bookmark = await prisma.candidate_bookmarks.findFirst({
      where: { candidate_id, job_id: BigInt(jobId) },
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await prisma.candidate_bookmarks.delete({
      where: { id: bookmark.id },
    });

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("[REMOVE_BOOKMARK_ERROR]:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const applications = await prisma.candidate_applications.findMany({
      where: { candidate_id: userId },
      select: {
        id: true, // SL (Số thứ tự hoặc ID đơn)
        status: true, // Trạng thái: Applied, Approved, v.v.
        job_id: true, // ID công việc để liên kết với chi tiết công việc
        // cover_letter: true, // Lấy nếu bạn muốn nhấn vào nút "Cover Letter" để xem nội dung
        jobs: {
          select: {
            title: true, // Job Title
            companies: {
              select: {
                company_name: true, // Company Name
              },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("[GET_APPLIED_JOBS_ERROR]:", error);
    return res.status(500).json({ message: "Error fetching applications" });
  }
};

export const getBookmarkedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const bookmarks = await prisma.candidate_bookmarks.findMany({
      where: { candidate_id: userId },
      select: {
        id: true,
        job_id: true,
        candidate_id: true,
        jobs: {
          select: {
            title: true,
            companies: {
              select: {
                company_name: true,
              },
            },
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json(bookmarks);
  } catch (error) {
    console.error("[GET_BOOKMARKED_JOBS_ERROR]:", error);
    return res.status(500).json({ message: "Error fetching bookmarked jobs" });
  }
};

export const getEducation = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const education = await prisma.candidate_education.findMany({
      where: { candidate_id: userId },
      select: {
        id: true,
        level: true,
        institute: true,
        degree: true,
        passing_year: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education" });
  }
};

export const deleteEducationRecord = async (req, res) => {
  try {
    const educationId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const education = await prisma.candidate_education.findUnique({
      where: { id: educationId, candidate_id: userId },
    });

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    await prisma.candidate_education.delete({ where: { id: educationId } });
    res.json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting education" });
  }
};

export const createEducationRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { level, institute, degree, passing_year } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const education = await prisma.candidate_education.create({
      data: {
        candidate_id: userId,
        level,
        institute,
        degree,
        passing_year,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error creating education" });
    console.error("[CREATE_EDUCATION_ERROR]:", error);
  }
};

export const editEducationRecord = async (req, res) => {
  try {
    const educationId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { level, institute, degree, passing_year } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const education = await prisma.candidate_education.findUnique({
      where: { id: educationId, candidate_id: userId },
    });

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    const updatedEducation = await prisma.candidate_education.update({
      where: { id: educationId },
      data: {
        level,
        institute,
        degree,
        passing_year,
        updated_at: new Date(),
      },
    });

    res.json(updatedEducation);
  } catch (error) {
    res.status(500).json({ message: "Error updating education" });
    console.error("[EDIT_EDUCATION_ERROR]:", error);
  }
};

export const getEducationRecordById = async (req, res) => {
  try {
    const educationId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const education = await prisma.candidate_education.findUnique({
      where: { id: educationId, candidate_id: userId },
    });
    if (!education) {
      return res.status(404).json({ message: "Education record not found" });
    }
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education record" });
    console.error("[GET_EDUCATION_BY_ID_ERROR]:", error);
  }
};

export const getSkills = async (req, res) => {
  try {
    const userId = req.user?.id;
    const skills = await prisma.candidate_skills.findMany({
      where: { candidate_id: userId },
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skills" });
    console.error("[GET_SKILLS_ERROR]:", error);
  }
};

export const createSkillRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, percentage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const skill = await prisma.candidate_skills.create({
      data: {
        candidate_id: userId,
        name,
        percentage,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Error creating skill" });
    console.error("[CREATE_SKILL_ERROR]:", error);
  }
};

export const editSkillRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const skillId = parseInt(req.params.id);
    const { name, percentage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const skill = await prisma.candidate_skills.findUnique({
      where: { id: skillId, candidate_id: userId },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const updatedSkill = await prisma.candidate_skills.update({
      where: { id: skillId },
      data: {
        name,
        percentage,
        updated_at: new Date(),
      },
    });

    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: "Error updating skill" });
    console.error("[EDIT_SKILL_ERROR]:", error);
  }
};

export const deleteSkillRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const skillId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const skill = await prisma.candidate_skills.findUnique({
      where: { id: skillId, candidate_id: userId },
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await prisma.candidate_skills.delete({
      where: { id: skillId },
    });

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting skill" });
    console.error("[DELETE_SKILL_ERROR]:", error);
  }
};

export const getSkillRecordById = async (req, res) => {
  try {
    const skillId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const skill = await prisma.candidate_skills.findUnique({
      where: { id: skillId, candidate_id: userId },
    });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: "Error fetching skill record" });
    console.error("[GET_SKILL_BY_ID_ERROR]:", error);
  }
};

export const getExperience = async (req, res) => {
  try {
    const userId = req.user?.id;
    const experience = await prisma.candidate_experiences.findMany({
      where: { candidate_id: userId },
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience" });
    console.error("[GET_EXPERIENCE_ERROR]:", error);
  }
};

export const createExperienceRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { company, designation, start_date, end_date } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const experience = await prisma.candidate_experiences.create({
      data: {
        candidate_id: userId,
        company,
        designation,
        start_date,
        end_date,
      },
    });
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error creating experience record" });
    console.error("[CREATE_EXPERIENCE_ERROR]:", error);
  }
};

export const editExperienceRecord = async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    const userId = req.user?.id;
    const { company, designation, start_date, end_date } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const experience = await prisma.candidate_experiences.findUnique({
      where: { id: experienceId, candidate_id: userId },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience record not found" });
    }

    const updatedExperience = await prisma.candidate_experiences.update({
      where: { id: experienceId },
      data: {
        company,
        designation,
        start_date,
        end_date,
      },
    });
    res.json(updatedExperience);
  } catch (error) {
    res.status(500).json({ message: "Error updating experience record" });
    console.error("[EDIT_EXPERIENCE_ERROR]:", error);
  }
};

export const deleteExperienceRecord = async (req, res) => {
  try {
    const experienceId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const experience = await prisma.candidate_experiences.findUnique({
      where: { id: experienceId, candidate_id: userId },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience record not found" });
    }

    await prisma.candidate_experiences.delete({
      where: { id: experienceId },
    });
    res.json({ message: "Experience record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience record" });
    console.error("[DELETE_EXPERIENCE_ERROR]:", error);
  }
};

export const getExperienceRecordById = async (req, res) => {
  try {
    const experienceId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const experience = await prisma.candidate_experiences.findUnique({
      where: { id: experienceId, candidate_id: userId },
    });

    if (!experience) {
      return res.status(404).json({ message: "Experience record not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience record" });
    console.error("[GET_EXPERIENCE_BY_ID_ERROR]:", error);
  }
};

export const getResumes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const resumes = await prisma.candidate_resumes.findMany({
      where: { candidate_id: userId },
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
    console.error("[GET_RESUMES_ERROR]:", error);
  }
};

export const createResumeRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, file } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const resume = await prisma.candidate_resumes.create({
      data: {
        candidate_id: userId,
        name,
        file,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error creating resume record" });
    console.error("[CREATE_RESUME_ERROR]:", error);
  }
};

export const deleteResumeRecord = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const resume = await prisma.candidate_resumes.findUnique({
      where: { id: resumeId, candidate_id: userId },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume record not found" });
    }

    await prisma.candidate_resumes.delete({
      where: { id: resumeId },
    });
    res.json({ message: "Resume record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume record" });
    console.error("[DELETE_RESUME_ERROR]:", error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const candidate = await prisma.candidates.findUnique({
      where: { id: userId },
    });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error("[GET_PROFILE_ERROR]:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = req.body;

    // Chuẩn hóa dữ liệu ngày tháng nếu có
    if (data.date_of_birth) {
      data.date_of_birth = new Date(data.date_of_birth).toISOString();
    }

    const updated = await prisma.candidates.update({
      where: { id: userId },
      data: {
        name: data.name,
        designation: data.designation,
        photo: data.photo, // Đây sẽ là 'candidate_photo_123.jpg'
        biography: data.biography,
        phone: data.phone,
        country: data.country,
        address: data.address,
        state: data.state,
        city: data.city,
        zip_code: data.zip_code,
        gender: data.gender,
        marital_status: data.marital_status,
        date_of_birth: data.date_of_birth,
        website: data.website, // Thêm website nếu có trong schema
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user?.id; // Lấy ID từ middleware verifyToken
    const { currentPassword, newPassword } = req.body;

    // 1. Tìm ứng viên trong DB
    const candidate = await prisma.candidates.findUnique({
      where: { id: userId },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // 2. Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, candidate.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 3. Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Cập nhật vào DB
    await prisma.candidates.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const { job_id } = req.body;
    const candidate_id = req.user.id;

    const bookmark = await prisma.candidate_bookmarks.findFirst({
      where: { candidate_id, job_id },
    });

    if (bookmark) {
      await prisma.candidate_bookmarks.delete({ where: { id: bookmark.id } });
      return res.json({ message: "Bookmark removed" });
    }

    await prisma.candidate_bookmarks.create({
      data: { candidate_id, job_id },
    });
    res.json({ message: "Job bookmarked" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
