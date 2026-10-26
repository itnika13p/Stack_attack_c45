import { C } from './Constants';
export class FixedClock {
  private previous:number|null=null; private accumulator=0;
  reset(){this.previous=null;this.accumulator=0;}
  advance(now:number,step:()=>void){
    if(this.previous===null){this.previous=now;return;}
    const elapsed=Math.max(0,now-this.previous);this.previous=now;
    // A suspension is a pause, not a debt of simulation work.
    if(elapsed>250){this.accumulator=0;return;}
    this.accumulator+=elapsed;
    while(this.accumulator+1e-7>=1000/C.hz){step();this.accumulator-=1000/C.hz;}
  }
}
