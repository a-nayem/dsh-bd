"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LanguageChart() {
  const [data, setData] = useState<{ name: string; count: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setData(d.languages)))
      .catch(() => setError("Failed to load languages"));
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">Language Mix — live, by repo count</div>
      {error && <div className="err">{error}</div>}
      {!data && !error && <div className="loading">fetching...</div>}
      {data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(221,228,237,0.35)" fontSize={10} />
            <YAxis allowDecimals={false} stroke="rgba(221,228,237,0.35)" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "#12161c", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}
              labelStyle={{ color: "#dde4ed" }}
            />
            <Bar dataKey="count" fill="#c8a35a" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
