import { expect,test } from 'vitest';
import { empty,ticks } from './helpers';
import { Game } from '../src/game/Game';
test('push a single crate exactly one cell',()=>{const g=empty();g.board[0][1]=3;g.tick({direction:1,jump:false});ticks(g,15);expect(g.player.x).toBe(8);expect(g.board[0][1]).toBe(0);expect(g.board[0][2]).toBe(3);});
test('falling crates stack without replacing lower crates',()=>{const g=empty();g.board[0][4]=2;g.falling=[{x:32,y:30,pattern:3}];ticks(g,100);expect(g.board[0][4]).toBe(2);expect(g.board[1][4]).toBe(3);expect(g.falling).toHaveLength(0);});
test('unsupported crates settle after support is moved',()=>{const g=empty();g.board[2][5]=2;ticks(g,100);expect(g.board[0][5]).toBe(2);expect(g.board[2][5]).toBe(0);});
test('cranes carry then release and score two points per release',()=>{const g=new Game(1,false);ticks(g,200);expect(g.score).toBeGreaterThanOrEqual(2);expect(g.score%2).toBe(0);expect(g.falling.length+g.board.flat().filter(Boolean).length).toBeGreaterThan(0);});
test('seeded initial layouts and crane choices are reproducible',()=>{const a=new Game(45),b=new Game(45);ticks(a,300);ticks(b,300);expect(JSON.stringify(a)).toBe(JSON.stringify(b));expect(new Game(45).board.flat().filter(Boolean)).toHaveLength(12);});
