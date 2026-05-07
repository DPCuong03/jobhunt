import prisma from "../../lib/db.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.job_categories.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching job categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.job_categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check if category already exists
    const existingCategory = await prisma.job_categories.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      return res.status(409).json({ error: "Category already exists" });
    }

    // Create category
    const category = await prisma.job_categories.create({
      data: {
        name: name.trim(),
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required" });
    }

    // Check if category exists
    const existingCategory = await prisma.job_categories.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if new name already exists (excluding current category)
    const duplicateCategory = await prisma.job_categories.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        NOT: {
          id,
        },
      },
    });

    if (duplicateCategory) {
      return res.status(409).json({ error: "Category name already exists" });
    }

    const updatedCategory = await prisma.job_categories.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.job_categories.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category is being used by any jobs

    const jobsUsingCategory = await prisma.jobs.count({
      where: {
        categoryId: id,
      },
    });

    if (jobsUsingCategory > 0) {
      return res.status(400).json({
        error: `Cannot delete category. It is being used by ${jobsUsingCategory} job(s)`,
      });
    }

    await prisma.job_categories.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
