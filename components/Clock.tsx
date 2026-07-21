"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className="clock-time">--:--:--</div>;

  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const date = `${days[now.getDay()]} · ${months[now.getMonth()]} ${now.getDate()} · ${now.getFullYear()}`;

  return (
    <div>
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
    </div>
  );
}
