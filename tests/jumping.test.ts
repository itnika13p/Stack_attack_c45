import { expect,test } from 'vitest';
import { empty,ticks } from './helpers';
test('jump reaches one cell then lands at the same height',()=>{const g=empty();ticks(g,7,{direction:0,jump:true});expect(g.player.y).toBeCloseTo(38);ticks(g,10);expect(g.player.y).toBeCloseTo(46);expect(g.player.grounded).toBe(true);});
test('jump cannot repeat while airborne',()=>{const g=empty();g.tick({direction:0,jump:true});const first=g.player.rise;g.tick({direction:0,jump:true});expect(g.player.rise).toBeLessThan(first);});
test('diagonal jump climbs a one-crate platform',()=>{const g=empty();g.board[0][1]=1;ticks(g,25,{direction:1,jump:true});expect(g.player.x).toBeGreaterThanOrEqual(8);expect(g.player.y).toBeCloseTo(38);expect(g.over).toBe(false);});
test('jumping beside a two-crate stack pushes the upper crate',()=>{const g=empty();g.board[0][1]=1;g.board[1][1]=2;ticks(g,22,{direction:1,jump:true});expect(g.board[1][1]).toBe(0);expect(g.player.x).toBeGreaterThanOrEqual(8);expect(g.player.y).toBeCloseTo(38);});
test('solid overhead crates stop ascent',()=>{const g=empty();g.board[3][0]=1;g.board[2][0]=1;g.player.x=0;g.player.y=46;g.tick({direction:0,jump:true});expect(g.player.y).toBe(46);});
