"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop";
const KEY_STORE = "empire-dashboard-admin-key";
const MAX_WIDTH = 1600;

type Phase = "idle" | "needkey" | "pushing" | "done" | "error";

// Any image the browser can decode becomes a JPEG of at most 1600px wide, which keeps the repo small
async function toJpeg(file: File): Promise<{ dataUrl: string; base64: string }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bmp.width);
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");
  ctx.fillStyle = "#000"; // transparent PNGs would otherwise turn black anyway, this makes it explicit
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
  return { dataUrl, base64: dataUrl.split(",")[1] };
}

export default function HeroPanel() {
  const [src, setSrc] = useState(FALLBACK);
  const [phase, setPhase] = useState<Phase>("idle");
  const [msg, setMsg] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const pending = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d: { src: string | null; v: number }) => {
        if (d.src) setSrc(`${d.src}?v=${d.v}`);
      })
      .catch(() => {});
  }, []);

  async function push(base64: string, key: string) {
    setPhase("pushing");
    setMsg("Pushing to GitHub...");
    try {
      const r = await fetch("/api/hero/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ image: base64 }),
      });
      const d = (await r.json().catch(() => ({}))) as { error?: string };
      if (r.status === 401) {
        localStorage.removeItem(KEY_STORE);
        setPhase("needkey");
        setMsg("Wrong admin key");
        return;
      }
      if (!r.ok) throw new Error(d.error || `Upload failed (${r.status})`);
      pending.current = null;
      setPhase("done");
      setMsg("Pushed. Live after Vercel redeploys, about a minute.");
      setTimeout(() => setPhase((p) => (p === "done" ? "idle" : p)), 9000);
    } catch (e) {
      setPhase("error");
      setMsg(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { dataUrl, base64 } = await toJpeg(file);
      setSrc(dataUrl); // show it right away, the deploy catches up later
      pending.current = base64;
      const key = localStorage.getItem(KEY_STORE);
      if (key) {
        await push(base64, key);
      } else {
        setPhase("needkey");
        setMsg("Enter your admin key to push");
      }
    } catch {
      setPhase("error");
      setMsg("Could not read that image. Try a JPG, PNG or WebP.");
    }
  }

  function submitKey(e: React.FormEvent) {
    e.preventDefault();
    const key = keyInput.trim();
    if (!key || !pending.current) return;
    localStorage.setItem(KEY_STORE, key);
    setKeyInput("");
    push(pending.current, key);
  }

  const busy = phase !== "idle";

  return (
    <div className="panel hero-panel">
      <div className="panel-label">Night Drive</div>
      <img
        src={src}
        alt="Night drive"
        className="hero-img"
        onError={() => setSrc((cur) => (cur === FALLBACK ? cur : FALLBACK))}
      />

      <div className={`hero-actions${busy ? " busy" : ""}`}>
        {phase === "needkey" ? (
          <form className="hero-key-form" onSubmit={submitKey}>
            <input
              className="task-input"
              type="password"
              autoComplete="off"
              placeholder="Admin key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
            <button className="task-add" type="submit">Push</button>
            <button className="task-add" type="button" onClick={() => { pending.current = null; setPhase("idle"); }}>
              Cancel
            </button>
          </form>
        ) : (
          <button
            className="pill-btn"
            type="button"
            disabled={phase === "pushing"}
            onClick={() => fileRef.current?.click()}
          >
            Change image
          </button>
        )}
        {busy && msg && <span className={`hero-status${phase === "error" ? " bad" : ""}`}>{msg}</span>}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
      </div>
    </div>
  );
}
