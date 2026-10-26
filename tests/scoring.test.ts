import { expect,test } from 'vitest';
import { completeBottom,rowPoints } from '../src/game/Scoring';
import { craneCount } from '../src/game/Difficulty';
import { empty,ticks } from './helpers';
test('only a full bottom row triggers a clear, once',()=>{const g=empty();g.board[0].fill(1);g.player.y=38;g.cranes=[{x:0,target:0,direction:1,phase:'wait',timer:999,pattern:1}];g.tick();expect(g.clearing).toBe(18);expect(g.score).toBe(10);ticks(g,17);expect(g.score).toBe(10);g.tick();expect(g.board[0].every(v=>v===0)).toBe(true);expect(g.lines).toBe(1);expect(g.cranes).toHaveLength(2);});
test('missing a single column is not complete',()=>{const g=empty();g.board[0].fill(1);g.board[0][5]=0;expect(completeBottom(g.board)).toBe(false);});
test('scoring and crane progression follow documented inferred rules',()=>{expect(rowPoints(1)).toBe(10);expect(rowPoints(3)).toBe(30);expect([0,1,2,3,4,10].map(craneCount)).toEqual([1,2,3,4,5,5]);});
test('row removal releases upper crates into gravity',()=>{const g=empty();g.board[0].fill(1);g.board[1][5]=3;g.player.y=38;g.tick();ticks(g,19);expect(g.falling.some(b=>b.x===40)).toBe(true);});
