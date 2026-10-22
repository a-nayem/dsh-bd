"use client";

import { useEffect, useRef, useState } from "react";

export type BgSettings = {
  mode: "none" | "image" | "video";
  url: string | null; // image URL or data URL
  videoPath: string | null; // repo-relative path, e.g. /backgrounds/edgewalker.mp4
  overlay: number; // 0-1, darkness of the overlay
  blur: number; // px
};

export default function BackgroundLayer({ settings }: { settings: BgSettings }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [readyPath, setReadyPath] = useState<string | null>(null);
  const [failedPath, setFailedPath] = useState<string | null>(null);

  const vp = settings.mode === "video" ? settings.videoPath : null;
  const showVideo = !!vp && failedPath !== vp;
  const videoReady = showVideo && readyPath === vp;

  // The video can finish buffering before React hydrates, which would miss onCanPlay.
  useEffect(() => {
    const v = videoRef.current;
    if (v && vp && v.readyState >= 3) setReadyPath(vp);
  }, [vp]);

  const hasImage = settings.mode === "image" && !!settings.url;
  const showOverlay = hasImage || videoReady;

  return (
    <>
      {/* Gradient is always the base: it is the loading state, the error fallback and the "none" mode */}
      {!hasImage && <div className="bg-image-layer bg-gradient" />}

      {hasImage && <div className="bg-image-layer" style={{ backgroundImage: `url(${settings.url})` }} />}

      {showVideo && (
        <video
          key={vp}
          ref={videoRef}
          className={`bg-video-layer${videoReady ? " ready" : ""}`}
          src={vp!}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlay={() => setReadyPath(vp)}
          onError={() => setFailedPath(vp)}
          // no controls: this is a wallpaper, not a media player
        />
      )}

      {showOverlay && (
        <div
          className="bg-overlay-layer"
          style={{
            backgroundColor: `rgba(6,10,20,${settings.overlay})`,
            backdropFilter: settings.blur ? `blur(${settings.blur}px)` : undefined,
            WebkitBackdropFilter: settings.blur ? `blur(${settings.blur}px)` : undefined,
          }}
        />
      )}
    </>
  );
}
