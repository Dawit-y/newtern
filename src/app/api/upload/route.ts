import { type NextRequest, NextResponse } from "next/server";
import { uploadFile, getUploadPath } from "@/lib/file-upload";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "cover-letter" | "resume";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["cover-letter", "resume"].includes(type)) {
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
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.",
        },
        { status: 400 },
      );
    }

    // Upload the file
    const uploadDir = getUploadPath(type);
    const result = await uploadFile(file, uploadDir);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Upload failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      filePath: result.filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
