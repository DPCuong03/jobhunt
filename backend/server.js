const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const serialize = (data) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
};

// Updated Route: Get all candidates
app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await prisma.candidates.findMany();

    // Wrap the result in the serialize helper before sending
    res.json(serialize(candidates));
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Could not fetch candidates" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany();

    res.json(serialize(jobs));
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Could not fetch jobs" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
