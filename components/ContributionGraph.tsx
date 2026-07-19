export default function ContributionGraph({ username = "a-nayem" }: { username?: string }) {
  return (
    <div className="panel">
      <div className="panel-label">Contribution Graph — live</div>
      {/* Renders your real GitHub contribution calendar as an SVG, pulled live each load */}
      <img
        src={`https://ghchart.rshah.org/5ec49a/${username}`}
        alt={`${username} GitHub contribution graph`}
        style={{ width: "100%", filter: "invert(0.05) saturate(1.2)" }}
      />
    </div>
  );
}
