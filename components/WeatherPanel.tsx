"use client";

import { useEffect, useState } from "react";

type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  error?: string;
};

// Minimal WMO weather code -> label map
const codeLabel = (code: number) => {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rain";
  if ([71, 73, 75].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "—";
};

export default function WeatherPanel() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function fetchWeather(lat?: number, lon?: number) {
      const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : "/api/weather";
      fetch(url)
        .then((res) => res.json())
        .then((d) => (d.error ? setError(d.error) : setData(d)))
        .catch(() => setError("Failed to load weather"));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather() // fall back to default location silently
      );
    } else {
      fetchWeather();
    }
  }, []);

  return (
    <div className="panel">
      <div className="panel-label">Weather — live</div>
      {error && <div className="err">{error}</div>}
      {!data && !error && <div className="loading">fetching...</div>}
      {data && (
        <div className="stat-row">
          <div className="stat-chip">
            <span className="stat-chip-value">{Math.round(data.temperature)}°</span>
            <span className="stat-chip-label">Temp C</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">{data.humidity}%</span>
            <span className="stat-chip-label">Humidity</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">{Math.round(data.windSpeed)}</span>
            <span className="stat-chip-label">Wind km/h</span>
          </div>
        </div>
      )}
      {data && <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-dim)" }}>{codeLabel(data.weatherCode)}</div>}
    </div>
  );
}
