"use client";

import { useEffect, useState } from "react";

type Task = { id: string; label: string; done: boolean };

const STORAGE_KEY = "empire-dashboard-tasks";

const DEFAULT_TASKS: Task[] = [
  { id: "t1", label: "TryHackMe: 3 rooms", done: false },
  { id: "t2", label: "Python: 30 min", done: false },
  { id: "t3", label: "Client outreach: 5 sent", done: false },
  { id: "t4", label: "GitHub commit", done: false },
];

export default function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) {
        setTasks(parsed.tasks);
        setHydrated(true);
        return;
      }
    }
    setTasks(DEFAULT_TASKS);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, tasks }));
  }, [tasks, hydrated]);

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    setTasks((prev) => [...prev, { id: `t${Date.now()}`, label, done: false }]);
    setNewLabel("");
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div className="panel">
      <div className="panel-label">Today&apos;s Checkpoints</div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-label">{done}/{tasks.length} complete · {pct}%</div>

      <div style={{ marginTop: 10 }}>
        {tasks.map((t) => (
          <div className="task-item" key={t.id}>
            <label className="task-check">
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span className={t.done ? "task-label done" : "task-label"}>{t.label}</span>
            </label>
            <button className="task-remove" onClick={() => removeTask(t.id)} aria-label="remove task">×</button>
          </div>
        ))}
      </div>

      <form onSubmit={addTask} className="task-form">
        <input
          className="task-input"
          placeholder="Add a checkpoint..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <button className="task-add" type="submit">+</button>
      </form>
    </div>
  );
}
