import { C } from './Constants';
export const craneCount = (lines:number) => Math.min(C.maxCranes,1+Math.max(0,Math.floor(lines)));
