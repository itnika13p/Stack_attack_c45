import { expect,test } from 'vitest';
import { FixedClock } from '../src/game/FixedClock';
test('60, 90 and 120 Hz rendering produce the same number of simulation ticks',()=>{for(const hz of [60,90,120]){const clock=new FixedClock();let n=0;for(let i=0;i<=hz*10;i++)clock.advance(i*1000/hz,()=>n++);expect(n).toBe(300);}});
test('long suspensions and clock resets never cause catch-up',()=>{const clock=new FixedClock();let n=0;clock.advance(0,()=>n++);clock.advance(100000,()=>n++);expect(n).toBe(0);clock.reset();clock.advance(200000,()=>n++);expect(n).toBe(0);});
