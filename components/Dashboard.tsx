"use client";

import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ClockPanel from "@/components/ClockPanel";
import GithubPanel from "@/components/GithubPanel";
import WeatherPanel from "@/components/WeatherPanel";
import HeroPanel from "@/components/HeroPanel";
import ContributionGraph from "@/components/ContributionGraph";
import ActivityChart from "@/components/ActivityChart";
import LanguageChart from "@/components/LanguageChart";
import TasksPanel from "@/components/TasksPanel";
import JapaneseLessonPanel from "@/components/JapaneseLessonPanel";
import QuickLinksPanel from "@/components/QuickLinksPanel";
import DraggablePanel from "@/components/DraggablePanel";
import BackgroundLayer, { type BgSettings } from "@/components/BackgroundLayer";
import BackgroundSettings from "@/components/BackgroundSettings";

const LAYOUT_KEY = "empire-dashboard-layout";
const BG_KEY = "empire-dashboard-bg-settings";

const PANEL_META: Record<string, { label: string; wide?: boolean }> = {
  hero: { label: "Night Drive" },
  clock: { label: "System Clock" },
  weather: { label: "Weather" },
  tasks: { label: "Checkpoints" },
  japanese: { label: "Japanese Lesson" },
  github: { label: "GitHub Activity" },
  contributions: { label: "Contribution Graph" },
  activity: { label: "Push Activity" },
  languages: { label: "Language Mix" },
  quicklinks: { label: "Quick Access", wide: true },
};

const DEFAULT_ORDER = [
  "hero", "clock", "weather",
  "tasks", "japanese", "github",
  "contributions", "activity", "languages",
  "quicklinks",
];

const DEFAULT_BG: BgSettings = { mode: "none", url: null, videoPath: null, overlay: 0.35, blur: 0 };

function renderPanel(id: string): React.ReactNode {
  switch (id) {
    case "hero": return <HeroPanel />;
    case "clock": return <ClockPanel />;
    case "weather": return <WeatherPanel />;
    case "tasks": return <TasksPanel />;
    case "japanese": return <JapaneseLessonPanel />;
    case "github": return <GithubPanel />;
    case "contributions": return <ContributionGraph />;
    case "activity": return <ActivityChart />;
    case "languages": return <LanguageChart />;
    case "quicklinks": return <QuickLinksPanel />;
    default: return null;
  }
}

export default function Dashboard() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [editMode, setEditMode] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [bg, setBg] = useState<BgSettings>(DEFAULT_BG);
  const [bgOpen, setBgOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const rawOrder = localStorage.getItem(LAYOUT_KEY);
    if (rawOrder) {
      try {
        const parsed: string[] = JSON.parse(rawOrder);
        // guard against stale ids if the panel set ever changes
        const valid = parsed.filter((id) => id in PANEL_META);
        const missing = DEFAULT_ORDER.filter((id) => !valid.includes(id));
        setOrder([...valid, ...missing]);
      } catch {
        setOrder(DEFAULT_ORDER);
      }
    }
    const rawBg = localStorage.getItem(BG_KEY);
    if (rawBg) {
      try {
        const parsed = JSON.parse(rawBg);
        setBg({ ...DEFAULT_BG, ...parsed });
      } catch {
        setBg(DEFAULT_BG);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(order));
  }, [order, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(BG_KEY, JSON.stringify(bg));
    } catch {
      // quota exceeded on a data-url background — handled in the settings drawer itself
    }
  }, [bg, hydrated]);

  function handleDrop() {
    if (!dragId) return;
    setOrder((prev) => prev); // no-op placeholder kept for clarity; real reorder happens in dragOver
    setDragId(null);
  }

  function handleDragOver(overId: string) {
    if (!dragId || dragId === overId) return;
    setOrder((prev) => {
      const from = prev.indexOf(dragId);
      const to = prev.indexOf(overId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
  }

  return (
    <>
      <BackgroundLayer settings={bg} />

      <main className="wrapper">
        <header className="top">
          <div className="brand">Ayanokouji&apos;s <span>// Empire</span></div>
          <div className="header-actions">
            <button className="pill-btn" onClick={() => setBgOpen((v) => !v)}>Background</button>
            <button className={`pill-btn${editMode ? " active" : ""}`} onClick={() => setEditMode((v) => !v)}>
              {editMode ? "✓ Done" : "⠿ Edit Layout"}
            </button>
            <div className="status">
              <div className="dot" />
              SYSTEMS ONLINE
            </div>
          </div>
        </header>

        {bgOpen && (
          <BackgroundSettings
            open={bgOpen}
            onClose={() => setBgOpen(false)}
            settings={bg}
            onChange={setBg}
            onReset={() => setBg(DEFAULT_BG)}
          />
        )}

        <SearchBar />

        {editMode && (
          <div className="edit-banner">
            Drag any panel by its handle to reorder. Layout saves automatically.
            <button className="settings-close" onClick={() => setOrder(DEFAULT_ORDER)} title="Reset layout">
              Reset order
            </button>
          </div>
        )}

        <div className="panel-flow">
          {order.map((id) => (
            <DraggablePanel
              key={id}
              id={id}
              label={PANEL_META[id]?.label || id}
              editMode={editMode}
              isDragging={dragId === id}
              isWide={PANEL_META[id]?.wide}
              onDragStart={setDragId}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {renderPanel(id)}
            </DraggablePanel>
          ))}
        </div>

        <footer className="bottom">
          <div>Built by A. Nayem · Founder @ Trisien Automence</div>
          <div>Next.js dashboard · live data</div>
        </footer>
      </main>
    </>
  );
}
