import { expect,test } from 'vitest';
import { empty,ticks } from './helpers';
test('a falling crate crushes the worker',()=>{const g=empty();g.falling.push({x:0,y:38,pattern:1});g.tick();expect(g.over).toBe(true);expect(g.events).toContain('over');const state=g.ticks;ticks(g,10);expect(g.ticks).toBe(state);});
test('an adjacent falling crate does not crush the worker',()=>{const g=empty();g.falling.push({x:8,y:38,pattern:1});ticks(g,80);expect(g.over).toBe(false);expect(g.board[0][1]).toBe(1);});
test('a new game resets score, loss and crates',()=>{const g=empty();g.over=true;g.score=90;const next=empty();expect(next.score).toBe(0);expect(next.over).toBe(false);expect(next.falling).toHaveLength(0);});
