//AdminCandidateController, AdminProfileController

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidates.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidates.findUnique({
      where: {
        id,
      },
    });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    console.error("Error fetching candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await prisma.candidates.findUnique({
      where: {
        id,
      },
    });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    await prisma.candidates.delete({
      where: {
        id,
      },
    });
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.companies.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.companies.findUnique({
      where: {
        id,
      },
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.companies.findUnique({
      where: {
        id,
      },
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    await prisma.companies.delete({
      where: {
        id,
      },
    });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
