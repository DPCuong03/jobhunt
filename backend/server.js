import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/db.js";
import cookieParser from "cookie-parser";

import jobRoutes from "./routes/job.route.js";
import authRoutes from "./routes/auth.route.js";

import frontRoutes from "./routes/front.route.js";
import companyRoutes from "./routes/company.route.js";
import candidateRoutes from "./routes/candidate.route.js";
import adminRoutes from "./routes/admin.route.js";

import { handleStripeWebhook } from "./controllers/webhook.controller.js";

const app = express();
dotenv.config();

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(
  cors({
    // 1. Phải chỉ định chính xác Origin của Frontend, không dùng '*'
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],

    // 2. Bắt buộc để trình duyệt cho phép gửi/nhận Cookie
    credentials: true,

    // 3. Các phương thức bạn sử dụng
    methods: ["GET", "POST", "PUT", "DELETE"],

    // 4. Các header cho phép
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

BigInt.prototype.toJSON = function () {
  if (typeof this === "bigint") {
    return this.toString();
  }
  return String(this);
};

app.use("/api/company", companyRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);

app.use("/api", frontRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on ${process.env.FRONTEND_URL} (port ${PORT})`);
});
