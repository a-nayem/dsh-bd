import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

// Vercel rejects request bodies over about 4.5MB. The client shrinks the image to well under this.
const MAX_BASE64_CHARS = 4_000_000;
const TARGET_PATH = "public/hero/hero.jpg";

function sameSecret(given: string, expected: string): boolean {
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const token = process.env.GITHUB_TOKEN;
  const adminKey = process.env.DASHBOARD_ADMIN_KEY;
  if (!token || !adminKey) {
    return NextResponse.json(
      { error: "Not configured. Set GITHUB_TOKEN and DASHBOARD_ADMIN_KEY in the environment." },
      { status: 503 }
    );
  }

  // Without this check anyone who finds the URL could push commits to the repo
  if (!sameSecret(req.headers.get("x-admin-key") ?? "", adminKey)) {
    return NextResponse.json({ error: "Wrong admin key" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { image?: unknown } | null;
  const image = typeof body?.image === "string" ? body.image : "";
  if (!image || image.length > MAX_BASE64_CHARS) {
    return NextResponse.json({ error: "Missing image or image too large" }, { status: 400 });
  }

  // Only JPEG goes through. The client converts everything to JPEG, so anything else is not from the dashboard.
  const bytes = Buffer.from(image, "base64");
  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isJpeg) {
    return NextResponse.json({ error: "Not a JPEG image" }, { status: 400 });
  }

  const repo = process.env.GITHUB_REPO || "a-nayem/dsh-bd";
  const branch = process.env.GITHUB_BRANCH || "main";
  const url = `https://api.github.com/repos/${repo}/contents/${TARGET_PATH}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "empire-dashboard",
  };

  // Updating an existing file needs its current sha
  let sha: string | undefined;
  const existing = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (existing.ok) sha = ((await existing.json()) as { sha?: string }).sha;

  const put = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Update dashboard hero image", content: image, branch, sha }),
  });

  if (!put.ok) {
    const detail = ((await put.json().catch(() => ({}))) as { message?: string }).message;
    return NextResponse.json({ error: `GitHub rejected the push: ${detail ?? put.status}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
