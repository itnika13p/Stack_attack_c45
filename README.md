# Stack Attack · C45

A lightweight, unofficial browser recreation of the first-generation Siemens warehouse game. TypeScript, Canvas, synthesized Web Audio, no framework, no backend, no tracking. Only the monochrome 101×64 game display is shown.

**Authenticity is provisional.** Original footage and the manual could not be accessed in the development environment. Rules are reconstructed from the supplied remakes and their documented analysis. Exact original scoring, sprite identity, sound, timing, RNG and menu layout are not certified. See [research](docs/original-game-research.md) and [authenticity/validation report](docs/authenticity-report.md).

## Run

Node 24 recommended (22.12+ supported).

```sh
npm ci
npm run dev
```

Run these commands inside the checkout. Open the address Vite prints in a normal development environment. On a phone, use HTTPS hosting (or your development machine's LAN address for basic play; installation/offline requires HTTPS). No secrets, services or environment variables are required. High scores and preferences stay on that browser/device.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Browser tests use Playwright's pinned Chromium by default:

```sh
npx playwright install --with-deps chromium
npm run test:e2e
```

For a machine that already supplies Chromium, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run test:e2e`. Tests exercise the production build under `/Stack_attack_c45/`, actual keyboard and touch events, game over/restart, preferences, high scores, pausing and an offline reload. Build first. Tests save screenshots in `docs/screenshots/`.

## Play

Arrange falling crates into a complete bottom row. Push one free crate at a time. Jump onto crates, or jump toward a two-high stack to push its upper crate. Crates falling on the worker end the game. Each cleared row adds a crane, up to five. The inferred scoring model awards 2 per crane drop and 10×current cranes per row; there are no combo bonuses or power-ups.

- **Phone:** tap Start, swipe/drag horizontally to walk and push; tap to jump; swipe diagonally upward to jump and move. Quick swipes commit one cell; longer drags provide more cells at the fixed game speed. Release cancels the queued movement, while the current cell step completes. Reverse a drag to turn immediately. Tap the top crane rail to pause.
- **Keyboard:** Left/A and Right/D walk/push; Up/W/Space jump; Enter starts/pauses/selects; Escape backs out/pauses. Up/Down select menus. F requests fullscreen where supported; M toggles sound.
- **Options:** sound, low/normal/high swipe sensitivity, optional phone keypad, fullscreen. The optional keypad supports 4/6 walking, 8 jumping, 7/9 diagonal jumps, 0 pause. It is hidden by default. Sensitivity changes gestures, never physics speed.
- On game over, select Restart. Score and best score appear in pause/results. Hidden tabs and window blur automatically pause; resume explicitly to continue.

Sound starts only after interaction and uses short, quiet synthesized notes, not original recordings. Storage and audio failures do not prevent play. If fullscreen is unavailable (including some iPhones), the game still fits the viewport. There is no background music.

## Install and offline

The production build includes a manifest, 192/512 px icons and a Workbox service worker through `vite-plugin-pwa`. Load once online over HTTPS, wait for caching, then reopen/reload. On iPhone, use Safari → Share → Add to Home Screen. On Android, use Chrome's installation menu. Only this application's assets are cached. Closing and reopening applies a downloaded update; active games are not forcibly reloaded. Browsers can evict offline data; a first visit always requires network access.

## GitHub Pages

1. Push this project to the repository's **main** branch.
2. In repository **Settings → Pages → Build and deployment**, set **Source: GitHub Actions**.
3. The included workflow installs locked dependencies, checks TypeScript, runs unit tests, builds, runs Chromium tests, then deploys `dist/`. Pull requests validate without deploying.

Vite's default `base: './'` supports a repository subdirectory and custom domains. To build for an explicit base, run `npm run build -- --base=/Stack_attack_c45/`. If using that option, also pass the matching `--base` to `npm run preview`. The service worker is scoped to the containing directory. No deployment has been performed by this local development task.

## Structure and licenses

`src/game/` is the deterministic engine and clock; `rendering/` draws the LCD and bitmaps; `input/` separates keyboard, gestures and keypad; `audio/` synthesizes effects; `storage/` handles validated best-effort persistence. Tests cover engine rules and controls independently of rendering.

Worker bitmap frames are adapted from [Negenii/flipper-stack-attack](https://github.com/Negenii/flipper-stack-attack), copyright 2026 Evgeny Ugreninov, MIT; full notice is in [docs/licenses/flipper-MIT.txt](docs/licenses/flipper-MIT.txt). No GBA remake code/art or recording audio is included. Other art and implementation are authored for this project. Siemens and Stack Attack belong to their respective owners; this fan reconstruction is not affiliated with Siemens. No claim of permission to redistribute the original proprietary game is made.
