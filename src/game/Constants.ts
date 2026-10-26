// Calibratable approximations; see docs/original-game-research.md.
export const C = { width:101, height:64, columns:12, rows:6, cell:8, left:2, floor:62, ceiling:5, hz:30, walk:0.5, fall:1/3, jumpHeight:8, jumpTicks:7, clearTicks:18, craneSpeed:1, craneOpenTicks:8, craneCooldown:45, maxCranes:5, dropScore:2, rowScore:10 } as const;
export const rowY = (r:number) => C.floor - (r+1)*C.cell;
