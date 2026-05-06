import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

// 1. Hàm core dùng chung để verify token và tìm user trong DB
// Giúp tránh lặp lại code verify cho từng loại route
const verifyAndAttachUser = async (req, res, requiredRole) => {
  try {
    const accessToken = req.cookies.accessToken;

    console.log("🔍 Auth Middleware - checking accessToken...");
    console.log("Available cookies:", Object.keys(req.cookies));

    if (!accessToken) {
      console.log("No access token found in cookies");
      return {
        status: 401,
        message: "Unauthorized - No access token provided",
      };
    }

    console.log("Access token found, verifying...");
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("Token verified successfully, user id:", decoded.id);

    // Kiểm tra xem role trong token có khớp với quyền truy cập yêu cầu không
    if (requiredRole && decoded.role !== requiredRole) {
      console.log(
        `❌ Role mismatch: expected ${requiredRole}, got ${decoded.role}`,
      );
      return { status: 403, message: `Access denied - ${requiredRole} only` };
    }

    let user = null;
    const userId = parseInt(decoded.id);

    // Truy vấn vào bảng tương ứng dựa trên role
    if (decoded.role === "admin") {
      user = await prisma.admins.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });
    } else if (decoded.role === "company") {
      user = await prisma.companies.findUnique({
        where: { id: userId },
        select: {
          id: true,
          company_name: true,
          person_name: true,
          username: true,
          email: true,
          status: true,
        },
      });
    } else if (decoded.role === "candidate") {
      user = await prisma.candidates.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          status: true,
        },
      });
    }

    if (!user) {
      console.log(`User not found in database for id: ${userId}`);
      return { status: 401, message: "User not found" };
    }

    console.log(`User authenticated: ${user.name || user.company_name}`);
    // Đính kèm vào request
    req.user = { ...user, role: decoded.role };
    return { status: 200 };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token expired");
      return { status: 401, message: "Unauthorized - Access token expired" };
    }
    console.log("Token verification failed:", error.message);
    return { status: 401, message: "Unauthorized - Invalid access token" };
  }
};

// 2. Các Middleware cụ thể để dùng trong Routes

// Dùng cho các route mà ai đã login cũng vào được (profile chung, v.v.)
export const protectRoute = async (req, res, next) => {
  const result = await verifyAndAttachUser(req, res, null);
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }
  next();
};

// Chỉ cho phép Admin
export const adminRoute = async (req, res, next) => {
  const result = await verifyAndAttachUser(req, res, "admin");
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }
  next();
};

// Chỉ cho phép Công ty
export const companyRoute = async (req, res, next) => {
  const result = await verifyAndAttachUser(req, res, "company");
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }
  next();
};

// Chỉ cho phép Ứng viên
export const candidateRoute = async (req, res, next) => {
  const result = await verifyAndAttachUser(req, res, "candidate");
  if (result.status !== 200) {
    return res.status(result.status).json({ message: result.message });
  }
  next();
};
