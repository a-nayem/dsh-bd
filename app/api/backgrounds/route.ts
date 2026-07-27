import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];
const BG_DIR = path.join(process.cwd(), "public", "backgrounds");

export async function GET() {
  try {
    if (!fs.existsSync(BG_DIR)) {
      return NextResponse.json({ videos: [] });
    }
    const files = fs.readdirSync(BG_DIR).filter((f) =>
      VIDEO_EXTENSIONS.includes(path.extname(f).toLowerCase())
    );
    const videos = files.map((f) => ({
      name: f,
      path: `/backgrounds/${f}`,
    }));
    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [], error: "Could not read backgrounds folder" }, { status: 500 });
  }
}
