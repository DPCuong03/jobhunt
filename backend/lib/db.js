import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Thử lấy danh sách job đầu tiên để test kết nối
    const jobCount = await prisma.jobs.count();
    console.log("Connect to Aiven successfully! Job count:", jobCount);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

testConnection();

export default prisma;
