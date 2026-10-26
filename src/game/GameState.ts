export type Direction = -1 | 0 | 1;
export type Scene = 'title'|'playing'|'paused'|'over'|'settings';
export type SoundEvent = 'jump'|'land'|'push'|'clear'|'over'|'menu';
export interface Input { direction:Direction; jump:boolean }
export interface Player { x:number; y:number; face:-1|1; target:number|null; rise:number; grounded:boolean; moving:boolean; pushing:boolean }
export interface Crate { x:number; y:number; pattern:number }
export interface Crane { x:number; target:number; direction:-1|1; phase:'carry'|'open'|'leave'|'wait'; timer:number; pattern:number }
export interface PushAnimation { from:number; to:number; row:number; age:number; pattern:number }
