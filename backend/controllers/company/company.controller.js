import prisma from "../../lib/db.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getDashboard = async (req, res) => {
  try {
    const companyId = req.user.id;
    const company = await prisma.companies.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        company_name: true,
        person_name: true,
        username: true,
        email: true,
        status: true,
      },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Get job statistics
    const totalJobs = await prisma.jobs.count({
      where: { company_id: companyId },
    });

    const urgentJobs = await prisma.jobs.count({
      where: { company_id: companyId, is_urgent: 1 },
    });

    const featuredJobs = await prisma.jobs.count({
      where: { company_id: companyId, is_featured: 1 },
    });

    res.status(200).json({
      company,
      stats: {
        totalJobs,
        urgentJobs,
        featuredJobs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.id;
    const company = await prisma.companies.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        company_name: true,
        person_name: true,
        username: true,
        email: true,
        logo: true,
        phone: true,
        address: true,
        website: true,
        description: true,
        founded_on: true,
        company_location_id: true,
        company_size_id: true,
        company_industry_id: true,
        oh_mon: true,
        oh_tue: true,
        oh_wed: true,
        oh_thu: true,
        oh_fri: true,
        oh_sat: true,
        oh_sun: true,
        map_code: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        instagram: true,
      },
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user.id;
    const {
      company_name,
      person_name,
      phone,
      address,
      website,
      description,
      founded_on,
      company_location_id,
      company_size_id,
      company_industry_id,
      oh_mon,
      oh_tue,
      oh_wed,
      oh_thu,
      oh_fri,
      oh_sat,
      oh_sun,
      map_code,
      facebook,
      twitter,
      linkedin,
      instagram,
      logo,
    } = req.body;

    const updateData = {
      company_name: company_name || undefined,
      person_name: person_name || undefined,
      phone: phone || undefined,
      address: address || undefined,
      website: website || undefined,
      description: description || undefined,
      founded_on: founded_on || undefined,
      company_location_id: company_location_id
        ? BigInt(company_location_id)
        : undefined,
      company_size_id: company_size_id ? BigInt(company_size_id) : undefined,
      company_industry_id: company_industry_id
        ? BigInt(company_industry_id)
        : undefined,
      oh_mon: oh_mon || undefined,
      oh_tue: oh_tue || undefined,
      oh_wed: oh_wed || undefined,
      oh_thu: oh_thu || undefined,
      oh_fri: oh_fri || undefined,
      oh_sat: oh_sat || undefined,
      oh_sun: oh_sun || undefined,
      map_code: map_code || undefined,
      facebook: facebook || undefined,
      twitter: twitter || undefined,
      linkedin: linkedin || undefined,
      instagram: instagram || undefined,
      logo: logo || undefined,
    };

    const updated = await prisma.companies.update({
      where: { id: companyId },
      data: updateData,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentOrder = await prisma.orders.findMany({
      where: { company_id: userId },
      select: {
        company_id: true,
        package_id: true,
        packages: {
          select: {
            package_name: true,
          },
        },
        payment_method: true,
        start_date: true,
        expire_date: true,
        currently_active: true,
      },
    });
    res.status(200).json(paymentOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationsForCompany = async (req, res) => {
  try {
    const companyId = req.user.id;

    // Get all jobs for this company
    const jobs = await prisma.jobs.findMany({
      where: { company_id: companyId },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get all applications for these jobs
    const applications = await prisma.candidate_applications.findMany({
      where: {
        job_id: {
          in: jobIds,
        },
      },
      select: {
        id: true,
        status: true,
        cover_letter: true,
        created_at: true,
        job_id: true,
        candidate_id: true,
        jobs: {
          select: {
            title: true,
          },
        },
        candidates: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("[GET_APPLICATIONS_FOR_COMPANY_ERROR]:", error);
    return res.status(500).json({ message: "Error fetching applications" });
  }
};

export const createJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      responsibility,
      skill,
      education,
      benefit,
      deadline,
      vacancy,
      jobCategory,
      jobLocation,
      jobType,
      jobExperience,
      jobGender,
      jobSalaryRange,
      isFeatured,
      isUrgent,
    } = req.body;

    const newJob = await prisma.jobs.create({
      data: {
        company_id: userId,
        title,
        description,
        responsibility,
        skill,
        education,
        benefit,
        deadline,
        vacancy: parseInt(vacancy),
        job_category_id: jobCategory,
        job_location_id: jobLocation,
        job_type_id: jobType,
        job_experience_id: jobExperience,
        job_gender_id: jobGender,
        job_salary_range_id: jobSalaryRange,
        is_featured: isFeatured,
        is_urgent: isUrgent,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    res.status(200).json({
      message: "Create job successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const jobs = await prisma.jobs.findMany({
      where: {
        company_id: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        responsibility: true,
        skill: true,
        education: true,
        benefit: true,
        deadline: true,
        vacancy: true,
        is_featured: true,
        is_urgent: true,
        created_at: true,
        // Ánh xạ để lấy tên thay vì chỉ lấy ID
        job_categories: {
          select: {
            name: true, // Giả sử bảng category có trường 'name'
          },
        },
        job_locations: {
          select: {
            name: true, // Giả sử bảng location có trường 'name'
          },
        },
        job_types: {
          select: {
            name: true,
          },
        },
        job_experiences: {
          select: {
            name: true,
          },
        },
        job_genders: {
          select: {
            name: true,
          },
        },
        job_salary_ranges: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({ jobs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // 1. Kiểm tra quyền sở hữu
    const existingJob = await prisma.jobs.findFirst({
      where: {
        id: parseInt(id),
        company_id: userId,
      },
    });

    if (!existingJob) {
      return res.status(404).json({
        message: "Không tìm thấy công việc hoặc bạn không có quyền sửa",
      });
    }

    // 2. Ép kiểu dữ liệu (Data Sanitization)
    // Đảm bảo các ID là số nguyên, nếu không có thì giữ nguyên giá trị cũ (undefined)
    const dataToUpdate = {
      title: updateData.title,
      description: updateData.description,
      responsibility: updateData.responsibility,
      skill: updateData.skill,
      education: updateData.education,
      benefit: updateData.benefit,
      deadline: updateData.deadline,
      vacancy: updateData.vacancy ? parseInt(updateData.vacancy) : undefined,

      // Quan trọng: Ép kiểu Int cho các Foreign Key
      job_category_id: updateData.jobCategory
        ? parseInt(updateData.jobCategory)
        : undefined,
      job_location_id: updateData.jobLocation
        ? parseInt(updateData.jobLocation)
        : undefined,
      job_type_id: updateData.jobType
        ? parseInt(updateData.jobType)
        : undefined,
      job_experience_id: updateData.jobExperience
        ? parseInt(updateData.jobExperience)
        : undefined,
      job_gender_id: updateData.jobGender
        ? parseInt(updateData.jobGender)
        : undefined,
      job_salary_range_id: updateData.jobSalaryRange
        ? parseInt(updateData.jobSalaryRange)
        : undefined,

      is_featured: updateData.isFeatured,
      is_urgent: updateData.isUrgent,
    };

    // 3. Tiến hành cập nhật
    const updatedJob = await prisma.jobs.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    return res.status(200).json({
      message: "Cập nhật công việc thành công",
      data: updatedJob,
    });
  } catch (error) {
    // Log lỗi chi tiết ở server để debug
    console.error("Update Job Error:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi cập nhật" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Kiểm tra quyền sở hữu trước khi xóa
    const existingJob = await prisma.jobs.findFirst({
      where: {
        id: parseInt(id),
        company_id: userId,
      },
    });

    if (!existingJob) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy công việc để xóa" });
    }

    await prisma.jobs.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({ message: "Delete job successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getJobDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const job = await prisma.jobs.findFirst({
      where: {
        id: parseInt(id),
        company_id: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        responsibility: true,
        skill: true,
        education: true,
        benefit: true,
        deadline: true,
        vacancy: true,
        is_featured: true,
        is_urgent: true,
        job_category_id: true,
        job_location_id: true,
        job_type_id: true,
        job_experience_id: true,
        job_gender_id: true,
        job_salary_range_id: true,
        job_categories: {
          select: {
            id: true,
            name: true,
          },
        },
        job_locations: {
          select: {
            id: true,
            name: true,
          },
        },
        job_types: {
          select: {
            id: true,
            name: true,
          },
        },
        job_experiences: {
          select: {
            id: true,
            name: true,
          },
        },
        job_genders: {
          select: {
            id: true,
            name: true,
          },
        },
        job_salary_ranges: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({ job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCompanyMetadata = async (req, res) => {
  try {
    const [locations, sizes, industries] = await Promise.all([
      prisma.company_locations.findMany(),
      prisma.company_sizes.findMany(),
      prisma.company_industries.findMany(),
    ]);

    res.status(200).json({
      locations,
      sizes,
      industries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobMetadata = async (req, res) => {
  try {
    const [categories, locations, types, experiences, genders, salaryRanges] =
      await Promise.all([
        prisma.job_categories.findMany(),
        prisma.job_locations.findMany(),
        prisma.job_types.findMany(),
        prisma.job_experiences.findMany(),
        prisma.job_genders.findMany(),
        prisma.job_salary_ranges.findMany(),
      ]);

    res.status(200).json({
      categories,
      locations,
      types,
      experiences,
      genders,
      salaryRanges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCandidateResume = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const resumes = await prisma.candidate_resumes.findMany({
      where: { candidate_id: BigInt(candidateId) },
      select: {
        id: true,
        name: true,
        file: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json(resumes);
  } catch (error) {
    console.error("[GET_CANDIDATE_RESUME_ERROR]:", error);
    return res.status(500).json({ message: "Error fetching resume" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const companyId = req.user.id;

    // Validate status
    const validStatuses = ["Applied", "Approved", "Rejected", "Shortlisted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get application and verify it belongs to company's job
    const application = await prisma.candidate_applications.findFirst({
      where: { id: BigInt(applicationId) },
      include: {
        jobs: {
          select: { company_id: true },
        },
      },
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify company ownership
    if (application.jobs.company_id !== companyId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this application" });
    }

    // Update application status
    const updated = await prisma.candidate_applications.update({
      where: { id: BigInt(applicationId) },
      data: { status },
    });

    return res.status(200).json({
      message: `Application ${status.toLowerCase()} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("[UPDATE_APPLICATION_STATUS_ERROR]:", error);
    return res
      .status(500)
      .json({ message: "Error updating application status" });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, packageId } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/company/payment/success/{CHECKOUT_SESSION_ID}?packageId=${packageId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/company/payment/fail`,
      metadata: {
        companyId: req.user.id,
        packageId: priceId,
      },
    });
    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const companyId = req.user.id;
    const { packageId, sessionId } = req.body;

    if (!packageId || !sessionId) {
      return res
        .status(400)
        .json({ message: "packageId and sessionId are required" });
    }

    // Verify session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Get package details
    const package_ = await prisma.packages.findUnique({
      where: { id: BigInt(packageId) },
    });

    if (!package_) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Calculate dates
    const startDate = new Date();
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + package_.package_days);

    // Generate order number
    const orderNo = `ORD-${Date.now()}-${companyId}`;

    // Create order
    const order = await prisma.orders.create({
      data: {
        company_id: BigInt(companyId),
        package_id: BigInt(packageId),
        order_no: orderNo,
        paid_amount: session.amount_total
          ? (session.amount_total / 100).toString()
          : package_.package_price.toString(),
        payment_method: "Stripe",
        start_date: startDate.toISOString().split("T")[0],
        expire_date: expireDate.toISOString().split("T")[0],
        currently_active: 1,
      },
      include: {
        packages: true,
      },
    });

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("[CREATE_ORDER_ERROR]:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const companyId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    // Find company in DB
    const company = await prisma.companies.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await prisma.companies.update({
      where: { id: companyId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
