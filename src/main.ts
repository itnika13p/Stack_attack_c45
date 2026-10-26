import './style.css';
import { Game } from './game/Game';
import { FixedClock } from './game/FixedClock';
import type { Scene } from './game/GameState';
import { Renderer } from './rendering/Renderer';
import { InputManager } from './input/InputManager';
import { KeyboardInput } from './input/KeyboardInput';
import { SaveManager } from './storage/SaveManager';
import { AudioManager } from './audio/AudioManager';

const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
const keypad=document.querySelector<HTMLDivElement>('#keypad')!;
const status=document.querySelector<HTMLParagraphElement>('#status')!;
const context=canvas.getContext('2d',{alpha:false})!;
const renderer=new Renderer(context),input=new InputManager(),audio=new AudioManager(),clock=new FixedClock();
let storage:Storage|undefined;try{storage=localStorage;}catch{/* optional */}
const save=new SaveManager(storage);
let game=new Game(),scene:Scene='title',selection=0,fromPause=false,pointer:number|null=null,menuDown:{x:number;y:number}|null=null;
function fit(){
  const style=getComputedStyle(document.body);
  const width=innerWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  const height=innerHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-(save.data.keypad?110:0);
  const max=Math.min(width/101,height/64,8);
  const scale=max>=1?Math.floor(max):max;
  canvas.style.width=`${101*scale}px`;canvas.style.height=`${64*scale}px`;
}
function preferences(){input.swipe.sensitivity=save.data.sensitivity;audio.enabled=save.data.sound;keypad.hidden=!save.data.keypad;save.persist();fit();}
function setScene(next:Scene){scene=next;selection=0;input.clear();clock.reset();pointer=null;menuDown=null;
  status.textContent=next==='playing'?'Playing. Swipe to move, tap to jump. Tap top rail to pause.':next==='over'?`Game over. Score ${game.score}. Best ${save.data.highScore}. Restart or title.`:next==='settings'?'Options: sound, swipe sensitivity, keypad, fullscreen, back.':next==='paused'?`Paused. Score ${game.score}. Resume, options, or title.`:'Stack Attack. Start or options.';
  canvas.dataset.scene=next;
}
function start(){game=new Game(crypto.getRandomValues(new Uint32Array(1))[0]);setScene('playing');}
function pause(){if(scene==='playing')setScene('paused');}
function choose(){
  audio.unlock();audio.play('menu');
  if(scene==='title'){if(selection===0)start();else{fromPause=false;setScene('settings');}}
  else if(scene==='paused'){if(selection===0)setScene('playing');else if(selection===1){fromPause=true;setScene('settings');}else setScene('title');}
  else if(scene==='over'){if(selection===0)start();else setScene('title');}
  else if(scene==='settings'){
    if(selection===0)save.data.sound=!save.data.sound;
    if(selection===1){const levels=['low','normal','high'] as const;save.data.sensitivity=levels[(levels.indexOf(save.data.sensitivity)+1)%3];}
    if(selection===2)save.data.keypad=!save.data.keypad;
    if(selection===3){if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});else void document.documentElement.requestFullscreen?.().catch(()=>{});}
    if(selection===4)setScene(fromPause?'paused':'title');
    preferences();
  }
}
function menuCount(){return scene==='settings'?5:scene==='paused'?3:2;}
window.addEventListener('keydown',event=>{
  if(!KeyboardInput.handles(event.code))return;event.preventDefault();audio.unlock();
  if(event.code==='KeyM'&&!event.repeat){save.data.sound=!save.data.sound;preferences();return;}
  if(event.code==='KeyF'&&!event.repeat){void document.documentElement.requestFullscreen?.().catch(()=>{});return;}
  if(scene==='playing'){
    if((event.code==='Enter'||event.code==='Escape')&&!event.repeat)pause();else input.keyboard.down(event.code,event.repeat);
  }else if(!event.repeat){
    if(event.code==='Escape'){if(scene==='settings')setScene(fromPause?'paused':'title');else if(scene==='paused')setScene('playing');else setScene('title');}
    else if(['ArrowDown','KeyS','ArrowRight','KeyD'].includes(event.code))selection=(selection+1)%menuCount();
    else if(['ArrowUp','KeyW','ArrowLeft','KeyA'].includes(event.code))selection=(selection+menuCount()-1)%menuCount();
    else if(event.code==='Enter'||event.code==='Space')choose();
  }
});
window.addEventListener('keyup',event=>input.keyboard.up(event.code));
function point(event:PointerEvent){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)/rect.width*101,y:(event.clientY-rect.top)/rect.height*64};}
function cell(){return canvas.getBoundingClientRect().width/101*8;}
canvas.addEventListener('pointerdown',event=>{
  if(pointer!==null||!event.isPrimary||event.button!==0)return;
  event.preventDefault();audio.unlock();canvas.focus({preventScroll:true});
  const p=point(event);
  if(scene==='playing'&&p.y<12){pause();return;}
  pointer=event.pointerId;canvas.setPointerCapture(pointer);
  if(scene==='playing')input.swipe.down(event.clientX,event.clientY);else menuDown=p;
});
canvas.addEventListener('pointermove',event=>{if(event.pointerId===pointer&&scene==='playing')input.swipe.move(event.clientX,event.clientY,cell());});
canvas.addEventListener('pointerup',event=>{
  if(event.pointerId!==pointer)return;
  pointer=null;
  if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
  if(scene==='playing')input.swipe.up(event.clientX,event.clientY,cell());
  else if(menuDown){
    const p=point(event);if(Math.hypot(p.x-menuDown.x,p.y-menuDown.y)>5){menuDown=null;return;}
    let picked=-1;
    if(scene==='title')picked=p.y>=45?(p.y<54?0:1):-1;
    else if(scene==='settings')picked=Math.floor((p.y-13)/9);
    else if(scene==='paused')picked=Math.floor((p.y-31)/8);
    else if(scene==='over')picked=p.y>=40?(p.y<49?0:1):-1;
    if(picked>=0&&picked<menuCount()){selection=picked;choose();}
    menuDown=null;
  }
});
function cancelPointer(event:PointerEvent){if(pointer===event.pointerId){pointer=null;menuDown=null;input.swipe.cancel();}}
canvas.addEventListener('pointercancel',cancelPointer);canvas.addEventListener('lostpointercapture',cancelPointer);
keypad.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{
  const release=()=>{input.keypad=0;input.keypadJump=false;};
  button.addEventListener('pointerdown',event=>{
    event.preventDefault();button.setPointerCapture(event.pointerId);audio.unlock();const key=button.dataset.key;
    if(key==='0'){if(scene==='playing')pause();else if(scene==='paused')setScene('playing');return;}
    if(scene!=='playing')return;
    input.keypad=key==='4'||key==='7'?-1:key==='6'||key==='9'?1:0;
    if(['7','8','9'].includes(key!))input.keypadJump=true;
  });
  button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
});
window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();input.clear();audio.suspend();}clock.reset();});
window.addEventListener('blur',()=>{pause();input.clear();clock.reset();});
function frame(now:number){
  if(scene==='playing')clock.advance(now,()=>{
    if(scene!=='playing')return;
    game.tick(input.sample(game));game.events.forEach(event=>audio.play(event));
    if(game.over){save.record(game.score);setScene('over');}
  });
  renderer.draw(game,scene,selection,save.data);requestAnimationFrame(frame);
}
preferences();setScene('title');requestAnimationFrame(frame);
