import { expect,test } from 'vitest';
import { hitsBoard,overlap } from '../src/game/Collision';
import { empty,ticks } from './helpers';
test('touching edges are not overlaps',()=>{expect(overlap(0,0,8,8,8,0,8,8)).toBe(false);expect(overlap(0,0,8,8,7,0,8,8)).toBe(true);});
test('a tall stack stops player and cannot be pushed from ground',()=>{const g=empty();g.board[0][1]=1;g.board[1][1]=2;ticks(g,60,{direction:1,jump:false});expect(g.player.x).toBe(0);expect(g.board[0][1]).toBe(1);expect(hitsBoard(g.board,g.player.x,g.player.y)).toBe(false);});
test('cannot push a chain or through a wall',()=>{const g=empty();g.board[0][1]=1;g.board[0][2]=1;ticks(g,30,{direction:1,jump:false});expect(g.player.x).toBe(0);g.board[0].fill(0);g.player.x=80;g.board[0][11]=1;ticks(g,30,{direction:1,jump:false});expect(g.player.x).toBe(80);});
