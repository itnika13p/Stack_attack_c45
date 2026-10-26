import { C, rowY } from './Constants';
import { hitsBoard, overlap } from './Collision';
import { craneCount } from './Difficulty';
import { completeBottom, rowPoints } from './Scoring';
import type { Crate, Crane, Input, Player, PushAnimation, SoundEvent } from './GameState';

/** Pure deterministic simulation. All time is counted in fixed 1/30 s ticks. */
export class Game {
  board:number[][]=Array.from({length:C.rows},()=>Array<number>(C.columns).fill(0));
  player:Player={x:0,y:46,face:1,target:null,rise:0,grounded:true,moving:false,pushing:false};
  falling:Crate[]=[];
  cranes:Crane[]=[];
  pushes:PushAnimation[]=[];
  score=0; lines=0; ticks=0; clearing=0; over=false;
  events:SoundEvent[]=[];
  private seed:number;
  constructor(seed=0x45c45, populated=true) {
    this.seed=seed>>>0 || 1;
    if(populated) {
      // Preserve a gap: never begin with a complete row.
      for(let i=0;i<12;i++) {
        const eligible=Array.from({length:11},(_,c)=>c).filter(c=>!this.board[1][c]);
        const c=eligible[this.random()%eligible.length];
        this.board[this.board[0][c]?1:0][c]=1+this.random()%8;
      }
      let c=this.board[1].findIndex(Boolean); if(c<0)c=0;
      this.player.x=c*8;
      this.player.y=C.floor-16-(this.board[1][c]?16:this.board[0][c]?8:0);
    }
    this.addCrane(30);
  }
  private random() { let x=this.seed; x^=x<<13;x^=x>>>17;x^=x<<5;this.seed=x>>>0;return this.seed; }
  private addCrane(delay:number) {
    const direction=this.random()%2?1:-1;
    this.cranes.push({x:direction===1?-12:100,target:0,direction,phase:'wait',timer:delay,pattern:1});
  }
  private emit(event:SoundEvent) { if(!this.events.includes(event))this.events.push(event); }
  private die(){ if(!this.over){this.over=true;this.emit('over');} }
  private hitsFalling(x:number,y:number,w=8,h=16,skip?:Crate) {
    return this.falling.some(b=>b!==skip && overlap(x,y,w,h,b.x,b.y,8,8));
  }
  private blocked(x:number,y:number) { return hitsBoard(this.board,x,y) || this.hitsFalling(x,y); }
  private updateCranes() {
    for(const crane of this.cranes) {
      if(crane.phase==='wait') {
        if(--crane.timer>0)continue;
        const eligible=Array.from({length:C.columns},(_,c)=>c).filter(c=>!this.board[4][c] && !this.board[5][c] && !this.cranes.some(o=>o!==crane&&(o.phase==='carry'||o.phase==='open')&&o.target===c));
        if(!eligible.length){crane.timer=30;continue;}
        crane.target=eligible[this.random()%eligible.length];crane.pattern=1+this.random()%8;crane.phase='carry';
      }
      if(crane.phase==='carry') {
        const dest=crane.target*8;
        crane.x+=Math.sign(dest-crane.x)*Math.min(C.craneSpeed,Math.abs(dest-crane.x));
        if(crane.x===dest){crane.phase='open';crane.timer=C.craneOpenTicks;}
      } else if(crane.phase==='open') {
        if(--crane.timer<=0){
          // A previous crate may still be below the claw. Wait rather than overlap it.
          if(hitsBoard(this.board,crane.x,14,8,8)||this.hitsFalling(crane.x,14,8,8)){crane.timer=1;continue;}
          this.falling.push({x:crane.x,y:14,pattern:crane.pattern});this.score+=C.dropScore;crane.phase='leave';
        }
      } else if(crane.phase==='leave') {
        crane.x+=crane.direction*C.craneSpeed;
        if(crane.x<-12||crane.x>100){crane.phase='wait';crane.timer=C.craneCooldown;crane.direction=crane.x<0?1:-1;}
      }
    }
  }
  private vertical(jump:boolean) {
    const p=this.player;
    p.grounded=this.blocked(p.x,p.y+0.01);
    if(jump&&p.grounded&&p.rise===0){p.rise=C.jumpHeight;this.emit('jump');}
    if(p.rise>0){
      const dy=Math.min(C.jumpHeight/C.jumpTicks,p.rise);
      if(!this.blocked(p.x,p.y-dy)){p.y-=dy;p.rise=Math.max(0,p.rise-dy);p.grounded=false;}
      else p.rise=0;
      return;
    }
    if(!p.grounded){
      let remaining=C.jumpHeight/C.jumpTicks;
      while(remaining>0.00001){
        const step=Math.min(remaining,0.25);
        if(this.blocked(p.x,p.y+step)){
          // Snap to the closest support, never through it.
          const surfaces=[C.floor,...this.board.flatMap((row,r)=>row.flatMap((v,c)=>v&&overlap(p.x,0,8,64,c*8,0,8,64)?[rowY(r)]:[])),...this.falling.filter(b=>overlap(p.x,0,8,64,b.x,0,8,64)).map(b=>b.y)];
          const support=surfaces.filter(y=>y>=p.y+16-0.001&&y<=p.y+16+step+0.001).sort((a,b)=>a-b)[0];
          if(support!==undefined)p.y=support-16;
          p.grounded=true;this.emit('land');break;
        }
        p.y+=step;remaining-=step;
      }
    }
  }
  private tryPush(dir:-1|1) {
    const p=this.player;
    if(this.clearing||this.pushes.length||Math.abs(p.x/8-Math.round(p.x/8))>0.001)return false;
    const feet=(C.floor-p.y-16)/8;
    if(Math.abs(feet-Math.round(feet))>0.001)return false;
    const r=Math.round(feet),c=Math.round(p.x/8)+dir,to=c+dir;
    if(r<0||r>=C.rows||to<0||to>=C.columns||c<0||c>=C.columns)return false;
    if(!this.board[r][c]||this.board[r+1]?.[c]||this.board[r][to])return false;
    if(this.hitsFalling(to*8,rowY(r),8,8)||hitsBoard(this.board,c*8,p.y,8,8))return false;
    const pattern=this.board[r][c];this.board[r][c]=0;this.board[r][to]=pattern;
    this.pushes.push({from:c,to,row:r,age:0,pattern});p.pushing=true;this.emit('push');return true;
  }
  private horizontal(direction:-1|0|1) {
    const p=this.player;p.moving=false;
    if(direction){
      p.face=direction;
      if(p.target===null || Math.sign(p.target-p.x)!==direction){
        const col=p.x/8;
        p.target=(direction>0?Math.floor(col+0.00001)+1:Math.ceil(col-0.00001)-1)*8;
      }
    }
    if(p.target===null)return;
    const dir=Math.sign(p.target-p.x) as -1|1;
    const dx=dir*Math.min(C.walk,Math.abs(p.target-p.x));
    if(!this.blocked(p.x+dx,p.y)||this.tryPush(dir)) {
      // A push can only free the feet; ensure the head is clear as well.
      if(!this.blocked(p.x+dx,p.y)){p.x+=dx;p.moving=true;}
    } else { p.target=null;p.pushing=false; }
    if(p.target!==null&&Math.abs(p.target-p.x)<0.001){p.x=p.target;p.target=null;p.pushing=false;}
  }
  private gravity() {
    for(let r=1;r<C.rows;r++)for(let c=0;c<C.columns;c++){
      if(!this.board[r][c]||this.board[r-1][c] || this.pushes.some(p=>p.row===r&&p.to===c))continue;
      if(this.hitsFalling(c*8,rowY(r)+0.01,8,8))continue;
      this.falling.push({x:c*8,y:rowY(r),pattern:this.board[r][c]});this.board[r][c]=0;
    }
  }
  private fall() {
    this.falling.sort((a,b)=>b.y-a.y);
    for(const b of [...this.falling]) {
      const next=b.y+C.fall;
      const surfaces=[C.floor,...this.board.flatMap((row,r)=>row.flatMap((v,c)=>v&&c*8===b.x&&rowY(r)>=b.y+8-0.001?[rowY(r)]:[])),...this.falling.filter(o=>o!==b&&o.x===b.x&&o.y>=b.y+8-0.001).map(o=>o.y)];
      const stop=Math.min(...surfaces)-8;
      b.y=Math.min(next,stop);
      if(overlap(b.x,b.y,8,8,this.player.x,this.player.y,8,16)){this.die();return;}
      if(b.y>=stop-0.00001){
        // Only settled support locks a crate to the board; falling piles remain dynamic.
        const r=Math.round((C.floor-b.y)/8)-1;
        const onGrid=Math.abs(b.y-rowY(r))<0.001;
        if(onGrid&&r>=0&&r<C.rows&&(r===0||this.board[r-1][b.x/8])){
          this.board[r][b.x/8]=b.pattern;this.falling.splice(this.falling.indexOf(b),1);this.emit('land');
        }
      }
    }
  }
  tick(input:Input={direction:0,jump:false}) {
    this.events=[];if(this.over)return;this.ticks++;
    if(this.clearing){
      this.clearing--;
      if(!this.clearing){
        this.board[0].fill(0);this.lines++;
        while(this.cranes.length<craneCount(this.lines))this.addCrane(30+this.cranes.length*20);
      }
      // The clear sequence freezes physics, preventing repeated scoring or crush races.
      return;
    }
    this.updateCranes();
    this.vertical(input.jump);this.horizontal(input.direction);
    for(const p of this.pushes)p.age++;
    this.pushes=this.pushes.filter(p=>p.age<16);
    this.fall();if(this.over)return;
    this.gravity();
    if(completeBottom(this.board)&&!this.pushes.length){this.clearing=C.clearTicks;this.score+=rowPoints(this.cranes.length);this.emit('clear');}
    if(this.hitsFalling(this.player.x,this.player.y))this.die();
  }
}
