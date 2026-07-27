const QUICK_LINKS = [
  { label: "GitHub", href: "https://github.com/a-nayem", icon: "⚡" },
  { label: "Trisien Automence", href: "https://trisien-automence.vercel.app", icon: "🌐" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alifnayem-trisienautomence/", icon: "🔗" },
  { label: "Instagram", href: "https://instagram.com/_a.nayem_", icon: "📡" },
  { label: "Cal.com", href: "https://cal.com/alifnayem-j98vjt", icon: "📅" },
  { label: "Claude", href: "https://claude.ai/new", icon: "👾" },
];

export default function QuickLinksPanel() {
  return (
    <div className="panel">
      <div className="panel-label">Quick Access</div>
      <div className="quick-grid">
        {QUICK_LINKS.map((l) => (
          <a key={l.label} className="quick-btn" href={l.href} target="_blank" rel="noreferrer">
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
