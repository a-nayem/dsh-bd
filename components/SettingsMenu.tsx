"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  bgOpen: boolean;
  editMode: boolean;
  onToggleBackground: () => void;
  onToggleEdit: () => void;
  onResetLayout: () => void;
};

export default function SettingsMenu({ bgOpen, editMode, onToggleBackground, onToggleEdit, onResetLayout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function run(fn: () => void) {
    fn();
    setOpen(false);
  }

  return (
    <div className="settings-fab" ref={ref}>
      {open && (
        <div className="settings-menu" role="menu">
          <button role="menuitem" className="menu-item" onClick={() => run(onToggleBackground)}>
            <span>Background</span>
            <span className="menu-state">{bgOpen ? "Open" : ""}</span>
          </button>
          <button role="menuitem" className="menu-item" onClick={() => run(onToggleEdit)}>
            <span>{editMode ? "Done editing" : "Edit layout"}</span>
            <span className="menu-state">{editMode ? "On" : ""}</span>
          </button>
          <button role="menuitem" className="menu-item" onClick={() => run(onResetLayout)}>
            <span>Reset layout</span>
          </button>
        </div>
      )}
      <button
        className={`pill-btn fab-btn${open || editMode ? " active" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Settings
      </button>
    </div>
  );
}
