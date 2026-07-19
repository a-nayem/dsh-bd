# Empire Dashboard (Next.js)

Upgrade of the static HTML homepage. Real data, no hardcoded stats.

## What changed vs. the old static version
- **Search box** — actually submits to `https://www.google.com/search?q=...`, not decorative.
- **GitHub stats** — pulled live from GitHub's public REST API (`/api/github`), 5-min cache, repo count/followers/stars/recent repos are all real.
- **Weather** — live from Open-Meteo (no API key needed), uses browser geolocation with a Dhaka fallback.
- **Removed** the fictional car telemetry/aero panel — pure decoration with fake numbers, not worth porting.
- **Removed** the fake "operator momentum/consistency" progress bars — those were hardcoded percentages with no data source. If you want real ones, they need to be wired to an actual metric (e.g. GitHub commit streak, TryHackMe API, a tracker you build) — say the word and I'll wire it.

## Run it

```bash
cd empire-dashboard
npm install
npm run dev
```

Open http://localhost:3000

## Set as browser homepage
1. `npm run build && npm start` (or deploy to Vercel — it's a Next.js app, one-click deploy)
2. Point your browser's "new tab / homepage" setting to that URL.

## Extending with real data
- **TryHackMe rooms completed**: TryHackMe has no public API; would need scraping your profile page or manual entry synced to a small KV store.
- **LinkedIn posts / outreach counts**: no public API either — these need manual logging (a simple `/api/log` + storage) if you want them on the dashboard instead of faked.
- **Focus timer with persistence**: current version's timer (if you want it back) should write session counts to a database, not just component state that resets on refresh.

Say which of these you want next and I'll build it — but I'm not re-adding hardcoded numbers dressed up as telemetry.
