"use client";

import { useEffect, useState } from "react";

type GithubData = {
  login: string;
  followers: number;
  publicRepos: number;
  totalStars: number;
  profileUrl: string;
  recentRepos: { name: string; url: string; stars: number; language: string | null }[];
  error?: string;
};

export default function GithubPanel() {
  const [data, setData] = useState<GithubData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((d) => (d.error ? setError(d.error) : setData(d)))
      .catch(() => setError("Failed to load GitHub data"));
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">GitHub Activity — live</div>
      {error && <div className="err">{error}</div>}
      {!data && !error && <div className="loading">fetching...</div>}
      {data && (
        <>
          <div className="stat-row" style={{ marginBottom: 12 }}>
            <div className="stat-chip">
              <span className="stat-chip-value">{data.publicRepos}</span>
              <span className="stat-chip-label">Repos</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-value">{data.followers}</span>
              <span className="stat-chip-label">Followers</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip-value">{data.totalStars}</span>
              <span className="stat-chip-label">Stars</span>
            </div>
          </div>
          {data.recentRepos.map((r) => (
            <div className="repo-item" key={r.name}>
              <a className="repo-name" href={r.url} target="_blank" rel="noreferrer">{r.name}</a>
              <span className="repo-meta">{r.language || "—"} · ★{r.stars}</span>
            </div>
          ))}
          <a href={data.profileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, display: "block" }}>
            ↗ view full profile
          </a>
        </>
      )}
    </div>
  );
}
