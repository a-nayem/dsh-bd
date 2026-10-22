export type BgSettings = {
  mode: "none" | "image" | "video";
  url: string | null; // image URL or data URL
  videoPath: string | null; // repo-relative path, e.g. /backgrounds/night-drive.mp4
  overlay: number; // 0-1, darkness of the overlay
  blur: number; // px
};

export default function BackgroundLayer({ settings }: { settings: BgSettings }) {
  return (
    <>
      {settings.mode === "video" && settings.videoPath && (
        <video
          className="bg-video-layer"
          src={settings.videoPath}
          autoPlay
          loop
          muted
          playsInline
          // no controls — this is a wallpaper, not a media player
        />
      )}

      {settings.mode === "image" && settings.url && (
        <div className="bg-image-layer" style={{ backgroundImage: `url(${settings.url})` }} />
      )}

      {settings.mode === "none" && <div className="bg-image-layer bg-gradient" />}

      {settings.mode !== "none" && (
      <div
        className="bg-overlay-layer"
        style={{
          backgroundColor: `rgba(6,7,8,${settings.overlay})`,
          backdropFilter: settings.blur ? `blur(${settings.blur}px)` : undefined,
          WebkitBackdropFilter: settings.blur ? `blur(${settings.blur}px)` : undefined,
        }}
      />
      )}
    </>
  );
}
