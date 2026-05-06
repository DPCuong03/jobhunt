//AdminHomePageController, AdminFaqPageController, AdminBlogPageController, AdminTermPageController, AdminPrivacyPageController, AdminContactPageController, AdminPricingPageController, AdminOtherPageController
import prisma from "../../lib/db.js";

// Helper: serialize bigint id to string for JSON safety
const serializeFaq = (faq) => ({
  id: faq.id.toString(),
  question: faq.question,
  answer: faq.answer,
  createdAt: faq.created_at?.toISOString() ?? null,
  updatedAt: faq.updated_at?.toISOString() ?? null,
});

// ─── GET /api/admin/faqs ──────────────────────────────────────────────────────
// Returns all FAQs ordered by created_at asc
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faqs.findMany({
      orderBy: { created_at: "asc" },
    });

    return res.status(200).json({
      faqs: faqs.map(serializeFaq),
      total: faqs.length,
    });
  } catch (error) {
    console.error("getAllFaqs error:", error);
    return res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

// ─── GET /api/admin/faqs/:id ──────────────────────────────────────────────────
export const getFaqById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    const faq = await prisma.faqs.findUnique({ where: { id } });

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    return res.status(200).json(serializeFaq(faq));
  } catch (error) {
    console.error("getFaqById error:", error);
    if (error.message?.includes("Cannot convert")) {
      return res.status(400).json({ message: "Invalid FAQ ID" });
    }
    return res.status(500).json({ message: "Failed to fetch FAQ" });
  }
};

// ─── POST /api/admin/faqs ─────────────────────────────────────────────────────
export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }
    if (!answer?.trim()) {
      return res.status(400).json({ message: "Answer is required" });
    }

    const faq = await prisma.faqs.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return res.status(201).json(serializeFaq(faq));
  } catch (error) {
    console.error("createFaq error:", error);
    return res.status(500).json({ message: "Failed to create FAQ" });
  }
};

// ─── PUT /api/admin/faqs/:id ──────────────────────────────────────────────────
export const updateFaq = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const { question, answer } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }
    if (!answer?.trim()) {
      return res.status(400).json({ message: "Answer is required" });
    }

    // Check exists first
    const existing = await prisma.faqs.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    const faq = await prisma.faqs.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        updated_at: new Date(),
      },
    });

    return res.status(200).json(serializeFaq(faq));
  } catch (error) {
    console.error("updateFaq error:", error);
    if (error.message?.includes("Cannot convert")) {
      return res.status(400).json({ message: "Invalid FAQ ID" });
    }
    return res.status(500).json({ message: "Failed to update FAQ" });
  }
};

// ─── DELETE /api/admin/faqs/:id ───────────────────────────────────────────────
export const deleteFaq = async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    // Check exists first
    const existing = await prisma.faqs.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    await prisma.faqs.delete({ where: { id } });

    return res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("deleteFaq error:", error);
    if (error.message?.includes("Cannot convert")) {
      return res.status(400).json({ message: "Invalid FAQ ID" });
    }
    return res.status(500).json({ message: "Failed to delete FAQ" });
  }
};
