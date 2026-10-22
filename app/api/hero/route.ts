import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Static at build time, like /api/backgrounds. Every deploy rebuilds it, so the
// version below changes after a push and the browser fetches the new image.
const HERO_FILE = path.join(process.cwd(), "public", "hero", "hero.jpg");

export async function GET() {
  try {
    const stat = fs.statSync(HERO_FILE);
    return NextResponse.json({ src: "/hero/hero.jpg", v: Math.round(stat.mtimeMs) });
  } catch {
    return NextResponse.json({ src: null, v: 0 });
  }
}
