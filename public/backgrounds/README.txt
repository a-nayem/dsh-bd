Drop your .mp4 (or .webm) live wallpaper files directly in this folder.

Example:
  public/backgrounds/night-drive.mp4

Then commit + push:
  git add public/backgrounds/night-drive.mp4
  git commit -m "add live wallpaper"
  git push

Once deployed, it's served at:
  /backgrounds/night-drive.mp4

The dashboard's Background settings drawer calls /api/backgrounds, which reads
this folder server-side and lists whatever files are actually here — so the
dropdown always reflects what's really in the repo, not a hardcoded guess.

Size note: git repos aren't a CDN. Keep files reasonably compressed (a few MB
to ~20MB is comfortable). If you're pushing something much larger, look into
Git LFS (https://git-lfs.com) rather than committing raw binaries — GitHub
will start rejecting pushes over 100MB per file regardless.
