# 經絡 · Meridian — Deployment Guide

A meditative timekeeper that pairs the Traditional Chinese Medicine organ clock with Yoga Nidra micro-naps. Built as a Progressive Web App so people can install it to their home screen and use it offline.

## The bundle

```
index.html          ← the app (rename of meridian.html)
manifest.json       ← PWA manifest (tells the OS how to install)
sw.js               ← service worker (offline caching)
icon.svg            ← vector icon
icon-192.png        ← 192×192 icon (Android, generic)
icon-512.png        ← 512×512 icon (Android, generic)
icon-maskable.png   ← 512×512 maskable icon (Android adaptive)
meridian.html       ← original single-file version, identical to index.html
```

You only need to deploy the first 7 files. `meridian.html` is just there as a fallback if you want to share a single-file URL.

## What's inside

- **Live meridian clock** — 12-segment radial dial that highlights the current TCM organ and retunes the whole interface to its associated element.
- **Full Yoga Nidra session** — 8 to 18 minutes during nap-able windows, with paced breathing and rotating body-rotation prompts.
- **60-second check-in** — works at every hour, including the sleep windows. A single sentence + three breaths.
- **Wallpaper export** — generates a 1080×2340 PNG of the current state. On mobile, uses the Web Share API so the user can send it straight to wallpaper, Messages, or Instagram. On desktop, downloads as PNG.
- **Optional ambient drone** — Tone.js sine drone tuned to the Chinese pentatonic note for the current element.
- **Installable** — install prompt on Chrome/Edge/Android, custom Safari "Add to Home Screen" instructions on iOS.
- **Offline-first** — service worker caches the shell, so the app works without network after first load.

## Deploying

A PWA must be served over HTTPS (or `localhost`). File:// won't register the service worker. Three easy paths:

### Netlify Drop (zero config)

1. Go to https://app.netlify.com/drop
2. Drag the whole folder onto the page
3. You get a public URL in ~10 seconds

### Vercel

```bash
npx vercel --prod
```
Inside the folder. It auto-detects static files and deploys.

### GitHub Pages

1. Push the folder to a GitHub repo
2. Settings → Pages → Source: deploy from `main`
3. Wait ~1 minute for the URL

### Cloudflare Pages

Connect a Git repo or upload the folder directly. No build step required.

## Local testing

Service workers won't run from `file://`. To test locally with full PWA behavior:

```bash
# Python (any modern version)
python3 -m http.server 8000

# Or Node
npx serve

# Or PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`. Chrome DevTools → Application → Manifest will show you the manifest is valid and the icons resolved.

## Customization knobs

In `index.html`, the main things you might tweak:

- **`MERIDIANS` array** (around line 880) — the 12 organs with timing, body focus, intent, and full guidance scripts. Easy to translate to other languages or rewrite in your own voice.
- **`MICRO_PROMPTS` map** (around line 1340) — the one-line prompts shown during 60-second check-ins.
- **`ELEMENTS` map** — color/glow/note per element. Change the palette here.
- **CSS variables in `:root`** — the global color tokens.
- **Fonts** — Cormorant Garamond + Fraunces + Noto Serif SC from Google Fonts. Swap in the `<link>` if you want a different vibe.

## Next-step ideas

The realistic v2 stack if this gets traction:

1. **Web Push notifications** at organ transitions (with smart filtering: only notify for windows the user has practiced before).
2. **Session journal** — log each check-in to `localStorage`, show a heatmap of practice times.
3. **Wear OS / Apple Watch complication** — needs native code, but the watch is where this idea reaches its full potential as ambient reminder.
4. **iOS Lock Screen widget** (SwiftUI WidgetKit) — same reasoning.
5. **Browser new-tab extension** — turns every new tab into a meridian glance.

## License & framing

The clock and the practice are traditional. Do whatever you'd like with the code. Just don't market it as medical advice — it isn't.
