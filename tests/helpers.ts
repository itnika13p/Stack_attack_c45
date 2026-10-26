import { Game } from '../src/game/Game';
import type { Input } from '../src/game/GameState';
export function empty(){const g=new Game(123,false);g.cranes=[];return g;}
export function ticks(g:Game,n:number,input:Input={direction:0,jump:false}){for(let i=0;i<n;i++)g.tick({...input,jump:input.jump&&i===0});}
