import { C } from './Constants';
export const rowPoints = (cranes:number) => C.rowScore*cranes;
export const completeBottom = (board:number[][]) => board[0].every(v=>v>0);
