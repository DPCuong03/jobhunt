// app/api/upload-local/route.ts
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type"); // Lấy type từ frontend gửi lên

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileExtension = path.extname(file.name);

    // Logic đặt tên file linh hoạt
    const prefix = type === "photo" ? "candidate_photo_" : "resume_";
    const fileName = `${prefix}${Date.now()}${fileExtension}`;

    await writeFile(path.join(uploadDir, fileName), buffer);

    return NextResponse.json({ fileName });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
