import { NextResponse } from "next/server";

const GH_USER = "a-nayem";

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GH_USER}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 }, // cache 5 min, no hardcoding
      }),
      fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 300 },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json(
        { error: "GitHub API request failed", status: userRes.status },
        { status: 502 }
      );
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
      : 0;

    const languageCounts: Record<string, number> = {};
    if (Array.isArray(repos)) {
      for (const r of repos) {
        if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
    }
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const pinnedCandidates = Array.isArray(repos)
      ? repos
          .filter((r: any) => !r.fork)
          .sort((a: any, b: any) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
          .slice(0, 6)
          .map((r: any) => ({
            name: r.name,
            url: r.html_url,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            updatedAt: r.pushed_at,
          }))
      : [];

    return NextResponse.json({
      login: user.login,
      name: user.name,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      recentRepos: pinnedCandidates,
      languages,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
