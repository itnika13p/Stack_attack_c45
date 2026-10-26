# Original-game research

Research performed 2026-10-26, before implementing the engine. This is an unofficial first-generation Stack Attack reconstruction, not Stack Attack 2/Advanced. VERIFIED below means directly checked in an accessible source, **not verified on original hardware**. Original behavior is only inferred when the evidence is a remake. There is no original-ROM or direct-footage verification in this delivery.

## Access and sources

- [Requested C45 recording](https://www.youtube.com/watch?v=cjh7mMdTulk): direct HTTP access returned proxy 403. No frames were watched and no original audio was auditioned.
- [Requested manual](https://djvu.online/file/W2AmuoDWykZqp): proxy 403; no manual claims treated as verified.
- [GBA remake](https://github.com/AltairCardinal/stack-attack-gba), README, `docs/video-analysis.md`, configuration and verification report inspected via Git. Contains a secondary frame-by-frame account of the requested recording. **No project license granted**; no code, sprites, title art or audio copied.
- [Flipper remake](https://github.com/Negenii/flipper-stack-attack), README, rules, rendering, ASCII sprites inspected. MIT (Evgeny Ugreninov, 2026). Its own documentation admits reconstruction from original and other remakes. Claims 15 Hz, 12 columns, 8 px cells, 16 px worker, 2 points/drop and 10×cranes/row. Geometry is 104 px wide including walls, so its width is not copied as hardware evidence.
- [Advanced browser remake](https://github.com/duremika/stack-attack-advanced): inspected README, license and file structure. Unlicense; has bombs, hearts, characters and other sequel features. Excluded as a first-generation rules/art authority; no assets/code copied.
- [Stktk](https://github.com/eaun01re/stktk): README, constants, world rules and sound provenance inspected. MIT (Svetov Leonid, 2025). Independently describes 101×64, 12 columns, 8 px crates, 2/drop, 10×cranes/row, maximum 5 cranes. It explicitly warns its rules may miss details. Its audio derives from video recordings; **not reused**. Flipper cites this project, so their agreement is not fully independent corroboration.

## Findings and decisions

| Subject | Evidence and status | Implementation |
|---|---|---|
| Display | VERIFIED source agreement: GBA report and stktk constants say 101×64. INFERRED for hardware without direct specification access. | 101×64 internal Canvas; square pixels and integer CSS scale where possible. |
| Field | VERIFIED remake agreement on 12 columns, 8 px cells. GBA says ~6 rows; stktk 5 rows; Flipper 6 plus headroom. Original exact borders UNKNOWN. | 12×6, 96 px wide, narrow walls; floor y=62, upper rail. |
| Worker | VERIFIED GBA report and MIT Flipper sheet: one column wide, two crates high, brimmed cap, face, work clothes. Original exact pixels UNKNOWN. | MIT-licensed Flipper worker frames adapted with attribution; walk/front/jump/push poses. |
| Crates | VERIFIED source agreement: 8×8 bordered boxes with multiple monochrome patterns. Pattern-specific effects UNKNOWN. | Eight decorative patterns, equivalent physics. Original drawings, not extracted assets. |
| Spawning | VERIFIED secondary report: traversing cranes release at columns; begins with a populated floor and one crane. Original RNG and cadence UNKNOWN. | Seeded RNG, twelve starting crates with gaps, one crane, finite carry/open/return cycle; avoid impossible occupied top drops. |
| Jump | INFERRED: GBA reports ~0.38–0.46 s, one-cell height. Flipper uses much longer 15 Hz rise/fall. | 14 ticks at 30 Hz (~0.467 s), height 8 px, quantized drawing; no double jump. |
| Push | VERIFIED remake agreement: one adjacent free crate, no pulling or pushing a chain; can jump beside a stack and push its upper single box. Falling side-push and head-breaking are described by MIT remakes but not established by accessible original footage. | Push single settled crate into free space, including at jump apex; upper box blocks ground pushing. No helmet-break power mechanic without primary evidence. |
| Row clear | VERIFIED all references: complete bottom row clears and stacks fall. GBA report says simultaneous flash/delete; Flipper claims right-to-left wave. Exact original sequence UNKNOWN. | Bottom row ring animation then simultaneous removal over 0.6 s; gravity resolves upper crates physically and may crush player. Only bottom row counts (stktk). |
| Score | VERIFIED stktk and Flipper: +2 per crane release, +10×current cranes per row; GBA uses explicitly assumed +5 and +100. Original exact formula UNKNOWN. | More-supported 2/drop and 10×cranes/row. No invented combos or time bonus. |
| Difficulty | INFERRED: added crane per row, at least three per secondary footage account; MIT remakes cap five. Original cap UNKNOWN. | One initially; +1/row, cap five. Constant individual fall/move speed; greater drop concurrency. |
| Loss | VERIFIED secondary report: falling crate crushes worker. Top-out loss disputed/UNKNOWN. | Crush ends game; occupied high columns are skipped by cranes, no speculative instant top-out. |
| Timing | Original logic tick UNKNOWN (GBA suggests 10–12 Hz, Flipper says 15). GBA fall ~7–10 px/s; Flipper 15. | Deterministic 30 Hz simulation, ~15 px/s horizontal, 10 px/s fall, quantized LCD pixels. Rendering independent of monitor refresh rate. |
| Audio | GBA secondary frequency analysis ~1657–1960 Hz, short jump/clear/death sequences; no BGM. Original exact envelopes UNKNOWN. | Original synthesized square-wave approximations with short gain envelopes; menu/push are explicitly approximate. No recorded audio. |
| Menus | VERIFIED GBA report: brief title then game; death result persists. Pause/high score/sound appearance not shown. Original menu text/layout UNKNOWN. | Original-style pixel title, Start/Options, pause, results/restart, score/best, sound, swipe sensitivity, optional keypad and fullscreen. English text; no claim of exact menu reproduction. |

## Boundaries

No bombs, hearts, multiple characters, helmets as power-ups, modern backgrounds, music, levels or selectable game difficulties. Control settings are the requested touchscreen modernization. Exact original sprite matching, scoring, RNG, timing and sound remain provisional until original footage/hardware can be directly checked. The worker artwork is adapted under the Flipper MIT license (full notice in `docs/licenses/flipper-MIT.txt`); crane, crates, font and title layout are independently drawn. All uncertain defaults live in `src/game/Constants.ts` and `src/game/Difficulty.ts`.

## Reproducible source revisions inspected

- GBA: `a2e513e52f6789e948578ff432f6a6195f5ea55c`
- Flipper: `658e60e82930888e8a9c703bac34a4e83a7b0db5`
- Stktk: `4da5d8d27b9ec4c126f04f342f125b4c432bf094`
- Advanced browser: `017f61963383141a74d1e76c5872cbecd060f558`
