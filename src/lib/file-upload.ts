import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  uploadDir: string,
  fileName?: string,
): Promise<UploadResult> {
  try {
    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename if not provided
    const finalFileName = fileName ?? `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, finalFileName);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filePath, buffer);

    return {
      success: true,
      filePath,
      fileName: finalFileName,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function getUploadPath(type: "cover-letter" | "resume"): string {
  const baseDir = process.cwd();
  return join(
    baseDir,
    "uploads",
    "applications",
    type === "cover-letter" ? "cover-letters" : "resumes",
  );
}

export function getInternProfileResumePath(): string {
  const baseDir = process.cwd();
  return join(baseDir, "uploads", "intern-profile", "resume");
}

export function getAvatarUploadPath(): string {
  const baseDir = process.cwd();
  return join(baseDir, "uploads", "avatars");
}

export function getFileUrl(filePath: string): string {
  // Convert absolute path to relative URL
  const relativePath = filePath.replace(process.cwd(), "").replace(/\\/g, "/");
  return relativePath;
}
