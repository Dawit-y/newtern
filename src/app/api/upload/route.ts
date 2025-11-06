import { type NextRequest, NextResponse } from "next/server";
import {
  uploadFile,
  getUploadPath,
  getInternProfileResumePath,
  getAvatarUploadPath,
  getFileUrl,
} from "@/lib/file-upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as
      | "cover-letter"
      | "resume"
      | "profile-resume"
      | "avatar";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (
      !type ||
      !["cover-letter", "resume", "profile-resume", "avatar"].includes(type)
    ) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // Validate file type
    const isAvatar = type === "avatar";
    const allowedTypes = isAvatar
      ? ["image/png", "image/jpeg", "image/webp", "image/gif"]
      : ["application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: isAvatar
            ? "Invalid file type. Only PNG, JPG, WEBP, or GIF images are allowed."
            : "Invalid file type. Only PDF files are allowed.",
        },
        { status: 400 },
      );
    }

    // Upload the file
    const uploadDir =
      type === "profile-resume"
        ? getInternProfileResumePath()
        : type === "avatar"
          ? getAvatarUploadPath()
          : getUploadPath(type);
    const result = await uploadFile(file, uploadDir);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Upload failed" },
        { status: 500 },
      );
    }

    // Return relative URL for profile resume, absolute path for others
    const filePath =
      (type === "profile-resume" || type === "avatar") && result.filePath
        ? getFileUrl(result.filePath)
        : result.filePath;

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
