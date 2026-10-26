import { C,rowY } from '../game/Constants';
import type { Game } from '../game/Game';
import type { Scene } from '../game/GameState';
import type { Save } from '../storage/SaveManager';
import { cratePatterns,worker,workerFront } from './Sprites';
import { pixelText } from './Font';
export const LCD={paper:'#b8bd86',ink:'#252e24'};
export class Renderer {
  constructor(private ctx:CanvasRenderingContext2D){ctx.imageSmoothingEnabled=false;}
  private bitmap(rows:string[],x:number,y:number,mirror=false){
    rows.forEach((row,yy)=>[...row].forEach((pixel,xx)=>{if(pixel==='#')this.ctx.fillRect(Math.round(x+(mirror?row.length-1-xx:xx)),Math.round(y+yy),1,1);}));
  }
  private text(text:string,y:number,scale=1,x?:number){pixelText(this.ctx,text,x??Math.floor((101-(text.length*4-1)*scale)/2),y,scale);}
  private box(x:number,y:number,w:number,h:number){this.ctx.fillStyle=LCD.paper;this.ctx.fillRect(x,y,w,h);this.ctx.fillStyle=LCD.ink;this.ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);}
  crate(x:number,y:number,pattern:number){
    x=Math.round(x);y=Math.round(y);this.ctx.fillStyle=LCD.paper;this.ctx.fillRect(x,y,8,8);this.ctx.fillStyle=LCD.ink;this.ctx.strokeRect(x+0.5,y+0.5,7,7);this.bitmap(cratePatterns[(pattern-1)%8],x,y);
  }
  private world(game:Game){
    const ctx=this.ctx;
    // Narrow brick walls and checkerboard ceiling leave 96 logical pixels for crates.
    for(let y=0;y<4;y++)for(let x=0;x<101;x++)if((x+y)%2===0)ctx.fillRect(x,y,1,1);
    ctx.fillRect(0,5,101,1);ctx.fillRect(0,62,101,2);
    // Static warehouse stipple, reconstructed from the remakes' visible backgrounds.
    let stipple=0x45c45;
    for(let y=7;y<33;y++)for(let x=2;x<98;x++){
      stipple^=stipple<<13;stipple^=stipple>>>17;stipple^=stipple<<5;
      if((stipple>>>0)%101<(33-y)*1.2)ctx.fillRect(x,y,1,1);
    }
    for(let y=6;y<62;y+=4){ctx.fillRect(0,y,1,3);ctx.fillRect(100,y+1,1,3);}
    for(const crane of game.cranes){
      if(crane.phase==='wait')continue;
      const x=Math.round(crane.x)+C.left;
      ctx.fillRect(x+2,2,4,3);ctx.fillRect(x+3,6,2,5);ctx.fillRect(x,11,8,1);
      const open=crane.phase==='leave'||crane.phase==='open';
      ctx.fillRect(x-(open?2:1),12,1,open?4:10);ctx.fillRect(x+(open?9:8),12,1,open?4:10);
      ctx.fillRect(x-(open?2:1),open?15:21,3,1);ctx.fillRect(x+(open?7:6),open?15:21,3,1);
      if(crane.phase==='carry'||crane.phase==='open')this.crate(x,14,crane.pattern);
    }
    game.board.forEach((row,r)=>row.forEach((v,c)=>{
      if(!v||game.pushes.some(p=>p.to===c&&p.row===r))return;
      const x=c*8+C.left,y=rowY(r);
      if(r===0&&game.clearing){
        const frame=Math.floor((C.clearTicks-game.clearing)/4);
        if(frame<2)this.crate(x,y,7-frame);else if(frame<4){ctx.strokeRect(x+1.5,y+1.5,5,5);}else{ctx.fillRect(x+1,y+3,1,1);ctx.fillRect(x+6,y+4,1,1);}
      }else this.crate(x,y,v);
    }));
    game.pushes.forEach(p=>this.crate((p.from+(p.to-p.from)*p.age/16)*8+C.left,rowY(p.row),p.pattern));
    game.falling.forEach(b=>this.crate(b.x+C.left,b.y,b.pattern));
    const p=game.player;
    if(game.over){ctx.fillRect(p.x+C.left,60,8,2);}else this.bitmap(!p.moving&&p.grounded&&!p.pushing?workerFront:worker[p.rise>0||!p.grounded||p.pushing?2:Math.floor(game.ticks/4)%2],p.x+C.left,p.y,p.face<0);
  }
  draw(game:Game,scene:Scene,selection:number,save:Save){
    const ctx=this.ctx;ctx.fillStyle=LCD.paper;ctx.fillRect(0,0,101,64);ctx.fillStyle=LCD.ink;
    if(scene==='title'){
      this.text('STACK',5,2);this.text('ATTACK',18,2);
      this.bitmap(worker[2],13,28);this.crate(24,36,1);this.crate(32,36,7);this.crate(32,28,2);
      ctx.fillRect(10,44,81,1);this.text('BEST '+save.highScore,33,1,48);
      this.text((selection===0?'>':' ')+' START',48);this.text((selection===1?'>':' ')+' OPTIONS',56);
    }else if(scene==='settings'){
      this.text('OPTIONS',3);ctx.fillRect(5,11,91,1);
      const labels=['SOUND '+(save.sound?'ON':'OFF'),'SWIPE '+save.sensitivity.toUpperCase(),'KEYPAD '+(save.keypad?'ON':'OFF'),'FULLSCREEN','BACK'];
      labels.forEach((text,i)=>this.text((selection===i?'>':' ')+' '+text,15+i*9,1,7));
    }else{
      this.world(game);
      if(scene==='paused'){
        this.box(12,10,77,49);this.text('PAUSED',14);this.text('SCORE '+game.score,23);
        ['RESUME','OPTIONS','TITLE'].forEach((label,i)=>this.text((selection===i?'>':' ')+' '+label,33+i*8));
      }else if(scene==='over'){
        this.box(8,13,85,43);this.text('GAME OVER',17);this.text('SCORE '+game.score,26);this.text('BEST '+save.highScore,34);
        this.text((selection===0?'>':' ')+' RESTART',43);this.text((selection===1?'>':' ')+' TITLE',50);
      }
    }
  }
}
