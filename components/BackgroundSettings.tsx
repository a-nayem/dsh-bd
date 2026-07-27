"use client";

import { useEffect, useRef, useState } from "react";
import type { BgSettings } from "@/components/BackgroundLayer";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: BgSettings;
  onChange: (next: BgSettings) => void;
  onReset: () => void;
};

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB — real localStorage ceiling for images only, never used for video

export default function BackgroundSettings({ open, onClose, settings, onChange, onReset }: Props) {
  const [urlInput, setUrlInput] = useState(settings.url || "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videos, setVideos] = useState<{ name: string; path: string }[] | null>(null);
  const [videosError, setVideosError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    fetch("/api/backgrounds")
      .then((r) => r.json())
      .then((d) => (d.error ? setVideosError(d.error) : setVideos(d.videos)))
      .catch(() => setVideosError("Could not reach /api/backgrounds"));
  }, [open]);

  if (!open) return null;

  function applyImageUrl(e: React.FormEvent) {
    e.preventDefault();
    setUploadError(null);
    onChange({ ...settings, mode: "image", url: urlInput.trim() || null });
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError(
        `${(file.size / 1024 / 1024).toFixed(1)}MB is over the ~3MB image cap for local storage. Compress it or use a URL instead. (For video, use the "Video from repo" tab — never upload video here.)`
      );
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUrlInput(dataUrl);
      onChange({ ...settings, mode: "image", url: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  function selectVideo(p: string) {
    onChange({ ...settings, mode: "video", videoPath: p || null });
  }

  return (
    <div className="settings-drawer">
      <div className="settings-header">
        <span>Background Settings</span>
        <button className="settings-close" onClick={onClose}>×</button>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab${settings.mode === "video" ? " active" : ""}`}
          onClick={() => onChange({ ...settings, mode: "video" })}
        >
          🎬 Video (from repo)
        </button>
        <button
          className={`settings-tab${settings.mode === "image" ? " active" : ""}`}
          onClick={() => onChange({ ...settings, mode: "image" })}
        >
          🖼 Image
        </button>
      </div>

      {settings.mode === "video" && (
        <div className="settings-panel-body">
          {videosError && <div className="err">{videosError}</div>}
          {!videos && !videosError && <div className="loading">reading public/backgrounds...</div>}

          {videos && videos.length === 0 && (
            <div className="loading">
              No videos found in <code>public/backgrounds/</code>. Drop an .mp4 there, commit, push,
              redeploy — it'll show up here automatically.
            </div>
          )}

          {videos && videos.length > 0 && (
            <select
              className="task-input"
              style={{ width: "100%" }}
              value={settings.videoPath || ""}
              onChange={(e) => selectVideo(e.target.value)}
            >
              <option value="">— select a video —</option>
              {videos.map((v) => (
                <option key={v.path} value={v.path}>{v.name}</option>
              ))}
            </select>
          )}

          <div className="settings-row" style={{ marginTop: 10 }}>
            <input
              className="task-input"
              placeholder="...or type a repo-relative path, e.g. /backgrounds/night-drive.mp4"
              value={settings.videoPath || ""}
              onChange={(e) => selectVideo(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
      )}

      {settings.mode === "image" && (
        <div className="settings-panel-body">
          <form onSubmit={applyImageUrl} className="settings-row">
            <input
              className="task-input"
              placeholder="Paste an image URL..."
              value={urlInput.startsWith("data:") ? "" : urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="task-add" type="submit">Set</button>
          </form>
          <div className="settings-row">
            <button className="jp-reveal" style={{ marginTop: 0 }} onClick={() => fileRef.current?.click()}>
              Upload your own image
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>
          {uploadError && <div className="err" style={{ marginTop: 6 }}>{uploadError}</div>}
        </div>
      )}

      <div className="settings-slider-row" style={{ marginTop: 12 }}>
        <label>Overlay darkness: {Math.round(settings.overlay * 100)}%</label>
        <input
          type="range" min={0} max={0.95} step={0.05} value={settings.overlay}
          onChange={(e) => onChange({ ...settings, overlay: parseFloat(e.target.value) })}
        />
      </div>

      <div className="settings-slider-row">
        <label>Blur: {settings.blur}px</label>
        <input
          type="range" min={0} max={20} step={1} value={settings.blur}
          onChange={(e) => onChange({ ...settings, blur: parseInt(e.target.value, 10) })}
        />
      </div>

      <button
        className="task-remove-full"
        onClick={() => {
          onReset();
          setUrlInput("");
        }}
      >
        Reset to default background
      </button>
    </div>
  );
}
