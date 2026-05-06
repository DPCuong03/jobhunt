//JobCategoryController, JobListingController
import prisma from "../../lib/db.js";

BigInt.prototype.toJSON = function () {
  if (typeof this === "bigint") {
    return this.toString();
  }
  return String(this);
};

const jobRelations = {
  include: {
    companies: true,
    job_categories: true,
    job_locations: true,
    job_types: true,
    job_experiences: true,
    job_genders: true,
    job_salary_ranges: true,
  },
};

export const getJobCategories = async (req, res) => {
  try {
    const categories = await prisma.job_categories.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error("Get job categories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobLocations = async (req, res) => {
  try {
    const locations = await prisma.job_locations.findMany({
      orderBy: { name: "asc" },
    });
    res.json(locations);
  } catch (error) {
    console.error("Get job locations error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobTypes = async (req, res) => {
  try {
    const types = await prisma.job_types.findMany({
      orderBy: { name: "asc" },
    });
    res.json(types);
  } catch (error) {
    console.error("Get job types error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobExperiences = async (req, res) => {
  try {
    const experiences = await prisma.job_experiences.findMany({
      orderBy: { name: "asc" },
    });
    res.json(experiences);
  } catch (error) {
    console.error("Get job experiences error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobGenders = async (req, res) => {
  try {
    const genders = await prisma.job_genders.findMany({
      orderBy: { name: "asc" },
    });
    res.json(genders);
  } catch (error) {
    console.error("Get job genders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobSalaryRanges = async (req, res) => {
  try {
    const salaryRanges = await prisma.job_salary_ranges.findMany({
      orderBy: { id: "asc" },
    });
    res.json(salaryRanges);
  } catch (error) {
    console.error("Get job salary ranges error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      responsibility,
      skill,
      education,
      benefit,
      deadline,
      vacancy,
      job_category_id,
      job_location_id,
      job_type_id,
      job_experience_id,
      job_gender_id,
      job_salary_range_id,
      map_code,
      is_featured,
      is_urgent,
    } = req.body;

    const company_id = req.user.id; // Assuming auth middleware sets req.user

    // Validate required fields
    if (
      !title ||
      !description ||
      !deadline ||
      !vacancy ||
      !job_category_id ||
      !job_location_id ||
      !job_type_id ||
      !job_experience_id ||
      !job_gender_id ||
      !job_salary_range_id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if company has active package
    const activeOrder = await prisma.orders.findFirst({
      where: {
        company_id: parseInt(company_id),
        currently_active: 1,
        expire_date: {
          gte: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
        },
      },
      select: {
        id: true,
        company_id: true,
        package_id: true,
        order_no: true,
        paid_amount: true,
        payment_method: true,
        start_date: true,
        expire_date: true,
        currently_active: true,
      },
    });

    if (!activeOrder) {
      return res.status(403).json({ message: "No active package found" });
    }

    const packageInfo = await prisma.packages.findUnique({
      where: { id: parseInt(activeOrder.package_id) },
    });

    if (!packageInfo) {
      return res.status(403).json({ message: "No package information found" });
    }

    // Check job posting limits
    const existingJobsCount = await prisma.jobs.count({
      where: { company_id: parseInt(company_id) },
    });

    if (existingJobsCount >= packageInfo.total_allowed_jobs) {
      return res.status(403).json({ message: "Job posting limit reached" });
    }

    // Check featured job limits if is_featured
    if (is_featured) {
      const featuredJobsCount = await prisma.jobs.count({
        where: {
          company_id: parseInt(company_id),
          is_featured: 1,
        },
      });

      if (featuredJobsCount >= packageInfo.total_allowed_featured_jobs) {
        return res.status(403).json({ message: "Featured job limit reached" });
      }
    }

    // Create the job
    const job = await prisma.jobs.create({
      data: {
        company_id: parseInt(company_id),
        title,
        description,
        responsibility,
        skill,
        education,
        benefit,
        deadline,
        vacancy: parseInt(vacancy),
        job_category_id: parseInt(job_category_id),
        job_location_id: parseInt(job_location_id),
        job_type_id: parseInt(job_type_id),
        job_experience_id: parseInt(job_experience_id),
        job_gender_id: parseInt(job_gender_id),
        job_salary_range_id: parseInt(job_salary_range_id),
        map_code,
        is_featured: is_featured ? 1 : 0,
        is_urgent: is_urgent ? 1 : 0,
      },
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;

    // Check if job exists and belongs to company
    const job = await prisma.jobs.findFirst({
      where: {
        id: parseInt(id),
        company_id: parseInt(company_id),
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete related applications and bookmarks
    await prisma.candidate_applications.deleteMany({
      where: { job_id: parseInt(id) },
    });

    await prisma.candidate_bookmarks.deleteMany({
      where: { job_id: parseInt(id) },
    });

    // Delete the job
    await prisma.jobs.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      responsibility,
      skill,
      education,
      benefit,
      deadline,
      vacancy,
      job_category_id,
      job_location_id,
      job_type_id,
      job_experience_id,
      job_gender_id,
      job_salary_range_id,
      map_code,
      is_featured,
      is_urgent,
    } = req.body;

    const company_id = req.user.id;

    // Check if job exists and belongs to company
    const existingJob = await prisma.jobs.findFirst({
      where: {
        id: parseInt(id),
        company_id: parseInt(company_id),
      },
    });

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check featured job limits if changing to featured
    if (is_featured && !existingJob.is_featured) {
      const activeOrder = await prisma.orders.findFirst({
        where: {
          company_id: parseInt(company_id),
          currently_active: 1,
          expire_date: {
            gte: new Date().toISOString().split("T")[0],
          },
        },
        select: {
          package_id: true,
        },
      });

      if (activeOrder) {
        const packageInfo = await prisma.packages.findUnique({
          where: { id: parseInt(activeOrder.package_id) },
        });

        if (!packageInfo) {
          return res
            .status(403)
            .json({ message: "Package information missing" });
        }

        const featuredJobsCount = await prisma.jobs.count({
          where: {
            company_id: parseInt(company_id),
            is_featured: 1,
            id: { not: parseInt(id) }, // Exclude current job
          },
        });

        if (featuredJobsCount >= packageInfo.total_allowed_featured_jobs) {
          return res
            .status(403)
            .json({ message: "Featured job limit reached" });
        }
      }
    }

    // Update the job
    const updatedJob = await prisma.jobs.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        responsibility,
        skill,
        education,
        benefit,
        deadline,
        vacancy: parseInt(vacancy),
        job_category_id: parseInt(job_category_id),
        job_location_id: parseInt(job_location_id),
        job_type_id: parseInt(job_type_id),
        job_experience_id: parseInt(job_experience_id),
        job_gender_id: parseInt(job_gender_id),
        job_salary_range_id: parseInt(job_salary_range_id),
        map_code,
        is_featured: is_featured ? 1 : 0,
        is_urgent: is_urgent ? 1 : 0,
      },
    });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const company_id = req.user.id;

    const jobs = await prisma.jobs.findMany({
      where: { company_id: parseInt(company_id) },
      orderBy: { id: "desc" },
      ...jobRelations,
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Get company jobs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const company_id = req.user.id;

    const jobs = await prisma.jobs.findMany({
      where: { company_id: parseInt(company_id) },
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
      },
    });

    const jobIds = jobs.map((job) => BigInt(job.id));
    const applications = await prisma.candidate_applications.findMany({
      where: { job_id: { in: jobIds } },
      select: {
        id: true,
        candidate_id: true,
        job_id: true,
        cover_letter: true,
        status: true,
        created_at: true,
      },
    });

    const candidateIds = [
      ...new Set(applications.map((app) => BigInt(app.candidate_id))),
    ];
    const candidates = await prisma.candidates.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    const candidateMap = new Map(candidates.map((c) => [c.id.toString(), c]));
    const applicationsByJob = applications.reduce((acc, app) => {
      const jobKey = app.job_id.toString();
      acc[jobKey] = acc[jobKey] || [];
      acc[jobKey].push({
        ...app,
        candidate: candidateMap.get(app.candidate_id.toString()) || null,
      });
      return acc;
    }, {});

    const jobsWithApplications = jobs.map((job) => ({
      ...job,
      applications: applicationsByJob[job.id.toString()] || [],
    }));

    res.json({ jobs: jobsWithApplications });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const company_id = req.user.id;

    const job = await prisma.jobs.findFirst({
      where: {
        id: BigInt(jobId),
        company_id: parseInt(company_id),
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applications = await prisma.candidate_applications.findMany({
      where: { job_id: BigInt(jobId) },
      select: {
        id: true,
        candidate_id: true,
        job_id: true,
        cover_letter: true,
        status: true,
        created_at: true,
      },
    });

    const candidateIds = [
      ...new Set(applications.map((app) => BigInt(app.candidate_id))),
    ];
    const candidates = await prisma.candidates.findMany({
      where: { id: { in: candidateIds } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        photo: true,
      },
    });

    const candidateMap = new Map(candidates.map((c) => [c.id.toString(), c]));
    const applicants = applications.map((application) => ({
      ...application,
      candidate: candidateMap.get(application.candidate_id.toString()) || null,
    }));

    res.json({ applicants });
  } catch (error) {
    console.error("Get applicants for job error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApplicantResume = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const candidate = await prisma.candidates.findUnique({
      where: { id: BigInt(applicantId) },
      select: {
        id: true,
        name: true,
        designation: true,
        username: true,
        email: true,
        photo: true,
        biography: true,
        phone: true,
        country: true,
        address: true,
        state: true,
        city: true,
        zip_code: true,
        gender: true,
        marital_status: true,
        date_of_birth: true,
        website: true,
        status: true,
      },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const [education, experiences, skills, awards, resumes] = await Promise.all(
      [
        prisma.candidate_education.findMany({
          where: { candidate_id: BigInt(applicantId) },
        }),
        prisma.candidate_experiences.findMany({
          where: { candidate_id: BigInt(applicantId) },
        }),
        prisma.candidate_skills.findMany({
          where: { candidate_id: BigInt(applicantId) },
        }),
        prisma.candidate_awards.findMany({
          where: { candidate_id: BigInt(applicantId) },
        }),
        prisma.candidate_resumes.findMany({
          where: { candidate_id: BigInt(applicantId) },
        }),
      ],
    );

    res.json({
      candidate: {
        ...candidate,
        candidate_education: education,
        candidate_experiences: experiences,
        candidate_skills: skills,
        candidate_awards: awards,
        candidate_resumes: resumes,
      },
    });
  } catch (error) {
    console.error("Get applicant resume error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const company_id = req.user.id;

    const application = await prisma.candidate_applications.findUnique({
      where: { id: BigInt(applicationId) },
      select: {
        id: true,
        candidate_id: true,
        job_id: true,
        cover_letter: true,
        status: true,
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(application.job_id) },
      select: {
        id: true,
        company_id: true,
        title: true,
      },
    });

    if (!job || job.company_id !== parseInt(company_id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedApplication = await prisma.candidate_applications.update({
      where: { id: BigInt(applicationId) },
      data: { status },
      select: {
        id: true,
        candidate_id: true,
        job_id: true,
        cover_letter: true,
        status: true,
        created_at: true,
      },
    });

    const candidate = await prisma.candidates.findUnique({
      where: { id: BigInt(updatedApplication.candidate_id) },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.json({
      message: "Application status updated",
      application: {
        ...updatedApplication,
        candidate,
        job: { title: job.title },
      },
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendJobInquiry = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(jobId) },
      select: {
        id: true,
        title: true,
        company_id: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const company = await prisma.companies.findUnique({
      where: { id: BigInt(job.company_id) },
      select: {
        company_name: true,
        email: true,
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Send job inquiry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchJobs = async (req, res) => {
  return getAllJobs(req, res);
};

export const getAllJobs = async (req, res) => {
  try {
    // 1. Lấy thêm các trường mà Frontend gửi lên
    const {
      title,
      category,
      location,
      type,
      experience,
      gender,
      salary,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {
      ...(title && { title: { contains: title, mode: "insensitive" } }),
      // Sử dụng parseInt để ép kiểu về số cho đúng với Database ID
      ...(category && { job_category_id: parseInt(category) }),
      ...(location && { job_location_id: parseInt(location) }),
      ...(type && { job_type_id: parseInt(type) }),
      // Thêm các bộ lọc mới
      ...(experience && { job_experience_id: parseInt(experience) }),
      ...(gender && { job_gender_id: parseInt(gender) }),
      ...(salary && { job_salary_range_id: parseInt(salary) }),
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Prisma lấy luôn các bảng liên quan trong 1 nốt nhạc
    const jobs = await prisma.jobs.findMany({
      where,
      orderBy: { id: "desc" },
      skip,
      take: parseInt(limit),
      ...jobRelations, // Sử dụng object include đã định nghĩa ở trên
    });

    const total = await prisma.jobs.count({ where });

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

export const getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany({
      where: { is_featured: 1 },
      orderBy: { id: "desc" },
      take: 10,
      ...jobRelations,
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Get featured jobs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await prisma.jobs.findMany({
      where: { job_category_id: parseInt(categoryId) },
      orderBy: { id: "desc" },
      skip,
      take: parseInt(limit),
      ...jobRelations,
    });

    const total = await prisma.jobs.count({
      where: { job_category_id: parseInt(categoryId) },
    });

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get jobs by category error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobsById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobs.findUnique({
      where: { id: BigInt(id) },
      ...jobRelations,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const relatedJobs = await prisma.jobs.findMany({
      where: {
        job_category_id: job.job_category_id,
        id: { not: job.id },
      },
      take: 5,
      orderBy: { id: "desc" },
      ...jobRelations,
    });

    res.json({ job, relatedJobs });
  } catch (error) {
    console.error("Get job by id error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
