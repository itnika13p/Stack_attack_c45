import type { Direction } from '../game/GameState';
export type Sensitivity='low'|'normal'|'high';
/** CSS-pixel coordinates converted to the displayed size of one original crate. */
export class SwipeInput {
  sensitivity:Sensitivity='normal';
  private startX=0;private startY=0;private lastX=0;private travel=0;private active=false;private gestured=false;private jumped=false;private taken=false;private released:Direction=0;
  direction:Direction=0;units=0;jump=false;
  down(x:number,y:number){this.cancel();this.active=true;this.startX=this.lastX=x;this.startY=y;}
  move(x:number,y:number,cell:number){
    if(!this.active||cell<=0)return;
    const dx=x-this.lastX;this.lastX=x;
    if(Math.abs(x-this.startX)<cell*0.18&&!this.gestured)return;
    if(dx!==0){
      const dir=Math.sign(dx) as -1|1;
      if(this.direction!==dir){this.direction=dir;this.units=0;this.travel=0;}
      this.travel+=Math.abs(dx);
      const factor={low:1.4,normal:1,high:0.65}[this.sensitivity];
      const threshold=cell*(this.gestured?factor:0.35*factor);
      if(this.travel>=threshold){
        const count=1+Math.floor((this.travel-threshold)/(cell*factor));
        this.units=Math.min(12,this.units+count);this.travel=(this.travel-threshold)%(cell*factor);this.gestured=true;
      }
    }
    if(!this.jumped&&this.startY-y>cell*0.55){this.jump=true;this.jumped=true;this.gestured=true;}
  }
  up(x:number,y:number,cell:number){
    if(!this.active)return;
    if(!this.gestured&&Math.hypot(x-this.startX,y-this.startY)<cell*0.35)this.jump=true;
    this.released=this.units>0&&!this.taken?this.direction:0;
    this.active=false;this.units=0;this.direction=0;this.travel=0;
  }
  takeDirection():Direction{if(this.released){const d=this.released;this.released=0;return d;}if(!this.units)return 0;this.units--;this.taken=true;return this.direction;}
  takeJump(){const value=this.jump;this.jump=false;return value;}
  cancel(){this.active=false;this.units=0;this.direction=0;this.jump=false;this.travel=0;this.gestured=false;this.jumped=false;this.taken=false;this.released=0;}
}
