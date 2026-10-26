import { C, rowY } from './Constants';
export function overlap(ax:number, ay:number, aw:number, ah:number, bx:number, by:number, bw:number, bh:number) {
  const epsilon=0.00001;
  return ax < bx+bw-epsilon && ax+aw > bx+epsilon && ay < by+bh-epsilon && ay+ah > by+epsilon;
}
export function hitsBoard(board:number[][], x:number,y:number,w=8,h=16):boolean {
  if(x<0 || x+w>C.columns*C.cell || y<C.ceiling || y+h>C.floor+0.00001) return true;
  return board.some((row,r)=>row.some((v,c)=>v!==0 && overlap(x,y,w,h,c*8,rowY(r),8,8)));
}
