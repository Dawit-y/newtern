import { type NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join, normalize } from "path";

function getContentType(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".doc")) return "application/msword";
  if (lower.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const baseDir = join(process.cwd(), "uploads");
    const unsafePath = params.path.join("/");
    const normalized = normalize(unsafePath).replace(/^\.\/+/, "");
    const absolutePath = join(baseDir, normalized);

    // Ensure the resolved path is within the uploads directory
    if (!absolutePath.startsWith(baseDir)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const fileStat = await stat(absolutePath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const file = await readFile(absolutePath);
    const contentType = getContentType(absolutePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
