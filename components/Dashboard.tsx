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
import SettingsMenu from "@/components/SettingsMenu";

// v2: panels now live in a left and a right column, so the old single-order list is not carried over
const LAYOUT_KEY = "empire-dashboard-layout-v2";
// v2: the default wallpaper is the edgewalker video, so old saved "none" settings are not carried over
const BG_KEY = "empire-dashboard-bg-settings-v2";

type Col = "left" | "right";
type Layout = Record<Col, string[]>;

const PANEL_META: Record<string, { label: string }> = {
  hero: { label: "Night Drive" },
  clock: { label: "System Clock" },
  weather: { label: "Weather" },
  tasks: { label: "Checkpoints" },
  japanese: { label: "Japanese Lesson" },
  github: { label: "GitHub Activity" },
  contributions: { label: "Contribution Graph" },
  activity: { label: "Push Activity" },
  languages: { label: "Language Mix" },
  quicklinks: { label: "Quick Access" },
};

// Panels sit on the left or the right edge so the middle of the screen stays clear for the wallpaper
const DEFAULT_LAYOUT: Layout = {
  left: ["hero", "clock", "weather", "tasks", "quicklinks"],
  right: ["github", "activity", "japanese", "languages", "contributions"],
};

function normalizeLayout(raw: unknown): Layout {
  const r = (raw ?? {}) as Partial<Layout>;
  const seen = new Set<string>();
  const take = (list: unknown): string[] =>
    (Array.isArray(list) ? list : []).filter((id): id is string => {
      if (typeof id !== "string" || !(id in PANEL_META) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  const next: Layout = { left: take(r.left), right: take(r.right) };
  // guard against a panel that was added after the layout was saved
  for (const col of ["left", "right"] as Col[]) {
    for (const id of DEFAULT_LAYOUT[col]) if (!seen.has(id)) { next[col].push(id); seen.add(id); }
  }
  return next;
}

function locate(layout: Layout, id: string): { col: Col; idx: number } | null {
  for (const col of ["left", "right"] as Col[]) {
    const idx = layout[col].indexOf(id);
    if (idx !== -1) return { col, idx };
  }
  return null;
}

// Move a panel into a column. With overIdx it lands at that slot, without it goes to the end.
function movePanel(prev: Layout, id: string, col: Col, overIdx?: number): Layout {
  const next: Layout = { left: prev.left.filter((x) => x !== id), right: prev.right.filter((x) => x !== id) };
  const at = overIdx === undefined ? next[col].length : Math.min(overIdx, next[col].length);
  next[col].splice(at, 0, id);
  return next;
}

const DEFAULT_BG: BgSettings = { mode: "video", url: null, videoPath: "/backgrounds/edgewalker.mp4", overlay: 0.3, blur: 0 };

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
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [editMode, setEditMode] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [bg, setBg] = useState<BgSettings>(DEFAULT_BG);
  const [bgOpen, setBgOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const rawLayout = localStorage.getItem(LAYOUT_KEY);
    if (rawLayout) {
      try {
        setLayout(normalizeLayout(JSON.parse(rawLayout)));
      } catch {
        setLayout(DEFAULT_LAYOUT);
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
    const t = setTimeout(() => setSettled(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
  }, [layout, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(BG_KEY, JSON.stringify(bg));
    } catch {
      // quota exceeded on a data-url background — handled in the settings drawer itself
    }
  }, [bg, hydrated]);

  useEffect(() => {
    // a drop outside any panel or column still has to end the drag
    const end = () => setDragId(null);
    window.addEventListener("dragend", end);
    return () => window.removeEventListener("dragend", end);
  }, []);

  function handleDrop() {
    setDragId(null);
  }

  function handleDragOver(overId: string) {
    if (!dragId || dragId === overId) return;
    setLayout((prev) => {
      const over = locate(prev, overId);
      if (!over) return prev;
      return movePanel(prev, dragId, over.col, over.idx);
    });
  }

  // Dragging over empty column space (or below the last panel) sends the panel to the end of that column
  function handleColumnDragOver(col: Col, e: React.DragEvent<HTMLDivElement>) {
    if (!dragId) return;
    e.preventDefault();
    if (e.target !== e.currentTarget) return;
    const last = e.currentTarget.lastElementChild as HTMLElement | null;
    if (last && e.clientY <= last.getBoundingClientRect().bottom) return;
    setLayout((prev) => {
      const cur = locate(prev, dragId);
      if (cur && cur.col === col && cur.idx === prev[col].length - 1) return prev;
      return movePanel(prev, dragId, col);
    });
  }

  function renderColumn(col: Col) {
    return (
      <div
        className={`col${editMode ? " edit" : ""}`}
        onDragOver={(e) => handleColumnDragOver(col, e)}
        onDrop={(e) => { e.preventDefault(); handleDrop(); }}
      >
        {layout[col].map((id) => (
          <DraggablePanel
            key={id}
            id={id}
            label={PANEL_META[id]?.label || id}
            editMode={editMode}
            isDragging={dragId === id}
            onDragStart={setDragId}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {renderPanel(id)}
          </DraggablePanel>
        ))}
      </div>
    );
  }

  return (
    <>
      <BackgroundLayer settings={bg} />

      <main className="wrapper">
        <header className="top">
          <div className="brand">Ayanokouji&apos;s <span>// Empire</span></div>
          <div className="status">
            <div className="dot" />
            SYSTEMS ONLINE
          </div>
        </header>

        <SearchBar />

        {editMode && (
          <div className="edit-banner">
            Drag any panel to reorder it or move it to the other side. Layout saves automatically.
            <button className="settings-close" onClick={() => setLayout(DEFAULT_LAYOUT)} title="Reset layout">
              Reset layout
            </button>
          </div>
        )}

        <div className={`panel-flow${settled ? " settled" : ""}`}>
          {renderColumn("left")}
          <div className="layout-center" aria-hidden="true" />
          {renderColumn("right")}
        </div>

        <footer className="bottom">
          <div>Built by A. Nayem · Founder @ Trisien Automence</div>
          <div>Next.js dashboard · live data</div>
        </footer>
      </main>

      {bgOpen && (
        <div className="settings-sheet">
          <BackgroundSettings
            open={bgOpen}
            onClose={() => setBgOpen(false)}
            settings={bg}
            onChange={setBg}
            onReset={() => setBg(DEFAULT_BG)}
          />
        </div>
      )}

      <SettingsMenu
        bgOpen={bgOpen}
        editMode={editMode}
        onToggleBackground={() => setBgOpen((v) => !v)}
        onToggleEdit={() => setEditMode((v) => !v)}
        onResetLayout={() => setLayout(DEFAULT_LAYOUT)}
      />
    </>
  );
}
