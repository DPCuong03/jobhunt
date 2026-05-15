import { redis } from "../lib/redis.js";
import prisma from "../lib/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateTokens = (userId, userRole) => {
  const accessToken = jwt.sign(
    { id: userId, role: userRole },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: userId, role: userRole },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60,
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none", // Required for cross-domain cookies
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name, username, userRole } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user;

    if (userRole === "company") {
      const userExists = await prisma.companies.findFirst({
        where: { email },
      });
      if (userExists)
        return res.status(400).json({ message: "Company already exists" });

      user = await prisma.companies.create({
        data: {
          company_name: name,
          person_name: name,
          email,
          password: hashedPassword,
          username,
          status: 1,
        },
      });
    } else {
      const userExists = await prisma.candidates.findFirst({
        where: { email },
      });
      if (userExists)
        return res.status(400).json({ message: "Candidate already exists" });

      user = await prisma.candidates.create({
        data: { name, email, password: hashedPassword, username, status: 1 },
      });
    }

    const { accessToken, refreshToken } = generateTokens(
      user.id.toString(),
      userRole,
    );
    await storeRefreshToken(user.id.toString(), refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      id: user.id,

      name: user.company_name || user.name,
      email: user.email,
      role: userRole,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;
    let userRole = "";

    user = await prisma.candidates.findFirst({ where: { email } });
    if (user) {
      userRole = "candidate";
    } else {
      user = await prisma.companies.findFirst({ where: { email } });
      if (user) {
        userRole = "company";
      } else {
        user = await prisma.admins.findFirst({ where: { email } });
        if (user) userRole = "admin";
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken } = generateTokens(
        user.id.toString(),
        userRole,
      );
      console.log(
        `Login successful for ${email} (${userRole}), storing refresh token in Redis`,
      );
      await storeRefreshToken(user.id.toString(), refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        id: user.id,
        name: user.name || user.company_name || user.person_name,
        email: user.email,
        role: userRole,
      });
    } else {
      console.log(`Login failed for ${email} - invalid credentials`);
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token endpoint called");
    console.log("Available cookies:", Object.keys(req.cookies));

    if (!refreshToken) {
      console.log("No refresh token in cookies");
      return res.status(401).json({ message: "No refresh token" });
    }

    console.log("Refresh token found, verifying...");

    // Wrap jwt.verify separately so expired token → 401, not 500
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log("Refresh token verified, userId:", decoded.id);
    } catch (err) {
      console.log("Refresh token verification failed:", err.message);
      return res
        .status(401)
        .json({ message: "Refresh token expired or invalid" });
    }

    console.log("Checking Redis for stored token...");
    const storedToken = await redis.get(`refresh_token:${decoded.id}`);

    if (!storedToken) {
      console.log(`No token stored in Redis for user ${decoded.id}`);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (storedToken !== refreshToken) {
      console.log(`Token mismatch in Redis for user ${decoded.id}`);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    console.log("Token matched in Redis, generating new access token");

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    console.log("New access token set, refresh successful");
    res.json({ message: "Token refreshed successfully", accessToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${decoded.id}`);
    }
    const clearOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };
    res.clearCookie("accessToken", clearOptions);
    res.clearCookie("refreshToken", clearOptions);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};
