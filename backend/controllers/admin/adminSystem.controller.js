import prisma from "../../lib/db.js";

// Admin Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [total_companies, total_candidates, total_jobs] = await Promise.all([
      prisma.companies.count(),
      prisma.candidates.count(),
      prisma.jobs.count(),
    ]);

    res.status(200).json({
      total_companies,
      total_candidates,
      total_jobs,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
};
