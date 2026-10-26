# Authenticity and validation report

This is a playable, unofficial first-generation C45-style reconstruction. It is **not a certified pixel-perfect or ROM-accurate preservation**. Primary video/manual access was blocked by proxy 403. No direct original-footage comparison was performed.

## Implemented

- 101×64 logical monochrome canvas, 12 columns of 8 px crates, two-cell worker, stippled warehouse, traversing claws, random initial stacks and seeded drop choices.
- Walking, one-cell jumps and diagonal climbing, single-crate pushing, upper-stack pushing at jump apex, collision boundaries, falling crates, stacks, bottom-row clearing and crush death.
- Clear ring animation, gravity after clearing, inferred 2/drop and 10×cranes/row scoring, one extra crane per row up to five.
- Fixed 30 Hz simulation independent of rendering; no catch-up after long suspension, automatic pause on hidden document/window blur.
- Pixel title/options/pause/results, restart, high score and settings persistence with graceful storage failure.
- Pointer-captured proportional swipes, immediate reversal, tap and diagonal jump, cancellation, three sensitivity settings, independent keyboard input and optional phone keypad.
- Short synthesized sound approximations, mute, interaction-gated Web Audio; no music or recorded original audio.
- Local-only PWA manifest/assets, offline cache, relative base and GitHub Pages Actions workflow.

## Visual inspection actually performed

Inspected the supplied Flipper remake's `screenshots/gameplay.png` and GBA remake's `docs/verification/02-gameplay-worker.png`, then inspected this project's desktop title/gameplay and mobile screenshots. These are **remake comparisons**, not original screenshots. Both references support patterned crates, a top rail, stippled warehouse and a cap-wearing worker. Flipper's wide side scoreboard and orange palette were not copied. GBA's replacement worker was not copied. The MIT Flipper worker frames were adopted with the full license notice; our crate/crane/font/title graphics are independently drawn.

Screenshots from actual Chromium runs are in `docs/screenshots/`: title, desktop gameplay, mobile gameplay, pause and game over. These are evidence of rendering, not golden-image assertions. Random board layouts can change gameplay screenshots across test runs.

## Known authenticity differences and unknowns

- Original scoring is not directly verified. MIT remakes agree, but Flipper cites stktk; this is not fully independent confirmation. GBA explicitly uses a different assumed formula.
- Original timing is disputed. Current walking is 15 px/s, crates 10 px/s, one-cell jump approximately 0.47 s. Renderer quantizes to whole LCD pixels; engine uses fractional collision coordinates and grid targets.
- A push reserves its destination cell immediately and displays a 16-tick slide; this prevents overlapping pushes. Interaction timing while another crate falls next to that slide has not been matched to hardware.
- Row removal is simultaneous after 0.6 s, following the GBA secondary account. Flipper describes a wave; the original sequence remains unresolved. Physics freezes during the clear sequence.
- Only the complete bottom row clears (stktk rule); multi-row and chain behavior on the original are unknown.
- Maximum five cranes, spawn intervals, initial crate distribution, crate patterns, LCD tint, menus, English text and exact sound envelopes are approximations. No original firmware/font/title graphic is included.
- Falling-side pushes and helmet smashing described in other remakes are not implemented without primary evidence. These may be original behaviors and remain a fidelity limitation.
- No speculative top-out loss: high columns are skipped by cranes; falling-crate contact causes loss.
- Optional keypad appears below the display only when enabled; default display contains no buttons outside the LCD.

## Validation scope

Automated engine/input tests exercise movement, boundaries, blocked/chain/wall pushes, free pushes, falling stacks, support removal, cranes/drop score, deterministic seeds, jump height/landing, diagonal climb and upper push, head collision, full-row detection, duplicate prevention, row gravity, progression, crush loss, swipes/reversals/cancellation/taps/sensitivity, keyboard independence, persistence and fixed timing across 60/90/120 Hz.

Production-browser tests exercise real keyboard input, real mobile touch events through Chromium's CDP, menu preferences, pause/resume, idle-game death, restart, persisted high score, blur pausing and a cold offline reload under the repository subpath. JavaScript error collection is checked in desktop/mobile/offline scenarios. Test clock acceleration preserves the app's fixed timestep.

Chromium desktop and mobile emulation were exercised. Physical iPhone Safari, Android hardware, Firefox, Edge, audio listening, native installation prompts and battery measurements were **not** tested. The code uses standard APIs and unsupported fullscreen/audio/storage are handled gracefully, but those platforms need a device pass before claiming universal compatibility.

GitHub Actions and deployment are configured, not executed remotely. No public URL or deployment success is claimed. Local commits have not been pushed. See README for publishing instructions.

## Recorded local results (2026-10-26)

- Frozen-lockfile reinstall (`npm ci`): passed.
- TypeScript strict check: passed.
- Vitest: **39 passed**, 10 files; no skipped/expected-failure tests.
- Playwright production Chromium: **5 passed**; no skipped tests. Uses the system Chromium available in this cloud machine.
- Production build: passed; application JS approximately 21 kB / 7.7 kB gzip (service-worker runtime separate).
- `npm audit`: **0 vulnerabilities** in the locked dependency tree at validation time.
- Development server started and its HTML/module responses checked locally. No externally accessible preview is provided by the onboarding UI.
