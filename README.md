# Empire Dashboard (Next.js)

Upgrade of the static HTML homepage. Real data, no hardcoded stats.

## MP4 live wallpaper (permanent, repo-hosted)
This is the "permanent" version — hosted in this repo, not the browser.
1. Drop your video at `public/backgrounds/your-file.mp4` (see `public/backgrounds/README.txt`).
2. `git add public/backgrounds/your-file.mp4 && git commit -m "add wallpaper" && git push`.
3. Redeploy (or it auto-deploys if you're on Vercel with git integration).
4. Open the dashboard → 🖼 Background → **Video (from repo)** tab. The dropdown is populated live by `/api/backgrounds`, which reads `public/backgrounds/` server-side — it shows whatever's actually committed, not a guess.
5. Pick it. It plays as a real `<video autoplay loop muted>` full-bleed background, with overlay-darkness/blur sliders on top for text readability.

**Why not localStorage for video, and why not a live "upload" button that pushes to GitHub:** localStorage tops out around 5–10MB total and is base64-text-only — a video would blow past that instantly. A browser button that pushes straight to GitHub would need a server-side GitHub API integration with a personal access token embedded somewhere — that's a real security surface for a personal dashboard, so it isn't wired. The `public/backgrounds/` + `git push` workflow above *is* "upload to the repo, code pulls from there" — it's a push instead of a button, and it's also the only version that survives a from-scratch redeploy.

**Repo size note:** GitHub rejects files over 100MB outright. Keep the video reasonably compressed (a few MB to ~20MB is comfortable for a loop). For something larger, look at Git LFS, or host it externally (Cloudflare R2, Vercel Blob, etc.) and point the video path at that URL instead — the component doesn't care, it's just a `src`.

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

## New in this pass
- **Custom background** — click "🖼 Background" in the header. Set an image URL, or upload your own (capped at ~3MB — that's a real localStorage ceiling, not an arbitrary restriction; compress larger images first). Overlay darkness and blur sliders control readability over whatever image you pick. Persisted in `localStorage`, survives reloads.
- **Drag-to-reorder layout** — click "⠿ Edit Layout" in the header. Every panel gets a drag handle; drag to rearrange, order saves automatically. "Reset order" reverts to default. Drag is only active in edit mode specifically so it never interferes with typing into the task input or Japanese lesson field during normal use.

## New in this pass
- **Contribution graph** — real, rendered from your actual GitHub contribution history (image-based, updates on load).
- **Activity line chart** — real, aggregated from your public GitHub events over the last 14 days.
- **Language bar chart** — real, computed from your repos' declared languages.
- **Task/checkpoint tracker** — persisted in `localStorage`, resets daily. Progress % is *computed* from checked items, not asserted.
- **Search** — now opens results in a new tab (`window.open`, not `location.href`).
- **Hero image** — swap the Unsplash placeholder for your own by dropping a file at `public/car.jpg` and pointing `HeroPanel.tsx` at it. I didn't re-embed the original base64 blob — a multi-MB string in source control is a bad habit regardless of how it looks.

## Connecting Gmail (for the Mail panel)
This needs OAuth — there's no way to show real unread mail without it, so the panel currently reports "not connected" honestly rather than showing fake numbers. To wire it up:
1. Google Cloud Console → new project → enable the Gmail API.
2. OAuth consent screen → add yourself as a test user → scope `gmail.readonly`.
3. Create OAuth client credentials (Desktop app type).
4. Use the [OAuth Playground](https://developers.google.com/oauthplayground) with your own client ID/secret (gear icon → use your own credentials) to authorize `https://www.googleapis.com/auth/gmail.readonly` and get a refresh token.
5. Set these env vars (`.env.local`):
   ```
   GMAIL_CLIENT_ID=...
   GMAIL_CLIENT_SECRET=...
   GMAIL_REFRESH_TOKEN=...
   ```
6. Restart the dev server. The panel will start showing real unread count + subject lines.

## Extending with real data
- **TryHackMe rooms completed**: TryHackMe has no public API; would need scraping your profile page or manual entry synced to a small KV store.
- **LinkedIn posts / outreach counts**: no public API either — these need manual logging (a simple `/api/log` + storage) if you want them on the dashboard instead of faked.
- **Focus timer with persistence**: current version's timer (if you want it back) should write session counts to a database, not just component state that resets on refresh.

Say which of these you want next and I'll build it — but I'm not re-adding hardcoded numbers dressed up as telemetry.
