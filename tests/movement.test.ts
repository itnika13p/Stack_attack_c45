import { expect,test } from 'vitest';
import { empty,ticks } from './helpers';
test('left and right travel one aligned cell at the original speed limit',()=>{const g=empty();ticks(g,16,{direction:1,jump:false});expect(g.player.x).toBe(8);ticks(g,16,{direction:-1,jump:false});expect(g.player.x).toBe(0);});
test('boundaries hold under long input',()=>{const g=empty();ticks(g,500,{direction:1,jump:false});expect(g.player.x).toBe(88);ticks(g,500,{direction:-1,jump:false});expect(g.player.x).toBe(0);});
test('a released discrete input finishes its committed grid step without repeating',()=>{const g=empty();g.tick({direction:1,jump:false});ticks(g,60);expect(g.player.x).toBe(8);});
test('reverse input changes direction on the next tick',()=>{const g=empty();ticks(g,8,{direction:1,jump:false});const x=g.player.x;g.tick({direction:-1,jump:false});expect(g.player.x).toBeLessThan(x);ticks(g,30);expect(g.player.x).toBe(0);});
