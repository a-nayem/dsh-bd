export default function HeroPanel() {
  return (
    <div className="panel hero-panel">
      <div className="panel-label">Night Drive</div>
      {/* Drop your own image at public/car.jpg to replace this. Using an external
          placeholder here since embedding a multi-MB base64 blob in source is a bad idea. */}
      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
        alt="Night drive"
        className="hero-img"
      />
    </div>
  );
}
