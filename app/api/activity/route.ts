import { NextResponse } from "next/server";

const GH_USER = "a-nayem";

export async function GET() {
  try {
    const res = await fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub events fetch failed" }, { status: 502 });
    }

    const events = await res.json();

    // Aggregate real events by day, last 14 days
    const counts: Record<string, number> = {};
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      counts[d.toISOString().slice(0, 10)] = 0;
    }

    if (Array.isArray(events)) {
      for (const e of events) {
        const day = e.created_at?.slice(0, 10);
        if (day && day in counts) counts[day] += 1;
      }
    }

    const series = Object.entries(counts).map(([date, count]) => ({ date: date.slice(5), count }));

    return NextResponse.json({ series, fetchedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
