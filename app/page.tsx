import SearchBar from "@/components/SearchBar";
import Clock from "@/components/Clock";
import GithubPanel from "@/components/GithubPanel";
import WeatherPanel from "@/components/WeatherPanel";
import HeroPanel from "@/components/HeroPanel";
import ContributionGraph from "@/components/ContributionGraph";
import ActivityChart from "@/components/ActivityChart";
import LanguageChart from "@/components/LanguageChart";
import MailPanel from "@/components/MailPanel";
import TasksPanel from "@/components/TasksPanel";

const QUICK_LINKS = [
  { label: "GitHub", href: "https://github.com/a-nayem", icon: "⚡" },
  { label: "Trisien Automence", href: "https://trisien-automence.vercel.app", icon: "🌐" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alifnayem-trisienautomence/", icon: "🔗" },
  { label: "Instagram", href: "https://instagram.com/_a.nayem_", icon: "📡" },
  { label: "Cal.com", href: "https://cal.com/alifnayem-j98vjt", icon: "📅" },
  { label: "Claude", href: "https://claude.ai/new", icon: "👾" },
];

export default function Page() {
  return (
    <main className="wrapper">
      <header className="top">
        <div className="brand">Ayanokouji&apos;s <span>// Empire</span></div>
        <div className="status">
          <div className="dot" />
          SYSTEMS ONLINE
        </div>
      </header>

      <SearchBar />

      <div className="grid">
        <HeroPanel />
        <div className="panel">
          <div className="panel-label">System Clock</div>
          <Clock />
        </div>
        <WeatherPanel />
      </div>

      <div className="grid">
        <TasksPanel />
        <MailPanel />
        <GithubPanel />
      </div>

      <div className="grid">
        <ContributionGraph />
        <ActivityChart />
        <LanguageChart />
      </div>

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

      <footer className="bottom">
        <div>Built by A. Nayem · Founder @ Trisien Automence</div>
        <div>Next.js dashboard · live data</div>
      </footer>
    </main>
  );
}
