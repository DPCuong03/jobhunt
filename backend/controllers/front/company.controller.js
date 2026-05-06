//CompanyListingController
import prisma from "../../lib/db.js";

const companyRelations = {
  include: {
    company_industries: true,
    company_locations: true,
    company_photos: true,
    company_sizes: true,
    _count: {
      select: { jobs: true }, // Để hiển thị "Số lượng vị trí đang tuyển"
    },
    jobs: true,
  },
};
export const getCompanyIndustries = async (req, res) => {
  try {
    const industries = await prisma.company_industries.findMany({
      orderBy: { name: "asc" },
    });
    res.json(industries);
  } catch (error) {
    console.error("Get company industries error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyLocations = async (req, res) => {
  try {
    const locations = await prisma.company_locations.findMany({
      orderBy: { name: "asc" },
    });
    res.json(locations);
  } catch (error) {
    console.error("Get company locations error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanySizes = async (req, res) => {
  try {
    const sizes = await prisma.company_sizes.findMany({
      orderBy: { name: "asc" },
    });
    res.json(sizes);
  } catch (error) {
    console.error("Get company sizes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompanyFoundedOn = async (req, res) => {
  try {
    const foundedOn = await prisma.companies.findMany({
      select: {
        founded_on: true,
      },
      distinct: ["founded_on"],
      orderBy: { founded_on: "desc" },
    });
    res.json(foundedOn);
  } catch (error) {
    console.error("Get company founded on error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const {
      name,
      industry, // Nên nhận ID từ frontend để chính xác hơn
      location,
      size,
      foundedOn,
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Xây dựng điều kiện lọc
    const where = {
      // 1. Lọc theo tên công ty (đúng cột company_name)
      ...(name && {
        company_name: { contains: name, mode: "insensitive" },
      }),

      // 2. Lọc theo ID của các bảng quan hệ (theo schema SQL của bạn)
      ...(industry && {
        company_industry_id: parseInt(industry),
      }),
      ...(location && {
        company_location_id: parseInt(location),
      }),
      ...(size && {
        company_size_id: parseInt(size),
      }),
      ...(foundedOn && { founded_on: foundedOn.toString() }),

      // Chỉ lấy các công ty đã kích hoạt (nếu có cột status)
      // status: 1
    };

    const [companies, total] = await Promise.all([
      prisma.companies.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: parseInt(limit),
        ...companyRelations,
      }),
      prisma.companies.count({ where }),
    ]);

    res.json({
      data: companies, // Frontend của bạn đang dùng .data nên để key này
      pagination: {
        page: parseInt(page),
        total,
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error at getAllCompanies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompaniesById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.companies.findUnique({
      where: { id: BigInt(id) },
      ...companyRelations,
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json({ company });
  } catch (error) {
    console.error("Error at getCompaniesById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
