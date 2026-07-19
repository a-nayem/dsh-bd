"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ActivityChart() {
  const [series, setSeries] = useState<{ date: string; count: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/activity")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setSeries(d.series)))
      .catch(() => setError("Failed to load activity"));
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">Push/Event Activity — 14d, live</div>
      {error && <div className="err">{error}</div>}
      {!series && !error && <div className="loading">fetching...</div>}
      {series && (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={series} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(221,228,237,0.35)" fontSize={10} />
            <YAxis allowDecimals={false} stroke="rgba(221,228,237,0.35)" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "#12161c", border: "1px solid rgba(255,255,255,0.1)", fontSize: 12 }}
              labelStyle={{ color: "#dde4ed" }}
            />
            <Line type="monotone" dataKey="count" stroke="#c8d8e8" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
